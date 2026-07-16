require('dotenv').config();
module.exports = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  REDIS_URI: process.env.REDIS_URI,
  KAFKA_BROKERS: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092']
};
