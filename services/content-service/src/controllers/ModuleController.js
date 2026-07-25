'use strict';

const service = require('../services/ContentPublishingService');
const contentRepo = require('../repositories/content.repository');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

class ModuleController {
  createModule = asyncHandler(async (req, res) => {
    const mod = await service.createModule(req.body);
    res.status(201).json({ success: true, data: { module: mod } });
  });

  getModules = asyncHandler(async (req, res) => {
    const list = await service.getModulesForCourse(req.query.courseId);
    res.status(200).json({ success: true, data: { modules: list } });
  });

  createLesson = asyncHandler(async (req, res) => {
    const les = await service.createLesson(req.body);
    res.status(201).json({ success: true, data: { lesson: les } });
  });

  getLessons = asyncHandler(async (req, res) => {
    const list = await service.getLessonsForModule(req.params.moduleId);
    res.status(200).json({ success: true, data: { lessons: list } });
  });

  scheduleSession = asyncHandler(async (req, res) => {
    const hostId = req.user.id;
    const session = await service.scheduleLiveSession({ ...req.body, hostId });
    res.status(201).json({ success: true, data: { session } });
  });

  endSession = asyncHandler(async (req, res) => {
    const session = await service.endLiveSession(req.params.sessionId);
    res.status(200).json({ success: true, data: { session } });
  });

  getSessions = asyncHandler(async (req, res) => {
    const list = await contentRepo.findLiveSessionsBySection(req.params.sectionId);
    res.status(200).json({ success: true, data: { liveSessions: list } });
  });
}

module.exports = new ModuleController();
