'use strict';

require('dotenv').config();

const optional = (key, fb = '') => process.env[key] || fb;
const required = (key) => { const v = process.env[key]; if (!v) throw new Error(`[ENV] Missing: ${key}`); return v; };

module.exports = {
  NODE_ENV:      optional('NODE_ENV', 'development'),
  PORT:          parseInt(optional('PORT', '5015'), 10),
  MONGODB_URI:   required('MONGODB_URI'),
  KAFKA_BROKERS: optional('KAFKA_BROKERS', 'localhost:9092').split(','),
  KAFKA_CLIENT_ID: optional('KAFKA_CLIENT_ID', 'notification-service'),
  SMTP_HOST:     optional('SMTP_HOST', 'smtp.ethereal.email'),
  SMTP_PORT:     parseInt(optional('SMTP_PORT', '587'), 10),
  SMTP_SECURE:   optional('SMTP_SECURE', 'false') === 'true',
  SMTP_USER:     optional('SMTP_USER'),
  SMTP_PASS:     optional('SMTP_PASS'),
  EMAIL_FROM:    optional('EMAIL_FROM', 'noreply@ulms.edu'),
  APP_NAME:      optional('APP_NAME', 'ULMS University'),
  APP_URL:       optional('APP_URL', 'http://localhost:3000'),
};
