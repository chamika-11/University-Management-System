'use strict';

const LoginAudit = require('../models/LoginAudit.model');
const paginate = require('../utils/paginate');

class AuditRepository {
  async record({ userId, email, ipAddress, userAgent, success, failReason, mfaUsed }) {
    return LoginAudit.create({ userId, email, ipAddress, userAgent, success, failReason, mfaUsed });
  }

  async findByUser(userId, options = {}) {
    return paginate(LoginAudit, { userId }, { ...options, sort: { createdAt: -1 } });
  }

  async countFailedAttempts(userId, since) {
    return LoginAudit.countDocuments({ userId, success: false, createdAt: { $gte: since } });
  }
}

module.exports = new AuditRepository();
