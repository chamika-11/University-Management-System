'use strict';

const { kafka, registerConsumer } = require('../config/kafka');
const logger = require('../utils/logger');

const CONSUMER_GROUP = 'assessment-service-group';

const startConsumers = async () => {
  const consumer = kafka.consumer({ groupId: CONSUMER_GROUP });
  registerConsumer(consumer);
  try {
    await consumer.connect();
    logger.info('[Consumer] assessment-service consumers listening');
  } catch (err) { logger.warn('[Consumer] Failed to start consumer', { error: err.message }); }
};

module.exports = { startConsumers };
