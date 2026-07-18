const { createProxyMiddleware } = require('http-proxy-middleware');
const CircuitBreakerService = require('../services/CircuitBreakerService');
const logger = require('../services/LoggerService');

class ProxyController {
  static createProxy(route) {
    const { serviceName, target, path: routePath } = route;

    return createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        // Forward the path as-is (stripPrefix=false) or optionally strip it.
        // We keep it full.
      },
      on: {
        proxyReq: (proxyReq, req, res) => {
          // Inject correlation/request IDs
          proxyReq.setHeader('x-request-id', req.id || '');
          if (req.user) {
            proxyReq.setHeader('x-user-id', req.user.id);
            proxyReq.setHeader('x-user-role', req.user.role);
          }
          logger.debug(`Proxying request: ${req.method} ${req.originalUrl} -> ${target}`);
        },
        proxyRes: (proxyRes, req, res) => {
          // Track successful request inside Circuit Breaker
          const breaker = CircuitBreakerService.getBreaker(serviceName);
          breaker.stats.increment('successes');
        },
        error: (err, req, res) => {
          logger.error(`Proxy error connecting to service "${serviceName}": ${err.message}`);
          
          // Track failure inside Circuit Breaker
          const breaker = CircuitBreakerService.getBreaker(serviceName);
          breaker.stats.increment('failures');

          res.status(502).json({
            success: false,
            code: 'BAD_GATEWAY',
            message: `Could not connect to service "${serviceName}". Please check if the service is running.`,
          });
        }
      }
    });
  }
}

module.exports = ProxyController;
