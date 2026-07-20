'use strict';

const redis = require('redis');
const env = require('./env');
const logger = require('../utils/logger');

let client = null;
let isConnected = false;

const connectRedis = async () => {
  client = redis.createClient({
    url: env.REDIS_URI,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 3) return new Error('Redis max reconnection attempts reached');
        return Math.min(retries * 200, 1000);
      },
    },
  });

  client.on('connect', () => logger.info('[Redis] Connected'));
  client.on('ready', () => { isConnected = true; });
  client.on('error', (err) => logger.error('[Redis] Error:', err.message));
  client.on('end', () => { isConnected = false; });

  try {
    await client.connect();
  } catch (err) {
    logger.warn(`[Redis] Failed to connect: ${err.message}. Caching disabled.`);
    client = null;
  }
};

const disconnectRedis = async () => {
  if (client) {
    await client.quit();
    isConnected = false;
    logger.info('[Redis] Disconnected gracefully');
  }
};

const getRedisClient = () => client;
const isRedisHealthy = () => isConnected;

module.exports = { connectRedis, disconnectRedis, getRedisClient, isRedisHealthy };
