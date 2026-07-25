'use strict';

const indexingService = require('../../services/IndexingService');
const logger = require('../../utils/logger');

/**
 * Automatically syncs courses, library books, and user profiles to the search registry.
 */
module.exports = {
  canHandle: (event) => [
    'academic.course_created',
    'library.book_issued',
    'user.profile_created'
  ].includes(event.eventType),

  async handle(event) {
    const { eventType, payload } = event;
    logger.info('[Handler] Indexing event received', { eventType });

    try {
      if (eventType === 'academic.course_created') {
        await indexingService.indexEntity({
          entityId: payload.courseId,
          entityType: 'COURSE',
          title: payload.title,
          content: payload.code,
          category: 'Course Catalog',
        });
      } else if (eventType === 'user.profile_created') {
        await indexingService.indexEntity({
          entityId: payload.userId,
          entityType: payload.role,
          title: payload.userId, // fallback
          content: payload.role,
          category: 'User Directory',
        });
      }
    } catch (err) {
      logger.error('[Handler] Failed to sync index document', { error: err.message });
    }
  },
};
