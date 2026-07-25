'use strict';

const Assignment = require('../models/Assignment.model');
const Submission = require('../models/Submission.model');
const paginate = require('../utils/paginate');

class AssessmentRepository {
  async createAssignment(data) { return Assignment.create(data); }
  async findAssignmentById(id) { return Assignment.findById(id); }
  async findAssignmentsBySection(sectionId, options = {}) { return paginate(Assignment, { sectionId }, options); }

  async createSubmission(data) { return Submission.create(data); }
  async findSubmissionById(id) { return Submission.findById(id).populate('assignmentId'); }
  async findSubmissionByStudent(assignmentId, studentId) { return Submission.findOne({ assignmentId, studentId }); }
  async findSubmissionsByAssignment(assignmentId, options = {}) { return paginate(Submission, { assignmentId }, options); }
}

module.exports = new AssessmentRepository();
