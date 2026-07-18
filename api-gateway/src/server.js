const app = require('./app');
const env = require('./config/env');
const redis = require('redis');
const logger = require('./services/LoggerService');
const ResponseCachingService = require('./services/ResponseCachingService');
const { setRedisClient } = require('./middlewares/rateLimiter.middleware');

let server;
let redisClient;

const start = async () => {
  try {
    // 1. Initialise Redis connection
    redisClient = redis.createClient({
      url: env.REDIS_URI,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 2) {
            return new Error('Redis connection failed permanently');
          }
          return Math.min(retries * 100, 500);
        }
      }
    });
    redisClient.on('error', (err) => logger.error('Redis connection error:', err.message));
    
    await redisClient.connect();
    logger.info('Connected to Redis server successfully.');

    // Inject redisClient into rate limiter and response caching service
    setRedisClient(redisClient);
    ResponseCachingService.setClient(redisClient);

  } catch (err) {
    logger.warn(`Failed to connect to Redis: ${err.message}. Rate limiting will fallback to in-memory store.`);
  }

  // 2. Start HTTP server
  server = app.listen(env.PORT, () => {
    logger.info(`API Gateway started in ${env.NODE_ENV} mode, listening on port ${env.PORT}`);
  });
};

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(() => {
      logger.info('HTTP server closed.');
    });
  }

  if (redisClient) {
    try {
      await redisClient.quit();
      logger.info('Redis client disconnected.');
    } catch (err) {
      logger.error('Error during Redis client disconnect:', err);
    }
  }

  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

start();
