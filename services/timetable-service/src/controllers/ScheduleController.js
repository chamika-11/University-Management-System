'use strict';

const scheduleService = require('../services/ScheduleService');
const asyncHandler = require('../utils/asyncHandler');

class ScheduleController {
  // Time Slots
  getTimeSlots  = asyncHandler(async (req, res) => { const slots = await scheduleService.getTimeSlots(); res.status(200).json({ success: true, data: { timeSlots: slots } }); });
  createTimeSlot = asyncHandler(async (req, res) => { const slot = await scheduleService.createTimeSlot(req.body); res.status(201).json({ success: true, data: { timeSlot: slot } }); });

  // Classrooms
  getClassrooms  = asyncHandler(async (req, res) => { const rooms = await scheduleService.getClassrooms(); res.status(200).json({ success: true, data: { classrooms: rooms } }); });
  createClassroom = asyncHandler(async (req, res) => { const room = await scheduleService.createClassroom(req.body); res.status(201).json({ success: true, data: { classroom: room } }); });
  getClassroom   = asyncHandler(async (req, res) => { const room = await scheduleService.getClassroom(req.params.id); res.status(200).json({ success: true, data: { classroom: room } }); });
  updateClassroom = asyncHandler(async (req, res) => { const room = await scheduleService.updateClassroom(req.params.id, req.body); res.status(200).json({ success: true, data: { classroom: room } }); });

  // Schedules
  createSchedule = asyncHandler(async (req, res) => { const s = await scheduleService.createSchedule(req.body); res.status(201).json({ success: true, data: { schedule: s } }); });
  getSchedulesBySemester = asyncHandler(async (req, res) => { const schedules = await scheduleService.getSchedulesBySemester(req.params.semesterId, req.query.courseId ? { courseId: req.query.courseId } : {}); res.status(200).json({ success: true, data: { schedules } }); });
  getSchedulesBySection  = asyncHandler(async (req, res) => { const schedules = await scheduleService.getSchedulesBySection(req.params.sectionId); res.status(200).json({ success: true, data: { schedules } }); });
  getSchedule    = asyncHandler(async (req, res) => { const s = await scheduleService.getSchedule(req.params.id); res.status(200).json({ success: true, data: { schedule: s } }); });
  updateSchedule = asyncHandler(async (req, res) => { const s = await scheduleService.updateSchedule(req.params.id, req.body); res.status(200).json({ success: true, data: { schedule: s } }); });

  // Holidays
  getHolidays = asyncHandler(async (req, res) => { const holidays = await scheduleService.getHolidays(req.query.from, req.query.to); res.status(200).json({ success: true, data: { holidays } }); });
  addHoliday  = asyncHandler(async (req, res) => { const h = await scheduleService.addHoliday(req.body); res.status(201).json({ success: true, data: { holiday: h } }); });

  // Cancellations
  cancelClass = asyncHandler(async (req, res) => { const c = await scheduleService.cancelClass({ ...req.body, cancelledBy: req.user.id }); res.status(201).json({ success: true, data: { cancellation: c } }); });
}

module.exports = new ScheduleController();
