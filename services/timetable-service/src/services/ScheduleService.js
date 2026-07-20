'use strict';

const scheduleRepo = require('../repositories/schedule.repository');
const publisher = require('../events/publisher');
const AppError = require('../utils/AppError');
const pick = require('../utils/pick');
const logger = require('../utils/logger');

class ScheduleService {
  // ── Time Slots ──────────────────────────────────────────────────────────
  async createTimeSlot(data) { return scheduleRepo.createTimeSlot(data); }
  async getTimeSlots() { return scheduleRepo.findTimeSlots(); }

  // ── Classrooms ──────────────────────────────────────────────────────────
  async createClassroom(data) {
    try { return await scheduleRepo.createClassroom(data); }
    catch (err) { if (err.code === 11000) throw AppError.conflict('Classroom code already exists', 'CLASSROOM_EXISTS'); throw err; }
  }
  async getClassrooms(filter = {}) { return scheduleRepo.findClassrooms(filter); }
  async getClassroom(id) { const c = await scheduleRepo.findClassroomById(id); if (!c) throw AppError.notFound('Classroom'); return c; }
  async updateClassroom(id, data) { return scheduleRepo.updateClassroom(id, pick(data, ['name', 'capacity', 'facilities', 'isAvailable'])); }

  // ── Schedules ────────────────────────────────────────────────────────────
  async createSchedule(data) {
    // 1. Classroom conflict check
    if (data.classroomId) {
      const conflicts = await scheduleRepo.findConflicts(data.classroomId, data.timeSlotId, data.effectiveFrom, data.effectiveTo);
      if (conflicts.length) throw AppError.conflict(`Classroom conflict: already booked for time slot in that date range`, 'CLASSROOM_CONFLICT');
    }

    // 2. Faculty conflict check
    if (data.facultyId) {
      const fConflicts = await scheduleRepo.findFacultyConflicts(data.facultyId, data.timeSlotId, data.effectiveFrom, data.effectiveTo);
      if (fConflicts.length) throw AppError.conflict(`Faculty conflict: faculty already has a class at this time`, 'FACULTY_CONFLICT');
    }

    const schedule = await scheduleRepo.create(data);

    await publisher.publish('timetable.events', {
      eventType: 'timetable.schedule_created',
      payload: { scheduleId: schedule._id.toString(), sectionId: data.sectionId, semesterId: data.semesterId },
    });

    return schedule;
  }

  async getSchedulesBySemester(semesterId, filter = {}) { return scheduleRepo.findBySemesterId(semesterId, filter); }
  async getSchedulesBySection(sectionId) { return scheduleRepo.findBySectionId(sectionId); }
  async getSchedule(id) { const s = await scheduleRepo.findById(id); if (!s) throw AppError.notFound('Schedule'); return s; }
  async updateSchedule(id, data) {
    const schedule = await scheduleRepo.findById(id);
    if (!schedule) throw AppError.notFound('Schedule');

    const updateData = pick(data, ['classroomId', 'facultyId', 'color', 'isActive']);

    // Re-check conflicts if classroom/timeslot is changing
    if (updateData.classroomId && updateData.classroomId !== schedule.classroomId?.toString()) {
      const conflicts = await scheduleRepo.findConflicts(updateData.classroomId, schedule.timeSlotId, schedule.effectiveFrom, schedule.effectiveTo, id);
      if (conflicts.length) throw AppError.conflict('Classroom conflict on update', 'CLASSROOM_CONFLICT');
    }

    return scheduleRepo.update(id, updateData);
  }

  async cancelSchedule(id) { return scheduleRepo.deactivate(id); }

  // ── Holiday Calendar ────────────────────────────────────────────────────
  async addHoliday(data) { return scheduleRepo.createHoliday(data); }
  async getHolidays(from, to) { return from ? scheduleRepo.findHolidays(new Date(from), new Date(to)) : scheduleRepo.findAllHolidays(); }

  // ── Cancellations ────────────────────────────────────────────────────────
  async cancelClass({ scheduleId, cancelledDate, reason, cancelledBy, note, makeUpDate }) {
    const schedule = await scheduleRepo.findById(scheduleId);
    if (!schedule) throw AppError.notFound('Schedule');

    const cancellation = await scheduleRepo.createCancellation({ scheduleId, cancelledDate, reason, cancelledBy, note, makeUpDate });

    await publisher.publish('timetable.events', {
      eventType: 'timetable.class_cancelled',
      payload: { scheduleId, sectionId: schedule.sectionId, date: cancelledDate, reason, makeUpDate },
    });

    logger.info('[ScheduleService] Class cancelled', { scheduleId, date: cancelledDate });
    return cancellation;
  }
}

module.exports = new ScheduleService();
