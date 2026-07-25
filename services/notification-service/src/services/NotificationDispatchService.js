'use strict';

const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');
const NotificationTemplate = require('../models/NotificationTemplate.model');
const NotificationLog = require('../models/NotificationLog.model');
const UserPreference = require('../models/UserPreference.model');
const env = require('../config/env');

const ts = () => new Date().toISOString();
const logger = {
  info: (m, meta) => console.log(JSON.stringify({ timestamp: ts(), level: 'INFO', service: 'notification-service', message: m, ...meta })),
  warn: (m, meta) => console.warn(JSON.stringify({ timestamp: ts(), level: 'WARN', service: 'notification-service', message: m, ...meta })),
  error: (m, meta) => console.error(JSON.stringify({ timestamp: ts(), level: 'ERROR', service: 'notification-service', message: m, ...meta })),
};

// Create SMTP transporter — uses Ethereal for dev, real SMTP in prod
let transporter;
const getTransporter = () => {
  if (transporter) return transporter;
  if (env.SMTP_USER && env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  } else {
    // Development: use Ethereal auto-account
    logger.warn('[EmailService] No SMTP credentials — using test account. Emails will be visible at https://ethereal.email');
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: 'ethereal@example.com', pass: 'etherealpass' },
    });
  }
  return transporter;
};

class NotificationDispatchService {
  /**
   * Main dispatch entry point.
   * @param {string} templateSlug - which template to use
   * @param {string} recipientId - user ID
   * @param {string} recipientEmail - email address
   * @param {Object} variables - template variables
   */
  async dispatch({ templateSlug, recipientId, recipientEmail, variables = {}, channel = 'EMAIL', metadata = {} }) {
    // 1. Check user preferences
    const pref = await UserPreference.findOne({ userId: recipientId });
    if (pref) {
      if (channel === 'EMAIL' && !pref.channels.email) { logger.info('[Dispatch] Email notifications disabled by user', { recipientId }); return; }
      if (pref.mutedTopics.includes(templateSlug)) { logger.info('[Dispatch] Topic muted by user', { recipientId, templateSlug }); return; }
    }

    // 2. Get template
    const template = await NotificationTemplate.findOne({ slug: templateSlug, isActive: true });
    if (!template) { logger.warn('[Dispatch] Template not found', { templateSlug }); return; }

    // 3. Render template with Handlebars
    const appVars = { appName: env.APP_NAME, appUrl: env.APP_URL, year: new Date().getFullYear(), ...variables };
    const subject = Handlebars.compile(template.subject)(appVars);
    const bodyHtml = Handlebars.compile(template.bodyHtml)(appVars);
    const bodyText = Handlebars.compile(template.bodyText)(appVars);

    // 4. Create log record
    const log = await NotificationLog.create({
      recipientId,
      recipientEmail,
      channel,
      templateSlug,
      subject,
      status: 'PENDING',
      metadata,
    });

    // 5. Dispatch
    if (channel === 'EMAIL') {
      await this._sendEmail({ to: recipientEmail, subject, html: bodyHtml, text: bodyText, logId: log._id });
    }

    return log;
  }

  async _sendEmail({ to, subject, html, text, logId }) {
    try {
      const info = await getTransporter().sendMail({
        from: `"${env.APP_NAME}" <${env.EMAIL_FROM}>`,
        to,
        subject,
        html,
        text,
      });
      await NotificationLog.findByIdAndUpdate(logId, { status: 'SENT', sentAt: new Date() });
      logger.info('[EmailService] Email sent', { messageId: info.messageId, to });
      // In dev mode, log preview URL
      if (env.NODE_ENV === 'development') logger.info('[EmailService] Preview:', { url: nodemailer.getTestMessageUrl(info) });
    } catch (err) {
      await NotificationLog.findByIdAndUpdate(logId, { status: 'FAILED', failureReason: err.message, $inc: { retryCount: 1 } });
      logger.error('[EmailService] Send failed', { error: err.message, to });
    }
  }
}

module.exports = new NotificationDispatchService();
