'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes    = require('./routes/auth.routes');
const userRoutes    = require('./routes/user.routes');
const profileRoutes = require('./routes/profile.routes');
const roleRoutes    = require('./routes/role.routes');
const errorHandler  = require('./middlewares/errorHandler.middleware');
const { isDBHealthy } = require('./config/db');
const { isKafkaHealthy } = require('./config/kafka');
const { isRedisHealthy } = require('./config/redis');

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'user-service',
    timestamp: new Date().toISOString(),
    checks: {
      database: isDBHealthy() ? 'UP' : 'DOWN',
      kafka:    isKafkaHealthy() ? 'UP' : 'DEGRADED',
      redis:    isRedisHealthy() ? 'UP' : 'DEGRADED',
    },
  });
});

// Routes
app.use('/api/v1/auth',  authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/users', profileRoutes);
app.use('/api/v1/roles', roleRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
