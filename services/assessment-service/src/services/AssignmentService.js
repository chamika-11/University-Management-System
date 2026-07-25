'use strict';

const repo = require('../repositories/assessment.repository');
const publisher = require('../events/publisher');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class AssignmentService {
  async createAssignment(data) {
    return repo.createAssignment(data);
  }

  async submitAssignment({ assignmentId, studentId, fileUrl }) {
    const assignment = await repo.findAssignmentById(assignmentId);
    if (!assignment) throw AppError.notFound('Assignment');

    try {
      const sub = await repo.createSubmission({ assignmentId, studentId, fileUrl, status: 'SUBMITTED' });
      await publisher.publish('assessment.events', {
        eventType: 'assessment.quiz_submitted',
        payload: { submissionId: sub._id.toString(), assignmentId, studentId },
      });
      return sub;
    } catch (err) {
      if (err.code === 11000) throw AppError.conflict('You have already submitted this assignment', 'DUPLICATE_SUBMISSION');
      throw err;
    }
  }

  async gradeSubmission({ submissionId, marksObtained, feedback, gradedBy }) {
    const sub = await repo.findSubmissionById(submissionId);
    if (!sub) throw AppError.notFound('Submission');

    if (marksObtained > sub.assignmentId.maxMarks) {
      throw AppError.badRequest('Marks obtained exceed maximum permitted limits', 'LIMIT_EXCEEDED');
    }

    sub.marksObtained = marksObtained;
    sub.feedback = feedback;
    sub.gradedBy = gradedBy;
    sub.gradedAt = new Date();
    sub.status = 'GRADED';
    await sub.save();

    await publisher.publish('assessment.events', {
      eventType: 'assessment.assignment_graded',
      payload: {
        submissionId,
        studentId: sub.studentId,
        marksObtained,
        maxMarks: sub.assignmentId.maxMarks,
        gradedBy,
      },
    });

    logger.info('[AssessmentService] Assignment submission graded', { submissionId, studentId: sub.studentId });
    return sub;
  }
}

module.exports = new AssignmentService();
