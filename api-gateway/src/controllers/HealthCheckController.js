const CircuitBreakerService = require('../services/CircuitBreakerService');
const ServiceDiscoveryService = require('../services/ServiceDiscoveryService');
const axios = require('axios');

class HealthCheckController {
  static async getHealth(req, res) {
    const cbStats = CircuitBreakerService.getStats();
    res.status(200).json({
      success: true,
      status: 'UP',
      uptime: `${process.uptime().toFixed(1)}s`,
      timestamp: new Date().toISOString(),
      circuitBreakers: cbStats,
    });
  }

  static async getServicesHealth(req, res) {
    const services = ServiceDiscoveryService.listServices();
    const pings = services.map(async (name) => {
      const url = ServiceDiscoveryService.getHealthUrl(name);
      try {
        const start = Date.now();
        const response = await axios.get(url, { timeout: 2000 });
        return {
          service: name,
          status: 'UP',
          responseTime: `${Date.now() - start}ms`,
          details: response.data,
        };
      } catch (err) {
        return {
          service: name,
          status: 'DOWN',
          reason: err.message,
        };
      }
    });

    const results = await Promise.all(pings);
    const overall = results.every(s => s.status === 'UP') ? 'HEALTHY' : 'DEGRADED';
    
    res.status(200).json({
      success: true,
      status: overall,
      timestamp: new Date().toISOString(),
      services: results,
    });
  }
}

module.exports = HealthCheckController;
