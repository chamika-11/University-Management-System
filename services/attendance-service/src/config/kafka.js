const { Kafka } = require('kafkajs');
const kafka = new Kafka({
  clientId: 'auth-service', // dynamic setup
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
});
const producer = kafka.producer();
const consumer = (groupId) => kafka.consumer({ groupId });
module.exports = { kafka, producer, consumer };
