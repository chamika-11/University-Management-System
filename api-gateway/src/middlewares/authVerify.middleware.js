const AuthVerificationService = require('../services/AuthVerificationService');
const logger = require('../services/LoggerService');

module.exports = function authVerify(isPublic = false) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Public route with no auth header — proceed without user context
    if (isPublic && !authHeader) {
      return next();
    }

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Authentication token is missing',
      });
    }

    try {
      const token = AuthVerificationService.extractToken(authHeader);
      const decoded = AuthVerificationService.verify(token);

      req.user = {
        id: decoded.sub || decoded.id,
        role: (decoded.role || decoded.profileType || '').toUpperCase(),
        permissions: decoded.permissions || [],
        email: decoded.email,
      };

      req.headers['x-user-id']   = req.user.id;
      req.headers['x-user-role'] = req.user.role;

      next();
    } catch (err) {
      if (isPublic) {
        // Soft fail for public routes if token is invalid
        return next();
      }
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
};
