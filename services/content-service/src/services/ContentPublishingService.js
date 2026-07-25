'use strict';

const contentRepo = require('../repositories/content.repository');
const publisher = require('../events/publisher');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class ContentPublishingService {
  async createModule(data) {
    return contentRepo.createModule(data);
  }

  async getModulesForCourse(courseId) {
    return contentRepo.findModulesByCourse(courseId);
  }

  async createLesson(data) {
    const lesson = await contentRepo.createLesson(data);
    await publisher.publish('content.events', {
      eventType: 'content.published',
      payload: { lessonId: lesson._id.toString(), moduleId: data.moduleId, title: lesson.title },
    });
    return lesson;
  }

  async getLessonsForModule(moduleId) {
    return contentRepo.findLessonsByModule(moduleId);
  }

  async scheduleLiveSession({ sectionId, title, description, startTime, endTime, hostId }) {
    const meetingLink = `https://zoom.us/j/${Math.floor(100000000 + Math.random() * 900000000)}`;

    const session = await contentRepo.createLiveSession({
      sectionId, title, description, startTime, endTime, meetingLink, hostId, status: 'SCHEDULED',
    });

    await publisher.publish('content.events', {
      eventType: 'content.live_session_scheduled',
      payload: { sessionId: session._id.toString(), sectionId, title, startTime, meetingLink },
    });

    logger.info('[ContentService] Live session scheduled', { sectionId, link: meetingLink });
    return session;
  }

  async endLiveSession(id) {
    const session = await contentRepo.findLiveSessionById(id);
    if (!session) throw AppError.notFound('Live session');

    session.status = 'ENDED';
    await session.save();

    await publisher.publish('content.events', {
      eventType: 'content.live_session_ended',
      payload: { sessionId: id, sectionId: session.sectionId, durationMin: 60 },
    });

    return session;
  }
}

module.exports = new ContentPublishingService();
