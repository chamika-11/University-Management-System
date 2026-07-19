const CircuitBreaker = require('opossum');
const env = require('../config/env');
const logger = require('./LoggerService');

const breakers = new Map();

const DEFAULT_OPTIONS = {
  timeout: env.CB_TIMEOUT,
  errorThresholdPercentage: env.CB_ERROR_THRESHOLD_PERCENTAGE,
  resetTimeout: env.CB_RESET_TIMEOUT,
  volumeThreshold: 5,
};

class CircuitBreakerService {
  static getBreaker(serviceName) {
    if (!breakers.has(serviceName)) {
      const breaker = new CircuitBreaker(async (fn) => fn(), DEFAULT_OPTIONS);

      breaker.on('open',     () => logger.warn(`[CircuitBreaker] OPEN — ${serviceName} circuit tripped`));
      breaker.on('close',    () => logger.info(`[CircuitBreaker] CLOSED — ${serviceName} circuit recovered`));
      breaker.on('halfOpen', () => logger.info(`[CircuitBreaker] HALF-OPEN — ${serviceName} testing recovery`));
      breaker.on('timeout',  () => logger.warn(`[CircuitBreaker] TIMEOUT — ${serviceName} request timed out`));
      breaker.on('reject',   () => logger.warn(`[CircuitBreaker] REJECTED — ${serviceName} circuit is OPEN, request fast-failed`));

      breakers.set(serviceName, breaker);
    }
    return breakers.get(serviceName);
  }

  static async execute(serviceName, fn) {
    const breaker = this.getBreaker(serviceName);
    try {
      return await breaker.fire(fn);
    } catch (err) {
      if (err.message === 'Breaker is open') {
        const e = new Error(`Service "${serviceName}" is currently unavailable. Please try again later.`);
        e.code = 'CIRCUIT_OPEN';
        e.statusCode = 503;
        e.retryAfterMs = env.CB_RESET_TIMEOUT;
        throw e;
      }
      throw err;
    }
  }

  static getStats() {
    const stats = {};
    for (const [name, breaker] of breakers.entries()) {
      stats[name] = {
        state: breaker.opened ? 'OPEN' : breaker.halfOpen ? 'HALF-OPEN' : 'CLOSED',
        stats: breaker.stats,
      };
    }
    return stats;
  }
}

module.exports = CircuitBreakerService;
