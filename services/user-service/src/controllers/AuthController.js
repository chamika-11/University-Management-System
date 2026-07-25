'use strict';

const authService = require('../services/AuthService');
const passwordService = require('../services/PasswordService');
const asyncHandler = require('../utils/asyncHandler');

class AuthController {
  register = asyncHandler(async (req, res) => {
    const { email, password, profileType, firstName, lastName } = req.body;
    const result = await authService.register({ email, password, profileType, firstName, lastName });
    res.status(201).json({ success: true, data: result });
  });

  login = asyncHandler(async (req, res) => {
    const { email, password, mfaToken } = req.body;
    const deviceInfo = req.headers['user-agent'] || 'Unknown';
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
    const result = await authService.login({ email, password, mfaToken, deviceInfo, ip, userAgent: deviceInfo });
    res.status(200).json({ success: true, data: result });
  });

  refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const deviceInfo = req.headers['user-agent'] || 'Unknown';
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
    const result = await authService.refreshTokens({ rawRefreshToken: refreshToken, deviceInfo, ip });
    res.status(200).json({ success: true, data: result });
  });

  logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await authService.logout(refreshToken);
    res.status(200).json({ success: true, data: result });
  });

  me = asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ success: true, data: { user } });
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const result = await passwordService.initiateReset(req.body.email);
    res.status(200).json({ success: true, data: result });
  });

  resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    const result = await passwordService.resetPassword(token, newPassword);
    res.status(200).json({ success: true, data: result });
  });

  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const result = await passwordService.changePassword(req.user.id, currentPassword, newPassword);
    res.status(200).json({ success: true, data: result });
  });
}

module.exports = new AuthController();
