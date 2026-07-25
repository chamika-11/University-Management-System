'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../utils/logger');

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  mongoose.connection.on('connected', () => { isConnected = true; logger.info('[DB] MongoDB connected'); });
  mongoose.connection.on('error', (err) => logger.error('[DB] Error', { error: err.message }));
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
};
const disconnectDB = async () => { if (isConnected) { await mongoose.connection.close(); isConnected = false; } };
const isDBHealthy = () => mongoose.connection.readyState === 1;
module.exports = { connectDB, disconnectDB, isDBHealthy };
