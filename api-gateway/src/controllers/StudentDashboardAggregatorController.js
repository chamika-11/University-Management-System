const RequestAggregationService = require('../services/RequestAggregationService');
const ResponseCachingService = require('../services/ResponseCachingService');

class StudentDashboardAggregatorController {
  static async getDashboard(req, res, next) {
    const userId = req.user.id;
    const cacheKey = `student:dashboard:${userId}`;
    const ttl = 30; // 30 seconds cache

    try {
      const result = await ResponseCachingService.cache(cacheKey, ttl, async () => {
        const headers = { 'Authorization': req.headers.authorization };
        
        // Parallel requests fanning out to individual services
        const requests = [
          { key: 'profile', serviceName: 'user', path: `/api/v1/users/students/${userId}`, headers },
          { key: 'enrollments', serviceName: 'enrollment', path: `/api/v1/enrollments/student/${userId}`, headers },
          { key: 'grades', serviceName: 'grading', path: `/api/v1/grades/student/${userId}/gpa`, headers },
          { key: 'attendance', serviceName: 'attendance', path: `/api/v1/attendance/student/${userId}/summary`, headers },
          { key: 'finances', serviceName: 'finance', path: `/api/v1/finance/invoices/student/${userId}`, headers },
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

module.exports = StudentDashboardAggregatorController;
