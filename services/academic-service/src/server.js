'use strict';

const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');
const { connectKafka, disconnectKafka } = require('./config/kafka');
const { connectRedis, disconnectRedis } = require('./config/redis');
const env = require('./config/env');
const logger = require('./utils/logger');

let server;

const start = async () => {
  try {
    await connectDB();
    await connectRedis();
    await connectKafka();
    server = app.listen(env.PORT, () => logger.info(`[Startup] Academic Service running on port ${env.PORT}`));
    process.on('unhandledRejection', (reason) => { logger.error('[Process] Unhandled rejection', { reason: String(reason) }); gracefulShutdown('UNHANDLED_REJECTION'); });
    process.on('uncaughtException',  (err) =>     { logger.error('[Process] Uncaught exception', { error: err.message }); gracefulShutdown('UNCAUGHT_EXCEPTION'); });
  } catch (err) {
    logger.error('[Startup] Fatal error', { error: err.message });
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  logger.info(`[Shutdown] ${signal} received`);
  if (server) server.close(() => logger.info('[Shutdown] HTTP server closed'));
  await disconnectKafka();
  await disconnectRedis();
  await disconnectDB();
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

start();
