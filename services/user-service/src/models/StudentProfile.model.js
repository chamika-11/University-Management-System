'use strict';

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    studentId: {
      type: String,
      unique: true,
      default: () => `STU-${uuidv4().slice(0, 8).toUpperCase()}`,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'] },
    phone: { type: String, trim: true },
    photo: { type: String, default: null }, // URL from document-service
    programId: { type: String, default: null }, // ref to academic-service
    departmentId: { type: String, default: null },
    semesterId: { type: String, default: null },
    enrollmentYear: { type: Number },
    enrollmentStatus: {
      type: String,
      enum: ['ENROLLED', 'GRADUATED', 'SUSPENDED', 'WITHDRAWN', 'ON_LEAVE'],
      default: 'ENROLLED',
    },
    expectedGraduation: { type: Date },
    cgpa: { type: Number, min: 0, max: 10, default: 0 },
    nationality: { type: String, default: '' },
    bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''] , default: ''},
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

studentProfileSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

studentProfileSchema.index({ studentId: 1 }, { unique: true });
studentProfileSchema.index({ programId: 1, enrollmentStatus: 1 });
studentProfileSchema.index({ firstName: 'text', lastName: 'text' });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
