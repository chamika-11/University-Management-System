const env = require('./env');

module.exports = {
  user:         { url: env.services.user,         healthPath: '/health' },
  academic:     { url: env.services.academic,     healthPath: '/health' },
  admission:    { url: env.services.admission,    healthPath: '/health' },
  content:      { url: env.services.content,      healthPath: '/health' },
  assessment:   { url: env.services.assessment,   healthPath: '/health' },
  examination:  { url: env.services.examination,  healthPath: '/health' },
  grading:      { url: env.services.grading,      healthPath: '/health' },
  timetable:    { url: env.services.timetable,    healthPath: '/health' },
  finance:      { url: env.services.finance,      healthPath: '/health' },
  library:      { url: env.services.library,      healthPath: '/health' },
  notification: { url: env.services.notification, healthPath: '/health' },
  forum:        { url: env.services.forum,        healthPath: '/health' },
  document:     { url: env.services.document,     healthPath: '/health' },
  reporting:    { url: env.services.reporting,    healthPath: '/health' },
  search:       { url: env.services.search,       healthPath: '/health' },
  aiRag:        { url: env.services.aiRag,        healthPath: '/health' },
};
