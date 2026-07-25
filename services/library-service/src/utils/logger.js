'use strict';
const SERVICE = 'library-service';
const ts = () => new Date().toISOString();
const fmt = (l, m, meta = {}) => JSON.stringify({ timestamp: ts(), level: l, service: SERVICE, message: m, ...meta });
module.exports = {
  info:  (m, meta) => console.log(fmt('INFO', m, meta)),
  warn:  (m, meta) => console.warn(fmt('WARN', m, meta)),
  error: (m, meta) => console.error(fmt('ERROR', m, meta)),
  debug: (m, meta) => { if (process.env.NODE_ENV === 'development') console.log(fmt('DEBUG', m, meta)); },
};
