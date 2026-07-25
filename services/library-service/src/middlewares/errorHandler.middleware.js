'use strict';

const logger = require('../utils/logger');

/**
 * Centralized Express error handler.
 * Handles AppError (operational), Mongoose errors, JWT errors, and generic errors.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Log all errors
  logger.error(err.message, {
    code: err.code,
    statusCode: err.statusCode,
    path: req.originalUrl,
    method: req.method,
    userId: req.user?.id,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Operational errors (AppError) — safe to expose
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(422).json({
      success: false,
      code: 'MONGOOSE_VALIDATION_ERROR',
      message: 'Database validation failed',
      errors,
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      code: 'DUPLICATE_KEY',
      message: `A record with this ${field} already exists`,
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      code: 'INVALID_ID',
      message: `Invalid value for field: ${err.path}`,
    });
  }

  // JWT errors (shouldn't reach here since gateway validates, but defensive)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      code: 'INVALID_TOKEN',
      message: 'Authentication token is invalid or expired',
    });
  }

  // Unknown / programming errors — don't leak details in production
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
  });
};

module.exports = errorHandler;
