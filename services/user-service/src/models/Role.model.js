'use strict';

const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      enum: ['STUDENT', 'FACULTY', 'ADMIN', 'STAFF', 'SUPER_ADMIN'],
    },
    description: { type: String, default: '' },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
    isDefault: { type: Boolean, default: false }, // auto-assigned on registration
    isSystem: { type: Boolean, default: false },  // cannot be deleted
  },
  { timestamps: true }
);

roleSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Role', roleSchema);
