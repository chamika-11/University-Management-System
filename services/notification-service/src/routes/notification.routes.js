'use strict';

const express = require('express');
const router = express.Router();
const NotificationLog = require('../models/NotificationLog.model');
const NotificationTemplate = require('../models/NotificationTemplate.model');
const UserPreference = require('../models/UserPreference.model');
const authenticate = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');
const asyncHandler = require('../utils/asyncHandler');
const dispatcher = require('../services/NotificationDispatchService');
const paginate = require('../utils/paginate');

router.use(authenticate);

// My notifications
router.get('/', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await paginate(NotificationLog, { recipientId: req.user.id }, { page, limit, sort: { createdAt: -1 } });
  res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
}));

// Preferences
router.get('/preferences', asyncHandler(async (req, res) => {
  const pref = await UserPreference.findOne({ userId: req.user.id }) || { channels: { email: true, sms: false, push: true }, mutedTopics: [] };
  res.status(200).json({ success: true, data: { preferences: pref } });
}));

router.put('/preferences', asyncHandler(async (req, res) => {
  const pref = await UserPreference.findOneAndUpdate(
    { userId: req.user.id },
    { $set: req.body },
    { upsert: true, new: true }
  );
  res.status(200).json({ success: true, data: { preferences: pref } });
}));

// Templates (ADMIN only)
router.get('/templates', requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const templates = await NotificationTemplate.find().sort({ slug: 1 });
  res.status(200).json({ success: true, data: { templates } });
}));

router.post('/templates', requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const template = await NotificationTemplate.create(req.body);
  res.status(201).json({ success: true, data: { template } });
}));

router.patch('/templates/:id', requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const template = await NotificationTemplate.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
  res.status(200).json({ success: true, data: { template } });
}));

// Manual send (ADMIN)
router.post('/send', requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const { templateSlug, recipientId, recipientEmail, variables } = req.body;
  await dispatcher.dispatch({ templateSlug, recipientId, recipientEmail, variables });
  res.status(200).json({ success: true, data: { message: 'Notification dispatched' } });
}));

module.exports = router;
