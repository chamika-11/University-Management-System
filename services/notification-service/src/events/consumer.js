'use strict';

const { kafka, registerConsumer } = require('../config/kafka');
const dispatcher = require('../services/NotificationDispatchService');

const ts = () => new Date().toISOString();
const logger = {
  info: (m, meta) => console.log(JSON.stringify({ timestamp: ts(), level: 'INFO', service: 'notification-service', message: m, ...meta })),
  warn: (m, meta) => console.warn(JSON.stringify({ timestamp: ts(), level: 'WARN', service: 'notification-service', message: m, ...meta })),
  error: (m, meta) => console.error(JSON.stringify({ timestamp: ts(), level: 'ERROR', service: 'notification-service', message: m, ...meta })),
};

const CONSUMER_GROUP = 'notification-service-group';

/**
 * Maps eventType → dispatch parameters.
 * Each entry returns null if event should be ignored, or { templateSlug, recipientId, recipientEmail, variables, metadata }
 */
const EVENT_ROUTING = {
  'user.registered': (payload) => ({
    templateSlug: 'welcome-student',
    recipientId: payload.userId,
    recipientEmail: payload.email,
    variables: { firstName: payload.firstName || 'Student', tempPassword: payload.tempPassword || '(see admin)', studentId: payload.studentId || '' },
  }),

  'user.login': (payload) => ({
    templateSlug: 'login-alert',
    recipientId: payload.userId,
    recipientEmail: payload.email,
    variables: { ipAddress: payload.ip || 'Unknown', timestamp: new Date(payload.timestamp).toLocaleString() },
  }),

  'user.password_changed': (payload) => ({
    templateSlug: 'password-changed',
    recipientId: payload.userId,
    recipientEmail: payload.email,
    variables: {},
  }),

  'user.account_locked': (payload) => ({
    templateSlug: 'account-locked',
    recipientId: payload.userId,
    recipientEmail: payload.email,
    variables: { reason: payload.reason || 'Too many failed login attempts', lockDuration: '30' },
  }),

  'admission.application_submitted': (payload) => ({
    templateSlug: 'application-received',
    recipientId: payload.applicantId,
    recipientEmail: payload.email,
    variables: { applicantName: payload.applicantName, programName: payload.programName, applicationId: payload.applicationId },
  }),

  'academic.enrollment_confirmed': (payload) => ({
    templateSlug: 'enrollment-confirmed',
    recipientId: payload.studentId,
    recipientEmail: payload.studentEmail,
    variables: { courseTitle: payload.courseTitle || 'Course', sectionCode: payload.sectionCode || '', semesterName: payload.semesterName || '' },
    metadata: { enrollmentId: payload.enrollmentId },
  }),

  'academic.enrollment_failed': (payload) => ({
    templateSlug: 'enrollment-failed',
    recipientId: payload.studentId,
    recipientEmail: payload.studentEmail,
    variables: { reason: payload.reason || 'An error occurred' },
  }),

  'finance.payment_completed': (payload) => ({
    templateSlug: 'payment-receipt',
    recipientId: payload.userId,
    recipientEmail: payload.email,
    variables: { amount: payload.amount, currency: payload.currency || 'USD', transactionId: payload.transactionId, purpose: payload.purpose },
    metadata: { transactionId: payload.transactionId },
  }),

  'grading.grade_published': (payload) => ({
    templateSlug: 'grade-published',
    recipientId: payload.studentId,
    recipientEmail: payload.studentEmail,
    variables: { courseTitle: payload.courseTitle, grade: payload.grade, gpa: payload.gpa || 'N/A' },
  }),

  'timetable.low_attendance_alert': (payload) => ({
    templateSlug: 'low-attendance-warning',
    recipientId: payload.studentId,
    recipientEmail: payload.studentEmail,
    variables: { courseTitle: payload.courseTitle || 'Course', attendancePercent: payload.percentage, threshold: payload.threshold },
  }),
};

const ALL_TOPICS = ['user.events', 'admission.events', 'academic.events', 'finance.events', 'grading.events', 'timetable.events'];

const startConsumers = async () => {
  const consumer = kafka.consumer({ groupId: CONSUMER_GROUP, sessionTimeout: 30000 });
  registerConsumer(consumer);

  try {
    await consumer.connect();
    await consumer.subscribe({ topics: ALL_TOPICS, fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const raw = message.value?.toString();
          if (!raw) return;

          const event = JSON.parse(raw);
          const { eventType, payload } = event;

          const routeFn = EVENT_ROUTING[eventType];
          if (!routeFn) return; // No route for this event type

          const dispatchParams = routeFn(payload);
          if (!dispatchParams || !dispatchParams.recipientId) return;

          await dispatcher.dispatch({ ...dispatchParams, channel: 'EMAIL' });
        } catch (err) {
          logger.error('[Consumer] Failed to process message', { topic, error: err.message });
        }
      },
    });

    logger.info('[Consumer] Notification service listening on all topics', { topics: ALL_TOPICS });
  } catch (err) {
    logger.warn('[Consumer] Failed to start', { error: err.message });
  }
};

module.exports = { startConsumers };
