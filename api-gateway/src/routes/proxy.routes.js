const express = require('express');
const routesConfig = require('../config/routes.config');
const ProxyController = require('../controllers/ProxyController');
const authVerify = require('../middlewares/authVerify.middleware');
const withCircuitBreaker = require('../middlewares/circuitBreaker.middleware');

const router = express.Router();

routesConfig.forEach((route) => {
  const middlewares = [];

  // Add circuit breaker middleware
  middlewares.push(withCircuitBreaker(route.serviceName));

  // Add Auth verification middleware if the route is NOT public
  if (!route.public) {
    middlewares.push(authVerify);
  }

  // Bind express-http-proxy middleware
  router.use(route.path, ...middlewares, ProxyController.createProxy(route));
});

module.exports = router;
