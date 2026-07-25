'use strict';

const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    resource: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      // e.g., 'course', 'enrollment', 'user', 'grade'
    },
    action: {
      type: String,
      required: true,
      uppercase: true,
      enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE', 'EXPORT', 'PUBLISH'],
    },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

permissionSchema.index({ resource: 1, action: 1 }, { unique: true });

module.exports = mongoose.model('Permission', permissionSchema);
