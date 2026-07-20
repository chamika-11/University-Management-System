'use strict';

/**
 * Paginates a Mongoose query.
 * @param {Model} Model — Mongoose model
 * @param {Object} filter — query filter
 * @param {Object} options — { page, limit, sort, populate, select }
 */
const paginate = async (Model, filter = {}, options = {}) => {
  const page = Math.max(1, parseInt(options.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(options.limit, 10) || 20));
  const skip = (page - 1) * limit;
  const sort = options.sort || { createdAt: -1 };

  let query = Model.find(filter).sort(sort).skip(skip).limit(limit);

  if (options.select) query = query.select(options.select);
  if (options.populate) query = query.populate(options.populate);

  const [data, total] = await Promise.all([query.exec(), Model.countDocuments(filter)]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

module.exports = paginate;
