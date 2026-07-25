'use strict';

const Module = require('../models/Module.model');
const Lesson = require('../models/Lesson.model');
const LiveSession = require('../models/LiveSession.model');

class ContentRepository {
  async createModule(data) { return Module.create(data); }
  async findModulesByCourse(courseId) { return Module.find({ courseId }).sort({ order: 1 }); }
  async findModuleById(id) { return Module.findById(id); }
  async updateModule(id, data) { return Module.findByIdAndUpdate(id, { $set: data }, { new: true }); }

  async createLesson(data) { return Lesson.create(data); }
  async findLessonsByModule(moduleId) { return Lesson.find({ moduleId }).sort({ order: 1 }); }
  async findLessonById(id) { return Lesson.findById(id).populate('moduleId'); }
  async updateLesson(id, data) { return Lesson.findByIdAndUpdate(id, { $set: data }, { new: true }); }

  async createLiveSession(data) { return LiveSession.create(data); }
  async findLiveSessionsBySection(sectionId) { return LiveSession.find({ sectionId }).sort({ startTime: 1 }); }
  async findLiveSessionById(id) { return LiveSession.findById(id); }
  async updateLiveSession(id, data) { return LiveSession.findByIdAndUpdate(id, { $set: data }, { new: true }); }
}

module.exports = new ContentRepository();
