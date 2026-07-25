'use strict';

const { z } = require('zod');

exports.updateUserSchema = z.object({
  body: z.object({
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
    isEmailVerified: z.boolean().optional(),
  }),
  params: z.object({ id: z.string().min(1) }),
});

exports.listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
    profileType: z.enum(['STUDENT', 'FACULTY', 'ADMIN', 'STAFF']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION']).optional(),
  }),
});
