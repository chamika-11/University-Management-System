const RequestAggregationService = require('../services/RequestAggregationService');
const ResponseCachingService = require('../services/ResponseCachingService');

class FacultyDashboardAggregatorController {
  static async getDashboard(req, res, next) {
    const userId = req.user.id;
    const cacheKey = `faculty:dashboard:${userId}`;
    const ttl = 30;

    try {
      const result = await ResponseCachingService.cache(cacheKey, ttl, async () => {
        const headers = { 'Authorization': req.headers.authorization };
        
        const requests = [
          { key: 'profile', serviceName: 'user', path: `/api/v1/users/faculty/${userId}`, headers },
          { key: 'sections', serviceName: 'academic', path: `/api/v1/enrollments/sections/faculty/${userId}`, headers },
          { key: 'schedule', serviceName: 'timetable', path: `/api/v1/timetable/faculty/${userId}`, headers },
          { key: 'assessmentsPending', serviceName: 'assessment', path: `/api/v1/assessments/pending-grading/faculty/${userId}`, headers },
          { key: 'notifications', serviceName: 'notification', path: `/api/v1/notifications/user/${userId}/unread`, headers }
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

module.exports = FacultyDashboardAggregatorController;
