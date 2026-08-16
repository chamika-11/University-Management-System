const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const CircuitBreakerService = require('../services/CircuitBreakerService');
const logger = require('../services/LoggerService');

class ProxyController {
  static createProxy(route) {
    const { serviceName, target, path: routePath } = route;

    return createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: (path, req) => {
        if (route.stripPrefix === false) {
          return routePath + path;
        }
        return path;
      },
      on: {
        proxyReq: (proxyReq, req, res) => {
          if (!proxyReq.headersSent) {
            // Inject correlation/request IDs
            proxyReq.setHeader('x-request-id', req.id || '');
            if (req.user) {
              proxyReq.setHeader('x-user-id', req.user.id);
              proxyReq.setHeader('x-user-role', req.user.role);
            }
            // Re-stream body if parsed by express.json()
            fixRequestBody(proxyReq, req);
          }
          logger.debug(`Proxying request: ${req.method} ${req.originalUrl} -> ${target}`);
        },
        proxyRes: (proxyRes, req, res) => {
          // Strip downstream CORS headers so API Gateway controls CORS
          delete proxyRes.headers['access-control-allow-origin'];
          delete proxyRes.headers['access-control-allow-credentials'];
          delete proxyRes.headers['access-control-allow-methods'];
          delete proxyRes.headers['access-control-allow-headers'];

          // Track request inside Circuit Breaker
          const breaker = CircuitBreakerService.getBreaker(serviceName);
          if (proxyRes.statusCode < 500) {
            breaker.emit('success');
          } else {
            breaker.emit('failure');
          }
        },
        error: (err, req, res) => {
          logger.error(`Proxy error connecting to service "${serviceName}": ${err.message}`);
          
          // Track failure inside Circuit Breaker
          const breaker = CircuitBreakerService.getBreaker(serviceName);
          breaker.emit('failure');

          if (!res.headersSent) {
            res.status(502).json({
              success: false,
              code: 'BAD_GATEWAY',
              message: `Could not connect to service "${serviceName}". Please check if the service is running.`,
            });
          }
        }
      }
    });
  }
}

module.exports = ProxyController;
