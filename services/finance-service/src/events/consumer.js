'use strict';

const { kafka, registerConsumer } = require('../config/kafka');
const logger = require('../utils/logger');

const applicationSubmittedHandler = require('./handlers/applicationSubmitted.handler');
const enrollmentRequestedHandler = require('./handlers/enrollmentRequested.handler');

const CONSUMER_GROUP = 'finance-service-group';
const TOPIC_HANDLERS = {
  'admission.events': [applicationSubmittedHandler],
  'academic.events':  [enrollmentRequestedHandler],
};

const startConsumers = async () => {
  const consumer = kafka.consumer({ groupId: CONSUMER_GROUP });
  registerConsumer(consumer);
  try {
    await consumer.connect();
    await consumer.subscribe({ topics: Object.keys(TOPIC_HANDLERS), fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const raw = message.value?.toString();
          if (!raw) return;
          const event = JSON.parse(raw);
          const handlers = TOPIC_HANDLERS[topic] || [];
          for (const h of handlers) { if (h.canHandle(event)) await h.handle(event); }
        } catch (err) { logger.error('[Consumer] Processing error', { topic, error: err.message }); }
      },
    });
    logger.info('[Consumer] finance-service consumers listening');
  } catch (err) { logger.warn('[Consumer] Failed to start consumer', { error: err.message }); }
};

module.exports = { startConsumers };
