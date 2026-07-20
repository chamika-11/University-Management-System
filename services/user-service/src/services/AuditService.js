'use strict';

const auditRepo = require('../repositories/audit.repository');

class AuditService {
  async record({ userId, email, ipAddress, userAgent, success, failReason = null, mfaUsed = false }) {
    return auditRepo.record({ userId, email, ipAddress, userAgent, success, failReason, mfaUsed });
  }

  async getLoginHistory(userId, options = {}) {
    return auditRepo.findByUser(userId, options);
  }
}

module.exports = new AuditService();
