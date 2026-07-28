'use strict';

const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true, unique: true },
  code:          { type: String, required: true, unique: true, uppercase: true, trim: true },
  building:      { type: String, trim: true, default: '' },
  floor:         { type: Number, default: 0 },
  capacity:      { type: Number, required: true, min: 1 },
  type:          { type: String, enum: ['LECTURE_HALL', 'LAB', 'SEMINAR_ROOM', 'TUTORIAL_ROOM', 'OUTDOOR'], default: 'LECTURE_HALL' },
  facilities:    [{ type: String }], // e.g. ['PROJECTOR', 'AC', 'WHITEBOARD', 'PC_LAB']
  isAvailable:   { type: Boolean, default: true },
}, { timestamps: true });


module.exports = mongoose.model('Classroom', classroomSchema);
