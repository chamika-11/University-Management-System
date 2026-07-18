require('dotenv').config();

function required(key) {
  const val = process.env[key];
  if (!val) throw new Error(`[ENV] Missing required environment variable: ${key}`);
  return val;
}

function optional(key, fallback) {
  return process.env[key] || fallback;
}

module.exports = {
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: parseInt(optional('PORT', '8000'), 10),

  // Auth
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: optional('JWT_EXPIRES_IN', '15m'),

  // Redis
  REDIS_URI: optional('REDIS_URI', 'redis://localhost:6379'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(optional('RATE_LIMIT_WINDOW_MS', '60000'), 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(optional('RATE_LIMIT_MAX_REQUESTS', '200'), 10),
  AUTH_RATE_LIMIT_MAX: parseInt(optional('AUTH_RATE_LIMIT_MAX', '10'), 10),

  // Circuit Breaker
  CB_TIMEOUT: parseInt(optional('CB_TIMEOUT', '5000'), 10),
  CB_ERROR_THRESHOLD_PERCENTAGE: parseInt(optional('CB_ERROR_THRESHOLD_PERCENTAGE', '50'), 10),
  CB_RESET_TIMEOUT: parseInt(optional('CB_RESET_TIMEOUT', '30000'), 10),

  // Downstream services
  services: {
    auth:         optional('AUTH_SERVICE_URL',         'http://localhost:5001'),
    user:         optional('USER_SERVICE_URL',         'http://localhost:5002'),
    academic:     optional('ACADEMIC_SERVICE_URL',     'http://localhost:5003'),
    admission:    optional('ADMISSION_SERVICE_URL',    'http://localhost:5004'),
    enrollment:   optional('ENROLLMENT_SERVICE_URL',   'http://localhost:5005'),
    content:      optional('CONTENT_SERVICE_URL',      'http://localhost:5006'),
    assessment:   optional('ASSESSMENT_SERVICE_URL',   'http://localhost:5007'),
    examination:  optional('EXAMINATION_SERVICE_URL',  'http://localhost:5008'),
    grading:      optional('GRADING_SERVICE_URL',      'http://localhost:5009'),
    attendance:   optional('ATTENDANCE_SERVICE_URL',   'http://localhost:5010'),
    timetable:    optional('TIMETABLE_SERVICE_URL',    'http://localhost:5011'),
    finance:      optional('FINANCE_SERVICE_URL',      'http://localhost:5012'),
    library:      optional('LIBRARY_SERVICE_URL',      'http://localhost:5013'),
    hostel:       optional('HOSTEL_SERVICE_URL',       'http://localhost:5014'),
    notification: optional('NOTIFICATION_SERVICE_URL', 'http://localhost:5015'),
    forum:        optional('FORUM_SERVICE_URL',        'http://localhost:5016'),
    liveClass:    optional('LIVE_CLASS_SERVICE_URL',   'http://localhost:5017'),
    document:     optional('DOCUMENT_SERVICE_URL',     'http://localhost:5018'),
    reporting:    optional('REPORTING_SERVICE_URL',    'http://localhost:5019'),
    media:        optional('MEDIA_SERVICE_URL',        'http://localhost:5020'),
    search:       optional('SEARCH_SERVICE_URL',       'http://localhost:5021'),
    audit:        optional('AUDIT_SERVICE_URL',        'http://localhost:5022'),
    calendar:     optional('CALENDAR_SERVICE_URL',     'http://localhost:5023'),
    aiRag:        optional('AI_RAG_SERVICE_URL',       'http://localhost:5024'),
  },
};
