'use strict';

const { z } = require('zod');

exports.createRoleSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(50).toUpperCase(),
    description: z.string().max(500).optional(),
  }),
});

exports.createPermissionSchema = z.object({
  body: z.object({
    resource: z.string().min(1).max(100).toLowerCase(),
    action: z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE', 'EXPORT', 'PUBLISH']),
    description: z.string().max(500).optional(),
  }),
});

exports.assignPermissionsSchema = z.object({
  body: z.object({
    permissionIds: z.array(z.string().min(1)).min(1, 'At least one permission ID required'),
  }),
  params: z.object({ id: z.string().min(1) }),
});
