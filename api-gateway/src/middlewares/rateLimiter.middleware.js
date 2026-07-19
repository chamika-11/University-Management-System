const { rateLimit } = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const env = require('../config/env');
const logger = require('../services/LoggerService');

let redisClient = null;

function setRedisClient(client) {
  redisClient = client;
}

const getStore = () => {
  if (redisClient) {
    return new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    });
  }
  return undefined; // MemoryStore fallback
};

const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  store: getStore(),
  handler: (req, res) => {
    logger.warn(`[RateLimit] Rate limit exceeded by IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
    });
  },
});

const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  store: getStore(),
  handler: (req, res) => {
    logger.warn(`[RateLimit] Auth rate limit exceeded by IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many login attempts. Please try again in a minute.',
    });
  },
});

module.exports = { globalLimiter, authLimiter, setRedisClient };
