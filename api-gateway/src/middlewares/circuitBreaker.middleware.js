const CircuitBreakerService = require('../services/CircuitBreakerService');

module.exports = function withCircuitBreaker(serviceName) {
  return async (req, res, next) => {
    try {
      // Just checks if circuit is open. Actual downstream execution is handled by proxy.
      const breaker = CircuitBreakerService.getBreaker(serviceName);
      if (breaker.opened) {
        return res.status(503).json({
          success: false,
          code: 'CIRCUIT_OPEN',
          message: `Service "${serviceName}" is currently unavailable. Please try again later.`,
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
