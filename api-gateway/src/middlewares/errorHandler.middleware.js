const logger = require('../services/LoggerService');

module.exports = function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  logger.error(`Error encountered: ${err.message}`, {
    requestId: req.id,
    stack: err.stack,
    code: errorCode,
  });

  res.status(statusCode).json({
    success: false,
    code: errorCode,
    message: err.message || 'An unexpected error occurred.',
  });
};
