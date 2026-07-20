'use strict';

const { z } = require('zod');

const baseProfileBody = z.object({
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().min(1).max(100).trim(),
  dateOfBirth: z.string().datetime({ offset: true }).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  phone: z.string().regex(/^\+?[\d\s\-()]{7,20}$/).optional(),
  photo: z.string().url().optional(),
});

exports.createStudentSchema = z.object({
  body: baseProfileBody.extend({
    programId: z.string().optional(),
    enrollmentYear: z.number().int().min(2000).max(2100).optional(),
    nationality: z.string().max(100).optional(),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']).optional(),
  }),
});

exports.createFacultySchema = z.object({
  body: baseProfileBody.extend({
    departmentId: z.string().optional(),
    designation: z.string().max(100).optional(),
    specializations: z.array(z.string()).optional(),
    qualifications: z.array(z.string()).optional(),
    office: z.string().max(100).optional(),
    employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'VISITING']).optional(),
  }),
});

exports.createAdminSchema = z.object({
  body: baseProfileBody.pick({ firstName: true, lastName: true, phone: true, photo: true }).extend({
    department: z.string().max(100).optional(),
    accessLevel: z.number().int().min(1).max(5).optional(),
  }),
});

exports.updateProfileSchema = z.object({
  body: z.object({}).passthrough(), // Validated at service layer by pick()
});

exports.addAddressSchema = z.object({
  body: z.object({
    addressType: z.enum(['HOME', 'CURRENT', 'PERMANENT', 'WORK']).optional(),
    street1: z.string().min(1).max(200),
    street2: z.string().max(200).optional(),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    country: z.string().min(1).max(100),
    postalCode: z.string().max(20).optional(),
    isPrimary: z.boolean().optional(),
  }),
});

exports.addEmergencyContactSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    relationship: z.enum(['PARENT', 'SPOUSE', 'SIBLING', 'GUARDIAN', 'FRIEND', 'OTHER']),
    phone: z.string().min(7).max(20),
    email: z.string().email().optional(),
    isPrimary: z.boolean().optional(),
  }),
});
