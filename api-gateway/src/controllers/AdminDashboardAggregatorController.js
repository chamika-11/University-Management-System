const RequestAggregationService = require('../services/RequestAggregationService');
const ResponseCachingService = require('../services/ResponseCachingService');

class AdminDashboardAggregatorController {
  static async getDashboard(req, res, next) {
    const userId = req.user.id;
    const cacheKey = `admin:dashboard:${userId}`;
    const ttl = 15; // Admins get shorter cache for real-time stats

    try {
      const result = await ResponseCachingService.cache(cacheKey, ttl, async () => {
        const headers = { 'Authorization': req.headers.authorization };
        
        const requests = [
          { key: 'profile', serviceName: 'user', path: `/api/v1/users/admin/${userId}`, headers },
          { key: 'admissionsStats', serviceName: 'admission', path: '/api/v1/admissions/stats/summary', headers },
          { key: 'financeOverview', serviceName: 'finance', path: '/api/v1/finance/stats/overview', headers },
          { key: 'activeAudits', serviceName: 'reporting', path: '/api/v1/audit/recent-alerts', headers },
          { key: 'reports', serviceName: 'reporting', path: '/api/v1/reports/kpis/summary', headers }
        ];

        return await RequestAggregationService.aggregate(requests);
      });

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AdminDashboardAggregatorController;
