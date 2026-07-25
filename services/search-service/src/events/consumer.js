'use strict';

const { kafka, registerConsumer } = require('../config/kafka');
const logger = require('../utils/logger');
const indexSyncHandler = require('./handlers/indexSync.handler');

const CONSUMER_GROUP = 'search-service-group';
const ALL_TOPICS = ['academic.events', 'library.events', 'user.events'];

const startConsumers = async () => {
  const consumer = kafka.consumer({ groupId: CONSUMER_GROUP });
  registerConsumer(consumer);
  try {
    await consumer.connect();
    await consumer.subscribe({ topics: ALL_TOPICS, fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const raw = message.value?.toString();
          if (!raw) return;
          const event = JSON.parse(raw);
          if (indexSyncHandler.canHandle(event)) {
            await indexSyncHandler.handle(event);
          }
        } catch (err) { logger.error('[Consumer] Processing error', { topic, error: err.message }); }
      },
    });
    logger.info('[Consumer] search-service consumers listening');
  } catch (err) { logger.warn('[Consumer] Failed to start consumer', { error: err.message }); }
};

module.exports = { startConsumers };
