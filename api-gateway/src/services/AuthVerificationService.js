const jwt = require('jsonwebtoken');
const env = require('../config/env');

class AuthVerificationService {
  static extractToken(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const err = new Error('Authorization header missing or not Bearer type');
      err.code = 'MISSING_TOKEN';
      err.statusCode = 401;
      throw err;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      const err = new Error('Bearer token is empty');
      err.code = 'MISSING_TOKEN';
      err.statusCode = 401;
      throw err;
    }
    return token;
  }

  static verify(token) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      return decoded;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        const e = new Error('Token has expired — please log in again');
        e.code = 'EXPIRED_TOKEN';
        e.statusCode = 401;
        throw e;
      }
      const e = new Error('Token is invalid or tampered');
      e.code = 'INVALID_TOKEN';
      e.statusCode = 401;
      throw e;
    }
  }
}

module.exports = AuthVerificationService;
