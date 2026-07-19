const axios = require('axios');
const ServiceDiscoveryService = require('./ServiceDiscoveryService');
const logger = require('./LoggerService');

class RequestAggregationService {
  static async aggregate(requests) {
    const promises = requests.map(({ key, serviceName, path, method = 'GET', params = {}, headers = {} }) => {
      const baseUrl = ServiceDiscoveryService.getUrl(serviceName);
      return axios({
        method,
        url: `${baseUrl}${path}`,
        params,
        headers,
        timeout: 4000,
      }).then((res) => ({ key, status: 'fulfilled', data: res.data }))
        .catch((err) => ({
          key,
          status: 'rejected',
          reason: err.response?.data?.message || err.message || 'Service unavailable',
        }));
    });

    const results = await Promise.allSettled(promises);
    const data = {};
    const errors = {};

    for (const result of results) {
      const item = result.value;
      if (item.status === 'fulfilled') {
        data[item.key] = item.data;
      } else {
        errors[item.key] = item.reason;
        logger.warn(`[Aggregator] Service "${item.key}" failed: ${item.reason}`);
      }
    }

    const overallStatus = Object.keys(errors).length === 0 ? 'ok' : 'degraded';
    return { status: overallStatus, data, errors };
  }
}

module.exports = RequestAggregationService;
