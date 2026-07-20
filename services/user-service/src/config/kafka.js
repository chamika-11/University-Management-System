'use strict';

const { Kafka, logLevel } = require('kafkajs');
const env = require('./env');
const logger = require('../utils/logger');

const kafka = new Kafka({
  clientId: env.KAFKA_CLIENT_ID,
  brokers: env.KAFKA_BROKERS,
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 300,
    retries: 8,
  },
});

const producer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000,
});

let isProducerConnected = false;
const consumers = [];

const connectKafka = async () => {
  try {
    await producer.connect();
    isProducerConnected = true;
    logger.info('[Kafka] Producer connected');

    // Start all registered consumers
    const { startConsumers } = require('../events/consumer');
    await startConsumers();
  } catch (err) {
    logger.warn(`[Kafka] Connection failed — service will run without event publishing: ${err.message}`);
  }
};

const disconnectKafka = async () => {
  try {
    for (const consumer of consumers) {
      await consumer.disconnect();
    }
    await producer.disconnect();
    isProducerConnected = false;
    logger.info('[Kafka] Disconnected gracefully');
  } catch (err) {
    logger.error('[Kafka] Error during disconnect:', err.message);
  }
};

const getProducer = () => producer;
const isKafkaHealthy = () => isProducerConnected;
const registerConsumer = (consumer) => consumers.push(consumer);

module.exports = {
  kafka,
  getProducer,
  connectKafka,
  disconnectKafka,
  isKafkaHealthy,
  registerConsumer,
};
