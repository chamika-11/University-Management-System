'use strict';

const AppError = require('../utils/AppError');

/**
 * Factory: generates middleware that allows only the specified roles.
 * Usage: router.get('/admin-only', requireRole('ADMIN'), controller)
 *        router.get('/shared',    requireRole('ADMIN', 'FACULTY'), controller)
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(AppError.unauthorized('Authentication required'));
  }
  if (!roles.includes(req.user.role)) {
    return next(AppError.forbidden(
      `Role '${req.user.role}' is not permitted to access this resource`,
      'INSUFFICIENT_ROLE'
    ));
  }
  next();
};

/**
 * Middleware that allows the resource owner OR any of the given roles.
 * Usage: requireOwnerOrRole('ADMIN', 'STAFF')
 * The owner is determined by comparing req.user.id to req.params.id (or req.params.userId).
 */
const requireOwnerOrRole = (...roles) => (req, res, next) => {
  if (!req.user) return next(AppError.unauthorized('Authentication required'));

  const resourceId = req.params.id || req.params.userId;
  const isOwner = resourceId && req.user.id === resourceId;
  const hasRole = roles.includes(req.user.role);

  if (!isOwner && !hasRole) {
    return next(AppError.forbidden('You do not have permission to perform this action', 'FORBIDDEN'));
  }
  next();
};

module.exports = { requireRole, requireOwnerOrRole };
