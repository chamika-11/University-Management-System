'use strict';

const { z } = require('zod');

exports.submitApplicationSchema = z.object({
  body: z.object({
    email: z.string().email().toLowerCase(),
    firstName: z.string().min(1).max(100).trim(),
    lastName: z.string().min(1).max(100).trim(),
    phone: z.string().optional(),
    programId: z.string().min(1),
    cycleCode: z.string().optional(),
  }),
});

exports.uploadDocsSchema = z.object({
  body: z.object({
    documents: z.array(
      z.object({
        docType: z.string().min(1),
        fileUrl: z.string().url(),
      })
    ).min(1),
  }),
});

exports.evaluateSchema = z.object({
  body: z.object({
    meritScore: z.number().min(0).max(100),
  }),
});
