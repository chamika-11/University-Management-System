'use strict';

const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');
const { connectKafka, disconnectKafka } = require('./config/kafka');
const { connectRedis, disconnectRedis } = require('./config/redis');
const env = require('./config/env');
const rbacService = require('./services/RBACService');
const logger = require('./utils/logger');

let server;

const start = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Seed default roles if this is a fresh DB
    await rbacService.seedDefaults();
    logger.info('[Startup] Default roles seeded');

    // 3. Connect to Redis (optional — degrades gracefully)
    await connectRedis();

    // 4. Connect to Kafka — producer + consumers (degrades gracefully)
    await connectKafka();

    // 5. Start HTTP server
    server = app.listen(env.PORT, () => {
      logger.info(`[Startup] User Service running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (reason) => {
      logger.error('[Process] Unhandled rejection:', { reason: String(reason) });
      gracefulShutdown('UNHANDLED_REJECTION');
    });

    process.on('uncaughtException', (error) => {
      logger.error('[Process] Uncaught exception:', { error: error.message });
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

  } catch (err) {
    logger.error('[Startup] Fatal startup error:', { error: err.message });
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  logger.info(`[Shutdown] Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(() => logger.info('[Shutdown] HTTP server closed'));
  }

  await disconnectKafka();
  await disconnectRedis();
  await disconnectDB();

  logger.info('[Shutdown] All connections closed. Process exiting.');
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

start();
