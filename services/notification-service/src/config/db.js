'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const SERVICE = 'notification-service';
const ts = () => new Date().toISOString();
const fmt = (l, m, meta = {}) => JSON.stringify({ timestamp: ts(), level: l, service: SERVICE, message: m, ...meta });
const logger = { info: (m, meta) => console.log(fmt('INFO', m, meta)), warn: (m, meta) => console.warn(fmt('WARN', m, meta)), error: (m, meta) => console.error(fmt('ERROR', m, meta)), debug: (m, meta) => { if (process.env.NODE_ENV === 'development') console.log(fmt('DEBUG', m, meta)); } };

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  mongoose.connection.on('connected', () => { isConnected = true; logger.info('[DB] MongoDB connected'); });
  mongoose.connection.on('error', (err) => logger.error('[DB] Error', { error: err.message }));
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
};
const disconnectDB = async () => { if (isConnected) { await mongoose.connection.close(); isConnected = false; } };
const isDBHealthy = () => mongoose.connection.readyState === 1;

module.exports = { connectDB, disconnectDB, isDBHealthy, logger };
