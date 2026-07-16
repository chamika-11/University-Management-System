module.exports = {
  routes: [
    { path: '/api/v1/auth', target: 'http://auth-service:5001' },
    { path: '/api/v1/users', target: 'http://user-service:5002' },
    { path: '/api/v1/academics', target: 'http://academic-service:5003' },
    { path: '/api/v1/admissions', target: 'http://admission-service:5004' },
    { path: '/api/v1/enrollments', target: 'http://enrollment-service:5005' },
    { path: '/api/v1/content', target: 'http://content-service:5006' },
    { path: '/api/v1/assessments', target: 'http://assessment-service:5007' }
  ]
};
