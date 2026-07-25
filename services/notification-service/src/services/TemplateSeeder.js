'use strict';

const NotificationTemplate = require('../models/NotificationTemplate.model');

// Default templates seeded on startup
const DEFAULT_TEMPLATES = [
  {
    slug: 'welcome-student',
    name: 'Welcome Student',
    channel: 'EMAIL',
    subject: 'Welcome to {{appName}}!',
    bodyHtml: `<h1>Welcome, {{firstName}}!</h1><p>Your student account has been created at <strong>{{appName}}</strong>.</p><p>Your temporary password is: <code>{{tempPassword}}</code></p><p>Please <a href="{{appUrl}}/auth/login">log in</a> and change your password immediately.</p><p>Your Student ID: <strong>{{studentId}}</strong></p>`,
    bodyText: `Welcome {{firstName}}! Your temporary password is: {{tempPassword}}. Log in at {{appUrl}}/auth/login`,
    variables: [{ name: 'firstName', description: 'Student first name', required: true }, { name: 'tempPassword', description: 'Temporary password', required: true }],
  },
  {
    slug: 'login-alert',
    name: 'Login Security Alert',
    channel: 'EMAIL',
    subject: 'New login to your {{appName}} account',
    bodyHtml: `<p>Hi,</p><p>We detected a new login to your account from <strong>{{ipAddress}}</strong> at {{timestamp}}.</p><p>If this wasn't you, please <a href="{{appUrl}}/auth/change-password">change your password immediately</a>.</p>`,
    bodyText: `New login from {{ipAddress}} at {{timestamp}}. Not you? Change your password at {{appUrl}}/auth/change-password`,
    variables: [{ name: 'ipAddress', required: false }, { name: 'timestamp', required: true }],
  },
  {
    slug: 'password-changed',
    name: 'Password Changed',
    channel: 'EMAIL',
    subject: 'Your {{appName}} password was changed',
    bodyHtml: `<p>Your account password was successfully changed. If you did not make this change, contact support immediately.</p>`,
    bodyText: `Your password was changed. Contact support if you did not do this.`,
    variables: [],
  },
  {
    slug: 'account-locked',
    name: 'Account Locked',
    channel: 'EMAIL',
    subject: 'Your {{appName}} account has been locked',
    bodyHtml: `<p>Your account has been temporarily locked due to <strong>{{reason}}</strong>. It will unlock automatically after {{lockDuration}} minutes. Contact support for assistance.</p>`,
    bodyText: `Account locked due to {{reason}}. Contact support.`,
    variables: [{ name: 'reason', required: true }, { name: 'lockDuration', required: true }],
  },
  {
    slug: 'application-received',
    name: 'Application Received',
    channel: 'EMAIL',
    subject: 'Application Received — {{appName}}',
    bodyHtml: `<h2>Application Received</h2><p>Dear {{applicantName}}, we have received your application for <strong>{{programName}}</strong>. Application ID: <code>{{applicationId}}</code>.</p>`,
    bodyText: `Application received for {{programName}}. ID: {{applicationId}}`,
    variables: [{ name: 'applicantName', required: true }, { name: 'programName', required: true }, { name: 'applicationId', required: true }],
  },
  {
    slug: 'enrollment-confirmed',
    name: 'Enrollment Confirmed',
    channel: 'EMAIL',
    subject: 'Enrollment Confirmed — {{courseTitle}}',
    bodyHtml: `<p>You have been successfully enrolled in <strong>{{courseTitle}}</strong> ({{sectionCode}}) for <strong>{{semesterName}}</strong>.</p>`,
    bodyText: `Enrolled in {{courseTitle}} ({{sectionCode}}) for {{semesterName}}.`,
    variables: [{ name: 'courseTitle', required: true }, { name: 'sectionCode', required: true }, { name: 'semesterName', required: false }],
  },
  {
    slug: 'enrollment-failed',
    name: 'Enrollment Failed',
    channel: 'EMAIL',
    subject: 'Enrollment Could Not Be Completed',
    bodyHtml: `<p>Unfortunately, your enrollment attempt failed. Reason: <strong>{{reason}}</strong>. Please try again or contact your advisor.</p>`,
    bodyText: `Enrollment failed: {{reason}}`,
    variables: [{ name: 'reason', required: true }],
  },
  {
    slug: 'payment-receipt',
    name: 'Payment Receipt',
    channel: 'EMAIL',
    subject: 'Payment Receipt — {{appName}}',
    bodyHtml: `<p>Payment of <strong>{{currency}} {{amount}}</strong> received. Transaction ID: <code>{{transactionId}}</code>. Purpose: {{purpose}}.</p>`,
    bodyText: `Payment of {{currency}} {{amount}} received. TxID: {{transactionId}}`,
    variables: [{ name: 'amount', required: true }, { name: 'currency', required: true }, { name: 'transactionId', required: true }],
  },
  {
    slug: 'grade-published',
    name: 'Grade Published',
    channel: 'EMAIL',
    subject: 'Your Grade for {{courseTitle}} has been Published',
    bodyHtml: `<p>Your grade for <strong>{{courseTitle}}</strong> has been published: <strong style="font-size: 24px">{{grade}}</strong>. GPA: {{gpa}}.</p>`,
    bodyText: `Grade for {{courseTitle}}: {{grade}}. GPA: {{gpa}}`,
    variables: [{ name: 'courseTitle', required: true }, { name: 'grade', required: true }, { name: 'gpa', required: false }],
  },
  {
    slug: 'low-attendance-warning',
    name: 'Low Attendance Warning',
    channel: 'EMAIL',
    subject: 'Low Attendance Warning — {{courseTitle}}',
    bodyHtml: `<p>⚠️ Your attendance in <strong>{{courseTitle}}</strong> is <strong>{{attendancePercent}}%</strong>, which is below the required {{threshold}}%. Please attend classes regularly to avoid academic consequences.</p>`,
    bodyText: `Low attendance in {{courseTitle}}: {{attendancePercent}}%. Required: {{threshold}}%`,
    variables: [{ name: 'courseTitle', required: true }, { name: 'attendancePercent', required: true }, { name: 'threshold', required: true }],
  },
];

const seedTemplates = async () => {
  for (const template of DEFAULT_TEMPLATES) {
    await NotificationTemplate.findOneAndUpdate(
      { slug: template.slug },
      template,
      { upsert: true, new: true }
    );
  }
};

module.exports = { seedTemplates };
