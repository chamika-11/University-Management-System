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
        key: payload.examScheduleId || payload.studentId || uuidv4(),
        value: JSON.stringify({
          eventType,
          payload,
          meta: { eventId: uuidv4(), timestamp: new Date().toISOString(), source: 'examination-service', version: '1.0' },
        }),
      }],
    });
  } catch (err) { logger.error('[Publisher] Failed', { eventType, error: err.message }); }
};

module.exports = { publish };
