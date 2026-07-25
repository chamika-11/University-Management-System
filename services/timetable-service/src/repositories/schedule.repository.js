'use strict';

const Classroom = require('../models/Classroom.model');
const Schedule = require('../models/Schedule.model');
const TimeSlot = require('../models/TimeSlot.model');
const HolidayCalendar = require('../models/HolidayCalendar.model');
const ClassCancellation = require('../models/ClassCancellation.model');
const paginate = require('../utils/paginate');

class ScheduleRepository {
  // Time Slots
  async createTimeSlot(data) { return TimeSlot.create(data); }
  async findTimeSlots() { return TimeSlot.find().sort({ dayOfWeek: 1, startTime: 1 }); }
  async findTimeSlotById(id) { return TimeSlot.findById(id); }

  // Classrooms
  async createClassroom(data) { return Classroom.create(data); }
  async findClassrooms(filter = {}) { return Classroom.find(filter).sort({ name: 1 }); }
  async findClassroomById(id) { return Classroom.findById(id); }
  async updateClassroom(id, data) { return Classroom.findByIdAndUpdate(id, { $set: data }, { new: true }); }

  // Schedules
  async create(data) { return Schedule.create(data); }
  async findBySectionId(sectionId) { return Schedule.find({ sectionId, isActive: true }).populate('classroomId timeSlotId'); }
  async findBySemesterId(semesterId, filter = {}) { return Schedule.find({ semesterId, isActive: true, ...filter }).populate('classroomId timeSlotId'); }
  async findById(id) { return Schedule.findById(id).populate('classroomId timeSlotId'); }
  async update(id, data) { return Schedule.findByIdAndUpdate(id, { $set: data }, { new: true }).populate('classroomId timeSlotId'); }
  async deactivate(id) { return Schedule.findByIdAndUpdate(id, { $set: { isActive: false } }); }

  // Conflict detection: find any active schedule for same classroom+timeslot in same date range
  async findConflicts(classroomId, timeSlotId, effectiveFrom, effectiveTo, excludeId = null) {
    const query = {
      classroomId, timeSlotId, isActive: true,
      $or: [
        { effectiveFrom: { $lte: effectiveTo }, effectiveTo: { $gte: effectiveFrom } },
      ],
    };
    if (excludeId) query._id = { $ne: excludeId };
    return Schedule.find(query);
  }

  // Faculty conflict: same faculty, same timeslot, overlapping dates
  async findFacultyConflicts(facultyId, timeSlotId, effectiveFrom, effectiveTo, excludeId = null) {
    const query = {
      facultyId, timeSlotId, isActive: true,
      $or: [{ effectiveFrom: { $lte: effectiveTo }, effectiveTo: { $gte: effectiveFrom } }],
    };
    if (excludeId) query._id = { $ne: excludeId };
    return Schedule.find(query);
  }

  // Holidays
  async createHoliday(data) { return HolidayCalendar.create(data); }
  async findHolidays(from, to) { return HolidayCalendar.find({ date: { $gte: from, $lte: to } }).sort({ date: 1 }); }
  async findAllHolidays(filter = {}) { return HolidayCalendar.find(filter).sort({ date: 1 }); }

  // Cancellations
  async createCancellation(data) { return ClassCancellation.create(data); }
  async findCancellations(scheduleId) { return ClassCancellation.find({ scheduleId }).sort({ cancelledDate: -1 }); }
}

module.exports = new ScheduleRepository();
