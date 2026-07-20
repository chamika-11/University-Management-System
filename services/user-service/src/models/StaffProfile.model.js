'use strict';

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const staffProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    employeeId: {
      type: String,
      unique: true,
      default: () => `STF-${uuidv4().slice(0, 8).toUpperCase()}`,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    photo: { type: String, default: null },
    designation: { type: String, trim: true, default: 'Staff Member' },
    department: { type: String, default: '' },
    joinedDate: { type: Date, default: Date.now },
    employmentType: {
      type: String,
      enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT'],
      default: 'FULL_TIME',
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

staffProfileSchema.virtual('fullName').get(function () { return `${this.firstName} ${this.lastName}`; });
staffProfileSchema.index({ employeeId: 1 }, { unique: true });

module.exports = mongoose.model('StaffProfile', staffProfileSchema);
