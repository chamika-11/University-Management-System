'use strict';

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const adminProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    employeeId: {
      type: String,
      unique: true,
      default: () => `ADM-${uuidv4().slice(0, 8).toUpperCase()}`,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    photo: { type: String, default: null },
    department: { type: String, default: '' },
    accessLevel: { type: Number, min: 1, max: 5, default: 1 },
    joinedDate: { type: Date, default: Date.now },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

adminProfileSchema.virtual('fullName').get(function () { return `${this.firstName} ${this.lastName}`; });
adminProfileSchema.index({ employeeId: 1 }, { unique: true });

module.exports = mongoose.model('AdminProfile', adminProfileSchema);
