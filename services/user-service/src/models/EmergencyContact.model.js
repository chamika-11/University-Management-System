'use strict';

const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    relationship: {
      type: String,
      required: true,
      enum: ['PARENT', 'SPOUSE', 'SIBLING', 'GUARDIAN', 'FRIEND', 'OTHER'],
    },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: '' },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true }
);

emergencyContactSchema.index({ ownerId: 1 });

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
