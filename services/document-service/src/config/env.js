'use strict';

require('dotenv').config();
const required = (k) => { const v = process.env[k]; if (!v) throw new Error(`[ENV] Missing: ${k}`); return v; };
const optional = (k, fb = '') => process.env[k] || fb;

module.exports = {
  NODE_ENV:      optional('NODE_ENV', 'development'),
  PORT:          parseInt(optional('PORT', '5005'), 10),
  MONGODB_URI:   required('MONGODB_URI'),
  REDIS_URI:     optional('REDIS_URI', 'redis://localhost:6379'),
  KAFKA_BROKERS: optional('KAFKA_BROKERS', 'localhost:9092').split(','),
  KAFKA_CLIENT_ID: optional('KAFKA_CLIENT_ID', 'document-service'),
  UPLOAD_DIR:    optional('UPLOAD_DIR', 'services/document-service/uploads'),
  ALLOWED_FILE_TYPES: optional('ALLOWED_FILE_TYPES', 'image/jpeg,image/png,application/pdf').split(','),
  MAX_FILE_SIZE_BYTES: parseInt(optional('MAX_FILE_SIZE_BYTES', '10485760'), 10),
};
