'use strict';

require('dotenv').config();
const required = (k) => { const v = process.env[k]; if (!v) throw new Error(`[ENV] Missing: ${k}`); return v; };
const optional = (k, fb = '') => process.env[k] || fb;

module.exports = {
  NODE_ENV:      optional('NODE_ENV', 'development'),
  PORT:          parseInt(optional('PORT', '5004'), 10),
  MONGODB_URI:   required('MONGODB_URI'),
  REDIS_URI:     optional('REDIS_URI', 'redis://localhost:6379'),
  KAFKA_BROKERS: optional('KAFKA_BROKERS', 'localhost:9092').split(','),
  KAFKA_CLIENT_ID: optional('KAFKA_CLIENT_ID', 'finance-service'),
  DEFAULT_CURRENCY: optional('DEFAULT_CURRENCY', 'USD'),
  APPLICATION_FEE_AMOUNT: parseFloat(optional('APPLICATION_FEE_AMOUNT', '50')),
  TUITION_FEE_PER_CREDIT: parseFloat(optional('TUITION_FEE_PER_CREDIT', '200')),
};
