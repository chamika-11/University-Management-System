'use strict';

const IndexedDocument = require('../models/IndexedDocument.model');
const AppError = require('../utils/AppError');
const paginate = require('../utils/paginate');
const logger = require('../utils/logger');

class IndexingService {
  async indexEntity({ entityId, entityType, title, content = '', category = '', metadata = {} }) {
    const doc = await IndexedDocument.findOneAndUpdate(
      { entityId },
      { $set: { entityType, title, content, category, metadata } },
      { upsert: true, new: true }
    );
    logger.debug('[IndexingService] Entity indexed', { entityId, entityType });
    return doc;
  }

  async deindexEntity(entityId) {
    await IndexedDocument.deleteOne({ entityId });
    logger.debug('[IndexingService] Entity deindexed', { entityId });
  }

  async search(query, entityType = null, options = {}) {
    const filter = {};
    if (entityType) filter.entityType = entityType;
    if (query) {
      filter.$text = { $search: query };
    }

    return paginate(IndexedDocument, filter, options);
  }
}

module.exports = new IndexingService();
