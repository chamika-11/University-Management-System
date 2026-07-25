'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../utils/logger');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  mongoose.set('strictQuery', true);
  mongoose.connection.on('connected', () => { isConnected = true; logger.info('[DB] MongoDB connected'); });
  mongoose.connection.on('disconnected', () => { isConnected = false; logger.warn('[DB] MongoDB disconnected'); });
  mongoose.connection.on('error', (err) => logger.error('[DB] MongoDB error:', err.message));
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
};

const disconnectDB = async () => {
  if (!isConnected) return;
  await mongoose.connection.close();
  isConnected = false;
  logger.info('[DB] MongoDB disconnected gracefully');
};

module.exports = { connectDB, disconnectDB, isDBHealthy: () => mongoose.connection.readyState === 1 };
