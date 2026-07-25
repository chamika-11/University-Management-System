'use strict';

const { kafka, registerConsumer } = require('../config/kafka');
const logger = require('../utils/logger');

const CONSUMER_GROUP = 'grading-service-group';

const startConsumers = async () => {
  const consumer = kafka.consumer({ groupId: CONSUMER_GROUP });
  registerConsumer(consumer);
  try {
    await consumer.connect();
    // Consumer-only placeholder for Phase 3 (e.g. consuming AssignmentGraded events)
    logger.info('[Consumer] grading-service consumers listening');
  } catch (err) { logger.warn('[Consumer] Failed to start consumer', { error: err.message }); }
};

module.exports = { startConsumers };
