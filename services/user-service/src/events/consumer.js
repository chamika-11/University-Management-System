'use strict';

const { kafka, registerConsumer } = require('../config/kafka');
const logger = require('../utils/logger');
const admissionConfirmedHandler = require('./handlers/admissionConfirmed.handler');

const CONSUMER_GROUP = 'user-service-group';

const TOPIC_HANDLERS = {
  'admission.events': [admissionConfirmedHandler],
};

const startConsumers = async () => {
  const consumer = kafka.consumer({ groupId: CONSUMER_GROUP });
  registerConsumer(consumer);

  try {
    await consumer.connect();
    logger.info('[Consumer] Connected to Kafka');

    const topics = Object.keys(TOPIC_HANDLERS);
    await consumer.subscribe({ topics, fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const rawValue = message.value?.toString();
          if (!rawValue) return;

          const event = JSON.parse(rawValue);
          const handlers = TOPIC_HANDLERS[topic] || [];

          for (const handler of handlers) {
            if (handler.canHandle(event)) {
              await handler.handle(event);
            }
          }
        } catch (err) {
          logger.error('[Consumer] Error processing message', { topic, error: err.message });
        }
      },
    });
  } catch (err) {
    logger.warn('[Consumer] Failed to start — service will run without consuming events', { error: err.message });
  }
};

module.exports = { startConsumers };
