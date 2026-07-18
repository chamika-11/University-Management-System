const registry = require('../config/services.registry');

class ServiceDiscoveryService {
  static resolve(name) {
    const entry = registry[name];
    if (!entry) {
      throw new Error(`[ServiceDiscovery] Unknown service: "${name}"`);
    }
    return entry;
  }

  static getUrl(name) {
    return this.resolve(name).url;
  }

  static getHealthUrl(name) {
    const { url, healthPath } = this.resolve(name);
    return `${url}${healthPath}`;
  }

  static listServices() {
    return Object.keys(registry);
  }
}

module.exports = ServiceDiscoveryService;
