'use strict';

const { v4: uuidv4 } = require('uuid');
const { getProducer, isKafkaHealthy } = require('../config/kafka');
const logger = require('../utils/logger');

/**
 * Standard event envelope structure for all ULMS Kafka events.
 */
const createEnvelope = (eventType, payload) => ({
  eventType,
  payload,
  meta: {
    eventId: uuidv4(),
    timestamp: new Date().toISOString(),
    source: 'user-service',
    version: '1.0',
  },
});

/**
 * Publishes a message to a Kafka topic.
 * Degrades gracefully if Kafka is unavailable.
 */
const publish = async (topic, { eventType, payload }) => {
  if (!isKafkaHealthy()) {
    logger.warn('[Publisher] Kafka unavailable — event not published', { eventType });
    return;
  }

  try {
    const producer = getProducer();
    const envelope = createEnvelope(eventType, payload);

    await producer.send({
      topic,
      messages: [
        {
          key: payload.userId || uuidv4(),
          value: JSON.stringify(envelope),
          headers: { eventType, source: 'user-service' },
        },
      ],
    });

    logger.debug('[Publisher] Event published', { topic, eventType });
  } catch (err) {
    logger.error('[Publisher] Failed to publish event', { eventType, error: err.message });
  }
};

module.exports = { publish };
