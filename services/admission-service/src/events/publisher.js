'use strict';

const { v4: uuidv4 } = require('uuid');
const { getProducer, isKafkaHealthy } = require('../config/kafka');
const logger = require('../utils/logger');

const publish = async (topic, { eventType, payload }) => {
  if (!isKafkaHealthy()) { logger.warn('[Publisher] Kafka unavailable', { eventType }); return; }
  try {
    await getProducer().send({
      topic,
      messages: [{
        key: payload.applicationId || uuidv4(),
        value: JSON.stringify({
          eventType,
          payload,
          meta: { eventId: uuidv4(), timestamp: new Date().toISOString(), source: 'admission-service', version: '1.0' },
        }),
      }],
    });
    logger.debug('[Publisher] Event published', { topic, eventType });
  } catch (err) { logger.error('[Publisher] Failed to publish', { eventType, error: err.message }); }
};

module.exports = { publish };
