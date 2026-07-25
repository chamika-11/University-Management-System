'use strict';

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const facultyProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      unique: true,
      default: () => `FAC-${uuidv4().slice(0, 8).toUpperCase()}`,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'] },
    phone: { type: String, trim: true },
    photo: { type: String, default: null },
    departmentId: { type: String, default: null },
    designation: { type: String, trim: true, default: 'Lecturer' },
    specializations: [{ type: String, trim: true }],
    qualifications: [{ type: String, trim: true }],
    office: { type: String, trim: true, default: '' },
    officeHours: { type: String, default: '' },
    bio: { type: String, default: '' },
    joinedDate: { type: Date, default: Date.now },
    employmentType: {
      type: String,
      enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'VISITING'],
      default: 'FULL_TIME',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ON_LEAVE', 'RESIGNED', 'RETIRED'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

facultyProfileSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

facultyProfileSchema.index({ employeeId: 1 }, { unique: true });
facultyProfileSchema.index({ departmentId: 1, status: 1 });
facultyProfileSchema.index({ firstName: 'text', lastName: 'text' });

module.exports = mongoose.model('FacultyProfile', facultyProfileSchema);
