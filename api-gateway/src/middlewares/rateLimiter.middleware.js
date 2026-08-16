'use strict';

let redisClient = null;

function setRedisClient(client) {
  redisClient = client;
}

// Disabled rate limiting - pass-through middleware
const globalLimiter = (req, res, next) => next();
const authLimiter = (req, res, next) => next();

module.exports = { globalLimiter, authLimiter, setRedisClient };

