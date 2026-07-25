'use strict';

const { kafka, registerConsumer } = require('../config/kafka');
const logger = require('../utils/logger');
const auditLogHandler = require('./handlers/auditLog.handler');

const CONSUMER_GROUP = 'reporting-service-group';

const startConsumers = async () => {
  const consumer = kafka.consumer({ groupId: CONSUMER_GROUP });
  registerConsumer(consumer);
  try {
    await consumer.connect();
    // Subscribes to ALL platform events for central compliance auditing
    const topics = ['user.events', 'admission.events', 'academic.events', 'finance.events', 'grading.events', 'timetable.events'];
    await consumer.subscribe({ topics, fromBeginning: false });
    
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const raw = message.value?.toString();
          if (!raw) return;
          const event = JSON.parse(raw);
          await auditLogHandler.handle(event);
        } catch (err) { logger.error('[Consumer] Processing error', { topic, error: err.message }); }
      },
    });
    logger.info('[Consumer] reporting-service audit consumers listening');
  } catch (err) { logger.warn('[Consumer] Failed to start consumer', { error: err.message }); }
};

module.exports = { startConsumers };
