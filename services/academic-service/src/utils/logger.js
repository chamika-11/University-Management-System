'use strict';

const SERVICE = 'academic-service';
const ts = () => new Date().toISOString();
const fmt = (level, msg, meta = {}) => JSON.stringify({ timestamp: ts(), level, service: SERVICE, message: msg, ...meta });

module.exports = {
  info:  (msg, meta) => console.log(fmt('INFO', msg, meta)),
  warn:  (msg, meta) => console.warn(fmt('WARN', msg, meta)),
  error: (msg, meta) => console.error(fmt('ERROR', msg, meta)),
  debug: (msg, meta) => { if (process.env.NODE_ENV === 'development') console.log(fmt('DEBUG', msg, meta)); },
};
