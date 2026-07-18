const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      code: 'FORBIDDEN',
      message: `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`,
    });
  }

  next();
};

const requirePermission = (permission) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }

  if (!req.user.permissions || !req.user.permissions.includes(permission)) {
    return res.status(403).json({
      success: false,
      code: 'FORBIDDEN',
      message: `Missing required permission: ${permission}`,
    });
  }

  next();
};

module.exports = { requireRole, requirePermission };
