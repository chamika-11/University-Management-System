'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../utils/logger');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('[DB] MONGODB_URI is not defined');

  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    isConnected = true;
    logger.info('[DB] MongoDB connected successfully');
  });
  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    logger.warn('[DB] MongoDB disconnected');
  });
  mongoose.connection.on('error', (err) => {
    logger.error('[DB] MongoDB connection error:', err.message);
  });

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 2,
  });
};

const disconnectDB = async () => {
  if (!isConnected) return;
  await mongoose.connection.close();
  isConnected = false;
  logger.info('[DB] MongoDB disconnected gracefully');
};

const isDBHealthy = () => mongoose.connection.readyState === 1;

module.exports = { connectDB, disconnectDB, isDBHealthy };
