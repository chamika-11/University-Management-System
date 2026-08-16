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

  // Add Auth verification middleware (handles token parsing for public & private routes)
  middlewares.push(authVerify(route.public));

  // Bind proxy middleware
  router.use(route.path, ...middlewares, ProxyController.createProxy(route));
});

module.exports = router;
