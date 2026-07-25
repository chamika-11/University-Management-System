'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const reportingRoutes = require('./routes/reporting.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');
const { isDBHealthy } = require('./config/db');
const { isKafkaHealthy } = require('./config/kafka');
const { isRedisHealthy } = require('./config/redis');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.status(200).json({
  status: 'UP', service: 'reporting-service', timestamp: new Date().toISOString(),
  checks: { database: isDBHealthy() ? 'UP' : 'DOWN', kafka: isKafkaHealthy() ? 'UP' : 'DEGRADED', redis: isRedisHealthy() ? 'UP' : 'DEGRADED' },
}));

app.use('/api/v1/reporting', reportingRoutes);
app.use((req, res) => res.status(404).json({ success: false, code: 'NOT_FOUND', message: `Cannot ${req.method} ${req.originalUrl}` }));
app.use(errorHandler);

module.exports = app;
