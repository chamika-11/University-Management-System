'use strict';

const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    ownerType: {
      type: String,
      enum: ['STUDENT', 'FACULTY', 'ADMIN', 'STAFF'],
      required: true,
    },
    addressType: {
      type: String,
      enum: ['HOME', 'CURRENT', 'PERMANENT', 'WORK'],
      default: 'HOME',
    },
    street1: { type: String, trim: true, required: true },
    street2: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true, required: true },
    country: { type: String, trim: true, required: true, default: 'Sri Lanka' },
    postalCode: { type: String, trim: true, default: '' },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true }
);

addressSchema.index({ ownerId: 1, ownerType: 1 });

module.exports = mongoose.model('Address', addressSchema);
