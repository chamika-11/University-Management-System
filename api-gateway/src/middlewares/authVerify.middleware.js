const AuthVerificationService = require('../services/AuthVerificationService');
const logger = require('../services/LoggerService');

module.exports = function authVerify(req, res, next) {
  try {
    const token = AuthVerificationService.extractToken(req.headers.authorization);
    const decoded = AuthVerificationService.verify(token);

    req.user = {
      id: decoded.sub || decoded.id,
      role: decoded.role,
      permissions: decoded.permissions || [],
      email: decoded.email,
    };

    req.headers['x-user-id']   = req.user.id;
    req.headers['x-user-role'] = req.user.role;

    next();
  } catch (err) {
    logger.warn(`[AuthVerify] Rejected request: ${err.message}`, {
      requestId: req.id,
      path: req.path,
      code: err.code,
    });
    return res.status(err.statusCode || 401).json({
      success: false,
      code: err.code || 'UNAUTHORIZED',
      message: err.message,
    });
  }
};
