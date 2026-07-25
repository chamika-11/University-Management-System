'use strict';

const { Kafka, logLevel } = require('kafkajs');
const env = require('./env');
const logger = require('../utils/logger');

const kafka = new Kafka({ clientId: env.KAFKA_CLIENT_ID, brokers: env.KAFKA_BROKERS, logLevel: logLevel.WARN });
const producer = kafka.producer({ allowAutoTopicCreation: true });
let isProducerConnected = false;
const consumers = [];

const connectKafka = async () => {
  try {
    await producer.connect(); isProducerConnected = true; logger.info('[Kafka] Producer connected');
    const { startConsumers } = require('../events/consumer');
    await startConsumers();
  } catch (err) { logger.warn(`[Kafka] Unavailable: ${err.message}`); }
};

const disconnectKafka = async () => {
  try { for (const c of consumers) await c.disconnect(); await producer.disconnect(); isProducerConnected = false; logger.info('[Kafka] Disconnected'); } catch(e) {}
};

module.exports = { kafka, getProducer: () => producer, connectKafka, disconnectKafka, isKafkaHealthy: () => isProducerConnected, registerConsumer: (c) => consumers.push(c) };
