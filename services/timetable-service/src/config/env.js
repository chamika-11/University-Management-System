'use strict';

require('dotenv').config();
const optional = (key, fb = '') => process.env[key] || fb;
const required = (key) => { const v = process.env[key]; if (!v) throw new Error(`[ENV] Missing: ${key}`); return v; };

module.exports = {
  NODE_ENV:     optional('NODE_ENV', 'development'),
  PORT:         parseInt(optional('PORT', '5011'), 10),
  MONGODB_URI:  required('MONGODB_URI'),
  REDIS_URI:    optional('REDIS_URI', 'redis://localhost:6379'),
  KAFKA_BROKERS: optional('KAFKA_BROKERS', 'localhost:9092').split(','),
  KAFKA_CLIENT_ID: optional('KAFKA_CLIENT_ID', 'timetable-service'),
  ATTENDANCE_LOW_THRESHOLD: parseInt(optional('ATTENDANCE_LOW_THRESHOLD', '75'), 10),
};
