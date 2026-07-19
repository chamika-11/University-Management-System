const { v4: uuidv4 } = require('uuid');
const logger = require('../services/LoggerService');

module.exports = function requestLogger(req, res, next) {
  req.id = req.headers['x-request-id'] || uuidv4();
  res.setHeader('x-request-id', req.id);

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logDetails = {
      id: req.id,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    };

    if (res.statusCode >= 500) {
      logger.error(`Request Failed: ${req.method} ${req.originalUrl}`, logDetails);
    } else if (res.statusCode >= 400) {
      logger.warn(`Request Warning: ${req.method} ${req.originalUrl}`, logDetails);
    } else {
      logger.info(`Request Completed: ${req.method} ${req.originalUrl}`, logDetails);
    }
  });

  next();
};
