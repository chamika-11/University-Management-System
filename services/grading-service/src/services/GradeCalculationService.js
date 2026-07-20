'use strict';

const Grade = require('../models/Grade.model');
const Transcript = require('../models/Transcript.model');
const publisher = require('../events/publisher');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

// Industry-grade GPA letter grade points scale mapping
const GRADE_SCALE = {
  'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0
};

class GradeCalculationService {
  _calculateLetterGrade(marks) {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C+';
    if (marks >= 40) return 'C';
    if (marks >= 35) return 'D';
    return 'F';
  }

  /**
   * Submits/records a grade for a student in a course section.
   */
  async submitGrade({ studentId, sectionId, semesterId, courseId, marks, gradedBy }) {
    const letterGrade = this._calculateLetterGrade(marks);
    const gradePoints = GRADE_SCALE[letterGrade];

    // Upsert grade
    const grade = await Grade.findOneAndUpdate(
      { studentId, courseId },
      { $set: { sectionId, semesterId, marks, letterGrade, gradePoints, gradedBy, isPublished: false } },
      { upsert: true, new: true }
    );

    logger.info('[GradingService] Grade recorded (unpublished)', { studentId, courseId, letterGrade });
    return grade;
  }

  /**
   * Publishes grades and computes new semester SGPA and cumulative CGPA.
   */
  async publishGrades(semesterId) {
    const unpublished = await Grade.find({ semesterId, isPublished: false });
    if (!unpublished.length) return { message: 'No unpublished grades found for this semester' };

    // Mark as published
    await Grade.updateMany({ semesterId, isPublished: false }, { $set: { isPublished: true, publishedAt: new Date() } });

    // Extract unique students
    const studentIds = [...new Set(unpublished.map(g => g.studentId))];

    for (const studentId of studentIds) {
      await this.recalculateStudentTranscript(studentId);
    }

    logger.info('[GradingService] Grades published and GPA/CGPA recalculation triggered', { semesterId, studentCount: studentIds.length });
    return { message: `Published grades for ${studentIds.length} students` };
  }

  /**
   * Recalculates SGPA for all semesters and cumulative CGPA.
   */
  async recalculateStudentTranscript(studentId) {
    const grades = await Grade.find({ studentId, isPublished: true });
    if (!grades.length) return;

    // Group grades by semester
    const semGroup = {};
    grades.forEach(g => {
      if (!semGroup[g.semesterId]) semGroup[g.semesterId] = [];
      semGroup[g.semesterId].push(g);
    });

    const gpaRecords = [];
    let cumulativePoints = 0;
    let cumulativeCredits = 0;

    // Calculate SGPA for each semester (assumes standard 3 credits per course for this demo)
    const COURSE_CREDIT = 3; 

    for (const [semesterId, list] of Object.entries(semGroup)) {
      let totalPoints = 0;
      let totalCredits = 0;

      list.forEach(g => {
        totalPoints += g.gradePoints * COURSE_CREDIT;
        totalCredits += COURSE_CREDIT;
      });

      const sgpa = parseFloat((totalPoints / totalCredits).toFixed(2));
      gpaRecords.push({ semesterId, sgpa, creditsEarned: totalCredits });

      cumulativePoints += totalPoints;
      cumulativeCredits += totalCredits;
    }

    const cgpa = parseFloat((cumulativePoints / cumulativeCredits).toFixed(2));

    const transcript = await Transcript.findOneAndUpdate(
      { studentId },
      { $set: { gpaRecords, cgpa, totalCredits: cumulativeCredits, isVerified: true } },
      { upsert: true, new: true }
    );

    // Notify user-service about CGPA update
    await publisher.publish('grading.events', {
      eventType: 'grading.grade_published',
      payload: { studentId, cgpa, totalCredits: cumulativeCredits },
    });

    // Check if degree completion detected (e.g. total credits >= 120)
    if (cumulativeCredits >= 120 && cgpa >= 2.0) {
      await publisher.publish('academic.events', {
        eventType: 'academic.degree_completion_detected',
        payload: { studentId, cgpa, totalCredits: cumulativeCredits },
      });
    }

    logger.debug('[GradingService] Recalculated transcript details', { studentId, cgpa, totalCredits: cumulativeCredits });
    return transcript;
  }
}

module.exports = new GradeCalculationService();
