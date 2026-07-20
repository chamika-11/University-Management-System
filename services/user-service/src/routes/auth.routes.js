'use strict';

const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  registerSchema,
  loginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require('../validators/auth.validator');

// Public routes
router.post('/register',        validate(registerSchema),        authController.register);
router.post('/login',           validate(loginSchema),           authController.login);
router.post('/refresh',         validate(refreshSchema),         authController.refresh);
router.post('/logout',                                           authController.logout);
router.post('/forgot-password', validate(forgotPasswordSchema),  authController.forgotPassword);
router.post('/reset-password',  validate(resetPasswordSchema),   authController.resetPassword);

// Protected routes (require auth context from gateway)
router.get('/me',              authenticate,                       authController.me);
router.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);

// MFA routes
const mfaController = require('../controllers/MfaController');
router.get('/mfa/setup',   authenticate, mfaController.setup);
router.post('/mfa/enable', authenticate, mfaController.enable);
router.post('/mfa/disable', authenticate, mfaController.disable);
router.post('/mfa/verify',  authenticate, mfaController.verify);

module.exports = router;
