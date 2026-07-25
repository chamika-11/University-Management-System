'use strict';

const { ZodError } = require('zod');
const AppError = require('../utils/AppError');

/**
 * Factory: creates Zod validation middleware.
 * @param {ZodSchema} schema — Zod schema with { body?, query?, params? }
 * Usage: router.post('/route', validate(mySchema), controller)
 */
const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Overwrite req properties with parsed (coerced/stripped) values
    if (parsed.body !== undefined)   req.body   = parsed.body;
    if (parsed.query !== undefined)  req.query  = parsed.query;
    if (parsed.params !== undefined) req.params = parsed.params;

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.errors.map((e) => ({
        field: e.path.slice(1).join('.'), // remove leading 'body'/'query'/'params'
        message: e.message,
        code: e.code,
      }));
      return res.status(422).json({
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Input validation failed',
        errors,
      });
    }
    next(err);
  }
};

module.exports = validate;
