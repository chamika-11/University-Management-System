'use strict';

/**
 * Internal auth middleware for services (not API gateway).
 * Reads x-user-id and x-user-role headers injected by the gateway after JWT verification.
 * Services never verify JWT themselves — they trust gateway headers.
 */
const AppError = require('../utils/AppError');

const authenticate = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];

  if (!userId || !userRole) {
    return next(AppError.unauthorized('Missing authentication context. Route must go through API Gateway.', 'MISSING_AUTH_CONTEXT'));
  }

  req.user = {
    id: userId,
    role: userRole,
  };

  next();
};

module.exports = authenticate;
