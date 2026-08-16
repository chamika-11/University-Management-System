const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const requestLogger = require('./middlewares/requestLogger.middleware');
const { globalLimiter, authLimiter } = require('./middlewares/rateLimiter.middleware');
const healthRoutes = require('./routes/health.routes');
const bffRoutes = require('./routes/bff.routes');
const proxyRoutes = require('./routes/proxy.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => callback(null, origin || true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'x-request-id'],
}));
app.use(requestLogger);
app.use(globalLimiter);

// Auth login endpoints get stricter rate limiting - mount public auth routes first
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);

// NOTE: express.json() is intentionally NOT added here.
// Adding it would consume the request body stream, which breaks
// HTTP proxy forwarding (the proxied service would receive an empty body).
// Each downstream microservice parses its own request body.

// Mounting routes
app.use('/health', healthRoutes);
app.use('/api/v1/bff', bffRoutes);
app.use(proxyRoutes); // Proxy routes must be mounted last because they catch everything

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
