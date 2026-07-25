'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // Never returned in queries unless explicitly selected
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    profileType: {
      type: String,
      enum: ['STUDENT', 'FACULTY', 'ADMIN', 'STAFF'],
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'],
      default: 'ACTIVE',
    },
    mfaEnabled: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date, default: null },
    loginAttempts: { type: Number, default: 0, min: 0 },
    lockedUntil: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockedUntil && this.lockedUntil > new Date());
});

userSchema.virtual('role', {
  ref: 'Role',
  localField: 'roleId',
  foreignField: '_id',
  justOne: true,
});

// Compound indexes
userSchema.index({ status: 1, profileType: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
