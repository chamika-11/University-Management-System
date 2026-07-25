'use strict';
const redis = require('redis');
const env = require('./env');
const logger = require('../utils/logger');
let client = null; let isConnected = false;
const connectRedis = async () => {
  client = redis.createClient({ url: env.REDIS_URI, socket: { reconnectStrategy: (r) => r > 3 ? new Error('Max') : Math.min(r * 200, 1000) } });
  client.on('ready', () => { isConnected = true; logger.info('[Redis] Connected'); });
  client.on('error', (err) => logger.error('[Redis] Error:', err.message));
  client.on('end', () => { isConnected = false; });
  try { await client.connect(); } catch(err) { logger.warn(`[Redis] Unavailable: ${err.message}`); client = null; }
};
const disconnectRedis = async () => { if (client) { await client.quit(); isConnected = false; } };
module.exports = { connectRedis, disconnectRedis, getRedisClient: () => client, isRedisHealthy: () => isConnected };
