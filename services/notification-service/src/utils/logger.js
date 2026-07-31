'use strict';

const SERVICE = 'notification-service';

const timestamp = () => new Date().toISOString();

const format = (level, message, meta = {}) => {
  const entry = {
    timestamp: timestamp(),
    level,
    service: SERVICE,
    message,
    ...meta,
  };
  return JSON.stringify(entry);
};

const logger = {
  info: (message, meta) => console.log(format('INFO', message, meta)),
  warn: (message, meta) => console.warn(format('WARN', message, meta)),
  error: (message, meta) => console.error(format('ERROR', message, meta)),
  debug: (message, meta) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(format('DEBUG', message, meta));
    }
  },
  http: (message, meta) => console.log(format('HTTP', message, meta)),
};

module.exports = logger;
