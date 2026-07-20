'use strict';

const { Kafka, logLevel } = require('kafkajs');
const env = require('./env');

const ts = () => new Date().toISOString();
const logger = {
  info: (m, meta) => console.log(JSON.stringify({ timestamp: ts(), level: 'INFO', service: 'notification-service', message: m, ...meta })),
  warn: (m, meta) => console.warn(JSON.stringify({ timestamp: ts(), level: 'WARN', service: 'notification-service', message: m, ...meta })),
  error: (m, meta) => console.error(JSON.stringify({ timestamp: ts(), level: 'ERROR', service: 'notification-service', message: m, ...meta })),
};

const kafka = new Kafka({ clientId: env.KAFKA_CLIENT_ID, brokers: env.KAFKA_BROKERS, logLevel: logLevel.WARN });
const consumers = [];

const connectKafka = async () => {
  try {
    const { startConsumers } = require('../events/consumer');
    await startConsumers();
    logger.info('[Kafka] Consumers started');
  } catch (err) { logger.warn('[Kafka] Consumer start failed', { error: err.message }); }
};

const disconnectKafka = async () => {
  for (const c of consumers) { try { await c.disconnect(); } catch(e) {} }
  logger.info('[Kafka] Disconnected');
};

module.exports = { kafka, connectKafka, disconnectKafka, registerConsumer: (c) => consumers.push(c) };
