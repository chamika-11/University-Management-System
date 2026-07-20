'use strict';

require('dotenv').config();

const required = (key) => {
  const val = process.env[key];
  if (!val) throw new Error(`[ENV] Missing required variable: ${key}`);
  return val;
};

const optional = (key, fallback = '') => process.env[key] || fallback;

module.exports = {
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: parseInt(optional('PORT', '5002'), 10),

  // Database
  MONGODB_URI: required('MONGODB_URI'),

  // Redis
  REDIS_URI: optional('REDIS_URI', 'redis://localhost:6379'),

  // Kafka
  KAFKA_BROKERS: optional('KAFKA_BROKERS', 'localhost:9092').split(','),
  KAFKA_CLIENT_ID: optional('KAFKA_CLIENT_ID', 'user-service'),

  // JWT
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: optional('JWT_EXPIRES_IN', '15m'),
  JWT_REFRESH_EXPIRES_IN: optional('JWT_REFRESH_EXPIRES_IN', '7d'),

  // Security
  BCRYPT_SALT_ROUNDS: parseInt(optional('BCRYPT_SALT_ROUNDS', '12'), 10),
  MAX_LOGIN_ATTEMPTS: parseInt(optional('MAX_LOGIN_ATTEMPTS', '5'), 10),
  LOCK_DURATION_MINUTES: parseInt(optional('LOCK_DURATION_MINUTES', '30'), 10),

  // MFA
  MFA_ISSUER: optional('MFA_ISSUER', 'ULMS University'),
};
