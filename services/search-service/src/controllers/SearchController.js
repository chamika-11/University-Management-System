'use strict';

const service = require('../services/IndexingService');
const asyncHandler = require('../utils/asyncHandler');

class SearchController {
  search = asyncHandler(async (req, res) => {
    const { q, type, page, limit } = req.query;
    const result = await service.search(q, type, { page, limit });
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });

  index = asyncHandler(async (req, res) => {
    const doc = await service.indexEntity(req.body);
    res.status(201).json({ success: true, data: { document: doc } });
  });
}

module.exports = new SearchController();
