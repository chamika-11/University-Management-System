'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const documentRoutes = require('./routes/document.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');
const { isDBHealthy } = require('./config/db');
const { isKafkaHealthy } = require('./config/kafka');
const { isRedisHealthy } = require('./config/redis');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploads statically in dev mode
app.use('/uploads', express.static(path.resolve('services/document-service/uploads')));

app.get('/health', (req, res) => res.status(200).json({
  status: 'UP', service: 'document-service', timestamp: new Date().toISOString(),
  checks: { database: isDBHealthy() ? 'UP' : 'DOWN', kafka: isKafkaHealthy() ? 'UP' : 'DEGRADED', redis: isRedisHealthy() ? 'UP' : 'DEGRADED' },
}));

app.use('/api/v1/documents', documentRoutes);
app.use((req, res) => res.status(404).json({ success: false, code: 'NOT_FOUND', message: `Cannot ${req.method} ${req.originalUrl}` }));
app.use(errorHandler);

module.exports = app;
