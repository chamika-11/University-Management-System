'use strict';

const path = require('path');
let mongoose, bcrypt;
try {
  mongoose = require('mongoose');
  bcrypt = require('bcryptjs');
} catch (e) {
  mongoose = require(path.resolve(__dirname, '../services/user-service/node_modules/mongoose'));
  bcrypt = require(path.resolve(__dirname, '../services/user-service/node_modules/bcryptjs'));
}

const MONGO_BASE_URI = process.env.MONGO_BASE_URI || 'mongodb://localhost:27017';

// Helper to get or create connection to a database
const connections = {};
function getDbConnection(dbName) {
  if (!connections[dbName]) {
    connections[dbName] = mongoose.createConnection(`${MONGO_BASE_URI}/${dbName}`, {
      autoIndex: true,
    });
  }
  return connections[dbName];
}

async function runSeed() {
  console.log('🚀 Starting Comprehensive ULMS Database Seeding...');

  const passwordHash = await bcrypt.hash('Password123', 10);

  // ------------------------------------------------------------------
  // 1. USER DB (user_db)
  // ------------------------------------------------------------------
  console.log('📦 Seeding user_db...');
  const userConn = getDbConnection('user_db');

  const Role = userConn.model('Role', new mongoose.Schema({
    name: String, description: String, isDefault: Boolean, isSystem: Boolean
  }, { timestamps: true }));

  const User = userConn.model('User', new mongoose.Schema({
    email: { type: String, unique: true },
    passwordHash: String,
    roleId: mongoose.Schema.Types.ObjectId,
    profileType: String,
    status: String,
    isEmailVerified: Boolean,
  }, { timestamps: true }));

  const StudentProfile = userConn.model('StudentProfile', new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    studentId: String,
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    gender: String,
    phone: String,
    photo: String,
    programId: String,
    departmentId: String,
    semesterId: String,
    enrollmentYear: Number,
    enrollmentStatus: String,
    expectedGraduation: Date,
    cgpa: Number,
    nationality: String,
    bloodGroup: String,
  }, { timestamps: true }));

  const FacultyProfile = userConn.model('FacultyProfile', new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    employeeId: String,
    firstName: String,
    lastName: String,
    phone: String,
    departmentId: String,
    designation: String,
    specializations: [String],
    office: String,
    officeHours: String,
    bio: String,
    employmentType: String,
    status: String,
  }, { timestamps: true }));

  const AdminProfile = userConn.model('AdminProfile', new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    employeeId: String,
    firstName: String,
    lastName: String,
    department: String,
    accessLevel: Number,
  }, { timestamps: true }));

  const Address = userConn.model('Address', new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    street: String, city: String, state: String, postalCode: String, country: String
  }, { timestamps: true }));

  const EmergencyContact = userConn.model('EmergencyContact', new mongoose.Schema({
    studentId: String, name: String, relationship: String, phone: String
  }, { timestamps: true }));

  // Clear existing collections safely
  try { await Role.collection.drop(); } catch (e) {}
  try { await User.collection.drop(); } catch (e) {}
  try { await StudentProfile.collection.drop(); } catch (e) {}
  try { await FacultyProfile.collection.drop(); } catch (e) {}
  try { await AdminProfile.collection.drop(); } catch (e) {}
  try { await Address.collection.drop(); } catch (e) {}
  try { await EmergencyContact.collection.drop(); } catch (e) {}
  try { await StaffProfile.collection.drop(); } catch (e) {}

  const StaffProfile = userConn.model('StaffProfile', new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId, staffId: String, employeeId: String, firstName: String, lastName: String, department: String, designation: String
  }, { timestamps: true }));

  // Roles
  const studentRole = await Role.create({ name: 'STUDENT', description: 'Student role', isDefault: true, isSystem: true });
  const facultyRole = await Role.create({ name: 'FACULTY', description: 'Faculty role', isDefault: false, isSystem: true });
  const adminRole = await Role.create({ name: 'ADMIN', description: 'Admin role', isDefault: false, isSystem: true });
  const staffRole = await Role.create({ name: 'STAFF', description: 'Staff role', isDefault: false, isSystem: true });

  // 1 Primary Student
  const primaryStudentUser = await User.create({
    email: 'student@ulms.edu',
    passwordHash,
    roleId: studentRole._id,
    profileType: 'STUDENT',
    status: 'ACTIVE',
    isEmailVerified: true
  });
  const primaryStudentId = primaryStudentUser._id.toString();

  const primaryStudentProfile = await StudentProfile.create({
    userId: primaryStudentUser._id,
    studentId: 'STU-2026-0001',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('2002-05-15'),
    gender: 'MALE',
    phone: '+1 (555) 019-2831',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    enrollmentYear: 2024,
    enrollmentStatus: 'ENROLLED',
    expectedGraduation: new Date('2028-05-30'),
    cgpa: 3.82,
    nationality: 'American',
    bloodGroup: 'O+'
  });

  await Address.create({
    userId: primaryStudentUser._id,
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62704',
    country: 'United States'
  });

  await EmergencyContact.create({
    studentId: primaryStudentId,
    name: 'Martha Doe',
    relationship: 'Mother',
    phone: '+1 (555) 019-9988'
  });

  // Primary Staff Account
  const primaryStaffUser = await User.create({
    email: 'staff@ulms.edu',
    passwordHash,
    roleId: staffRole._id,
    profileType: 'STAFF',
    status: 'ACTIVE',
    isEmailVerified: true
  });
  await StaffProfile.create({
    userId: primaryStaffUser._id,
    staffId: 'STF-2026-0000',
    employeeId: 'EMP-2026-0000',
    firstName: 'Staff',
    lastName: 'Coordinator',
    department: 'Student Affairs & Registry',
    designation: 'Staff Officer'
  });

  // 5 Additional Staff Accounts
  for (let i = 1; i <= 5; i++) {
    const sUser = await User.create({
      email: `staff${i}@ulms.edu`,
      passwordHash,
      roleId: staffRole._id,
      profileType: 'STAFF',
      status: 'ACTIVE',
      isEmailVerified: true
    });
    await StaffProfile.create({
      userId: sUser._id,
      staffId: `STF-2026-000${i}`,
      employeeId: `EMP-2026-000${i}`,
      firstName: `StaffMember${i}`,
      lastName: 'Officer',
      department: 'Admissions & Registrar',
      designation: 'Academic Coordinator'
    });
  }

  // 14 Peer Students
  const peerStudentNames = [
    { first: 'Alice', last: 'Smith' }, { first: 'Bob', last: 'Johnson' },
    { first: 'Carol', last: 'Williams' }, { first: 'David', last: 'Brown' },
    { first: 'Emily', last: 'Jones' }, { first: 'Frank', last: 'Miller' },
    { first: 'Grace', last: 'Davis' }, { first: 'Henry', last: 'Wilson' },
    { first: 'Isabella', last: 'Taylor' }, { first: 'Jack', last: 'Anderson' },
    { first: 'Kate', last: 'Thomas' }, { first: 'Liam', last: 'Jackson' },
    { first: 'Mia', last: 'White' }, { first: 'Noah', last: 'Harris' }
  ];

  const studentUsers = [primaryStudentUser];
  const studentProfiles = [primaryStudentProfile];

  for (let i = 0; i < peerStudentNames.length; i++) {
    const s = peerStudentNames[i];
    const u = await User.create({
      email: `${s.first.toLowerCase()}.${s.last.toLowerCase()}@ulms.edu`,
      passwordHash,
      roleId: studentRole._id,
      profileType: 'STUDENT',
      status: 'ACTIVE',
      isEmailVerified: true
    });
    const sp = await StudentProfile.create({
      userId: u._id,
      studentId: `STU-2026-00${10 + i}`,
      firstName: s.first,
      lastName: s.last,
      gender: i % 2 === 0 ? 'FEMALE' : 'MALE',
      phone: `+1 (555) 019-${3000 + i}`,
      enrollmentYear: 2024,
      enrollmentStatus: 'ENROLLED',
      cgpa: Number((3.2 + (i * 0.05)).toFixed(2)),
      nationality: 'American'
    });
    studentUsers.push(u);
    studentProfiles.push(sp);
  }

  // Primary Faculty Account
  const primaryFacultyUser = await User.create({
    email: 'faculty@ulms.edu',
    passwordHash,
    roleId: facultyRole._id,
    profileType: 'FACULTY',
    status: 'ACTIVE',
    isEmailVerified: true
  });
  const primaryFacultyProfile = await FacultyProfile.create({
    userId: primaryFacultyUser._id,
    employeeId: 'FAC-2026-0001',
    firstName: 'Robert',
    lastName: 'Smith',
    designation: 'Professor',
    phone: '+1 (555) 020-4001',
    office: 'Engineering Bldg Room 101',
    officeHours: 'Mon/Wed 14:00 - 16:00',
    bio: 'Lead Faculty & Professor in Computer Science with over 15 years of teaching experience.'
  });

  // 10 Faculty Members
  const facultyNames = [
    { first: 'Robert', last: 'Smith', desig: 'Professor', dept: 'Computer Science' },
    { first: 'Sarah', last: 'Johnson', desig: 'Associate Professor', dept: 'Software Engineering' },
    { first: 'Michael', last: 'Williams', desig: 'Assistant Professor', dept: 'Artificial Intelligence' },
    { first: 'Elena', last: 'Rostova', desig: 'Professor', dept: 'Data Science' },
    { first: 'James', last: 'Miller', desig: 'Associate Professor', dept: 'Information Technology' },
    { first: 'Patricia', last: 'Davis', desig: 'Senior Lecturer', dept: 'Electrical Engineering' },
    { first: 'Charles', last: 'Wilson', desig: 'Professor', dept: 'Mathematics' },
    { first: 'Linda', last: 'Taylor', desig: 'Associate Professor', dept: 'Business Administration' },
    { first: 'Daniel', last: 'Anderson', desig: 'Senior Lecturer', dept: 'Finance' },
    { first: 'Sophia', last: 'Martinez', desig: 'Assistant Professor', dept: 'Physics' }
  ];

  const facultyUsers = [primaryFacultyUser];
  const facultyProfiles = [primaryFacultyProfile];

  for (let i = 0; i < facultyNames.length; i++) {
    const f = facultyNames[i];
    const u = await User.create({
      email: `${f.first.toLowerCase()}.${f.last.toLowerCase()}@ulms.edu`,
      passwordHash,
      roleId: facultyRole._id,
      profileType: 'FACULTY',
      status: 'ACTIVE',
      isEmailVerified: true
    });
    const fp = await FacultyProfile.create({
      userId: u._id,
      employeeId: `FAC-2026-00${10 + i}`,
      firstName: f.first,
      lastName: f.last,
      designation: f.desig,
      phone: `+1 (555) 020-${4000 + i}`,
      office: `Engineering Bldg Room ${101 + i}`,
      officeHours: 'Mon/Wed 14:00 - 16:00',
      bio: `Expert in ${f.dept} with over 10 years of research & teaching experience.`
    });
    facultyUsers.push(u);
    facultyProfiles.push(fp);
  }

  // Admins
  const adminNames = [
    { first: 'System', last: 'Administrator', email: 'admin@ulms.edu', dept: 'IT Operations' },
    { first: 'Super', last: 'Admin', email: 'superadmin@ulms.edu', dept: 'IT Operations' },
    { first: 'Eleanor', last: 'Vance', email: 'registrar@ulms.edu', dept: 'Academic Registry' },
    { first: 'Marcus', last: 'Brody', email: 'bursar@ulms.edu', dept: 'Finance Office' },
    { first: 'Hannah', last: 'Abbott', email: 'librarian@ulms.edu', dept: 'University Library' },
    { first: 'David', last: 'Geller', email: 'support@ulms.edu', dept: 'Student Services' }
  ];

  for (let i = 0; i < adminNames.length; i++) {
    const a = adminNames[i];
    const u = await User.create({
      email: a.email,
      passwordHash,
      roleId: adminRole._id,
      profileType: 'ADMIN',
      status: 'ACTIVE',
      isEmailVerified: true
    });
    await AdminProfile.create({
      userId: u._id,
      employeeId: `ADM-2026-00${1 + i}`,
      firstName: a.first,
      lastName: a.last,
      department: a.dept,
      accessLevel: 5
    });
  }

  console.log(`✅ user_db seeded (${studentUsers.length} students, ${facultyUsers.length} faculty, ${adminNames.length} admins)`);

  // ------------------------------------------------------------------
  // 2. ACADEMIC DB (academic_db)
  // ------------------------------------------------------------------
  console.log('📦 Seeding academic_db...');
  const acadConn = getDbConnection('academic_db');

  const College = acadConn.model('College', new mongoose.Schema({ name: String, code: String, description: String }));
  const Department = acadConn.model('Department', new mongoose.Schema({ collegeId: mongoose.Schema.Types.ObjectId, name: String, code: String }));
  const Program = acadConn.model('Program', new mongoose.Schema({ departmentId: mongoose.Schema.Types.ObjectId, name: String, code: String, degreeType: String, durationYears: Number, totalCredits: Number }));
  const AcademicYear = acadConn.model('AcademicYear', new mongoose.Schema({ name: String, startDate: Date, endDate: Date, isCurrent: Boolean }));
  const Semester = acadConn.model('Semester', new mongoose.Schema({ academicYearId: mongoose.Schema.Types.ObjectId, name: String, code: String, startDate: Date, endDate: Date, isCurrent: Boolean }));
  const Course = acadConn.model('Course', new mongoose.Schema({ code: String, title: String, departmentId: mongoose.Schema.Types.ObjectId, credits: Number, type: String, level: String, description: String, isActive: Boolean }));
  const CourseSection = acadConn.model('CourseSection', new mongoose.Schema({ courseId: mongoose.Schema.Types.ObjectId, semesterId: mongoose.Schema.Types.ObjectId, facultyId: String, sectionCode: String, capacity: Number, enrolled: Number, room: String, schedule: String, deliveryMode: String }));
  const Enrollment = acadConn.model('Enrollment', new mongoose.Schema({ studentId: String, sectionId: mongoose.Schema.Types.ObjectId, semesterId: mongoose.Schema.Types.ObjectId, status: String, grade: String, enrolledAt: Date }));

  try { await College.collection.drop(); } catch (e) {}
  try { await Department.collection.drop(); } catch (e) {}
  try { await Program.collection.drop(); } catch (e) {}
  try { await AcademicYear.collection.drop(); } catch (e) {}
  try { await Semester.collection.drop(); } catch (e) {}
  try { await Course.collection.drop(); } catch (e) {}
  try { await CourseSection.collection.drop(); } catch (e) {}
  try { await Enrollment.collection.drop(); } catch (e) {}

  const engCollege = await College.create({ name: 'College of Engineering & Technology', code: 'CET', description: 'School of Engineering, CS and Technology' });
  const busCollege = await College.create({ name: 'College of Business & Economics', code: 'CBE', description: 'School of Business Management and Finance' });

  const csDept = await Department.create({ collegeId: engCollege._id, name: 'Computer Science', code: 'CS' });
  const seDept = await Department.create({ collegeId: engCollege._id, name: 'Software Engineering', code: 'SE' });
  const aiDept = await Department.create({ collegeId: engCollege._id, name: 'Artificial Intelligence', code: 'AI' });
  const dsDept = await Department.create({ collegeId: engCollege._id, name: 'Data Science', code: 'DS' });
  const eeDept = await Department.create({ collegeId: engCollege._id, name: 'Electrical Engineering', code: 'EE' });
  const busDept = await Department.create({ collegeId: busCollege._id, name: 'Business Administration', code: 'BUS' });
  const finDept = await Department.create({ collegeId: busCollege._id, name: 'Finance & Banking', code: 'FIN' });

  const csProgram = await Program.create({ departmentId: csDept._id, name: 'B.Sc. in Computer Science', code: 'BS-CS', degreeType: 'BACHELOR', durationYears: 4, totalCredits: 120 });
  await Program.create({ departmentId: seDept._id, name: 'B.Sc. in Software Engineering', code: 'BS-SE', degreeType: 'BACHELOR', durationYears: 4, totalCredits: 120 });
  await Program.create({ departmentId: aiDept._id, name: 'B.Sc. in Artificial Intelligence', code: 'BS-AI', degreeType: 'BACHELOR', durationYears: 4, totalCredits: 120 });

  // Update primary student profile with program & department IDs
  await StudentProfile.updateOne({ userId: primaryStudentUser._id }, {
    programId: csProgram._id.toString(),
    departmentId: csDept._id.toString()
  });

  const year2025 = await AcademicYear.create({ name: '2025-2026 Academic Year', startDate: new Date('2025-09-01'), endDate: new Date('2026-06-30'), isCurrent: false });
  const year2026 = await AcademicYear.create({ name: '2026-2027 Academic Year', startDate: new Date('2026-09-01'), endDate: new Date('2027-06-30'), isCurrent: true });

  const semFall2025 = await Semester.create({ academicYearId: year2025._id, name: 'Fall 2025', code: 'F2025', startDate: new Date('2025-09-01'), endDate: new Date('2025-12-20'), isCurrent: false });
  const semSpring2026 = await Semester.create({ academicYearId: year2026._id, name: 'Spring 2026', code: 'S2026', startDate: new Date('2026-01-15'), endDate: new Date('2026-05-25'), isCurrent: true });

  // 20 Courses
  const courseDefs = [
    { code: 'CS101', title: 'Introduction to Computer Science', dept: csDept._id, credits: 3, level: 'INTRODUCTORY', type: 'CORE' },
    { code: 'CS201', title: 'Data Structures & Algorithms', dept: csDept._id, credits: 4, level: 'INTERMEDIATE', type: 'CORE' },
    { code: 'SE301', title: 'Software Engineering Principles', dept: seDept._id, credits: 3, level: 'INTERMEDIATE', type: 'CORE' },
    { code: 'AI401', title: 'Machine Learning & Deep Learning', dept: aiDept._id, credits: 4, level: 'ADVANCED', type: 'ELECTIVE' },
    { code: 'DS202', title: 'Data Mining and Visualization', dept: dsDept._id, credits: 3, level: 'INTERMEDIATE', type: 'ELECTIVE' },
    { code: 'CS305', title: 'Database Systems & Architecture', dept: csDept._id, credits: 3, level: 'INTERMEDIATE', type: 'CORE' },
    { code: 'CS410', title: 'Cloud Computing & Distributed Systems', dept: csDept._id, credits: 4, level: 'ADVANCED', type: 'ELECTIVE' },
    { code: 'SE402', title: 'DevOps & Continuous Integration', dept: seDept._id, credits: 3, level: 'ADVANCED', type: 'ELECTIVE' },
    { code: 'AI405', title: 'Natural Language Processing', dept: aiDept._id, credits: 3, level: 'ADVANCED', type: 'ELECTIVE' },
    { code: 'EE110', title: 'Digital Logic and Microprocessors', dept: eeDept._id, credits: 3, level: 'INTRODUCTORY', type: 'CORE' },
    { code: 'CS250', title: 'Computer Networks & Security', dept: csDept._id, credits: 3, level: 'INTERMEDIATE', type: 'CORE' },
    { code: 'CS280', title: 'Operating System Design', dept: csDept._id, credits: 4, level: 'INTERMEDIATE', type: 'CORE' },
    { code: 'SE310', title: 'Web Application Development', dept: seDept._id, credits: 3, level: 'INTERMEDIATE', type: 'CORE' },
    { code: 'SE320', title: 'Mobile Application Engineering', dept: seDept._id, credits: 3, level: 'INTERMEDIATE', type: 'ELECTIVE' },
    { code: 'BUS101', title: 'Principles of Management', dept: busDept._id, credits: 3, level: 'INTRODUCTORY', type: 'ELECTIVE' },
    { code: 'FIN201', title: 'Financial Accounting', dept: finDept._id, credits: 3, level: 'INTRODUCTORY', type: 'ELECTIVE' },
    { code: 'CS490', title: 'Senior Capstone Project I', dept: csDept._id, credits: 4, level: 'ADVANCED', type: 'PROJECT' },
    { code: 'CS491', title: 'Senior Capstone Project II', dept: csDept._id, credits: 4, level: 'ADVANCED', type: 'PROJECT' },
    { code: 'AI302', title: 'Computer Vision Systems', dept: aiDept._id, credits: 3, level: 'INTERMEDIATE', type: 'ELECTIVE' },
    { code: 'DS301', title: 'Big Data Analytics', dept: dsDept._id, credits: 4, level: 'ADVANCED', type: 'ELECTIVE' },
  ];

  const createdCourses = [];
  const createdSections = [];

  for (let i = 0; i < courseDefs.length; i++) {
    const cDef = courseDefs[i];
    const course = await Course.create({
      code: cDef.code,
      title: cDef.title,
      departmentId: cDef.dept,
      credits: cDef.credits,
      type: cDef.type,
      level: cDef.level,
      description: `Comprehensive exploration of ${cDef.title} covering theoretical foundations and hands-on laboratory exercises.`,
      isActive: true
    });
    createdCourses.push(course);

    // Create Course Section for Spring 2026
    const assignedFaculty = facultyUsers[i % facultyUsers.length];
    const section = await CourseSection.create({
      courseId: course._id,
      semesterId: semSpring2026._id,
      facultyId: assignedFaculty._id.toString(),
      sectionCode: `SEC-0${(i % 3) + 1}`,
      capacity: 45,
      enrolled: 18,
      room: `Building A Room ${101 + i}`,
      schedule: i % 2 === 0 ? 'Mon/Wed 09:00 - 10:30' : 'Tue/Thu 11:00 - 12:30',
      deliveryMode: i % 3 === 0 ? 'HYBRID' : 'IN_PERSON'
    });
    createdSections.push(section);
  }

  const WaitlistEntry = acadConn.model('WaitlistEntry', new mongoose.Schema({ studentId: String, sectionId: mongoose.Schema.Types.ObjectId, position: Number, status: String }));
  try { await WaitlistEntry.collection.drop(); } catch (e) {}

  // Enroll Primary Student in 15 Courses (10 active Spring 2026, 5 completed Fall 2025)
  const primaryEnrollments = [];
  for (let i = 0; i < 15; i++) {
    const sec = createdSections[i];
    const isCompleted = i >= 10;
    const sem = isCompleted ? semFall2025 : semSpring2026;
    const enr = await Enrollment.create({
      studentId: primaryStudentId,
      sectionId: sec._id,
      semesterId: sem._id,
      status: isCompleted ? 'COMPLETED' : 'CONFIRMED',
      grade: isCompleted ? (i % 2 === 0 ? 'A' : 'A-') : null,
      enrolledAt: isCompleted ? new Date('2025-09-02') : new Date('2026-01-16')
    });
    primaryEnrollments.push(enr);
  }

  // 3 Waitlist Entries for primary student
  for (let i = 15; i < 18; i++) {
    const sec = createdSections[i];
    await WaitlistEntry.create({
      studentId: primaryStudentId,
      sectionId: sec._id,
      position: i - 14,
      status: 'WAITING'
    });
  }

  console.log(`✅ academic_db seeded (${createdCourses.length} courses, ${createdSections.length} sections)`);

  // ------------------------------------------------------------------
  // 3. ADMISSION DB (admission_db)
  // ------------------------------------------------------------------
  console.log('📦 Seeding admission_db...');
  const admConn = getDbConnection('admission_db');

  const AdmissionCycle = admConn.model('AdmissionCycle', new mongoose.Schema({ name: String, year: Number, startDate: Date, endDate: Date, isActive: Boolean }));
  const Application = admConn.model('Application', new mongoose.Schema({
    applicantId: String,
    cycleId: mongoose.Schema.Types.ObjectId,
    programId: String,
    email: String,
    firstName: String,
    lastName: String,
    phone: String,
    status: String,
    documents: [{ docType: String, fileUrl: String, verified: Boolean }]
  }, { timestamps: true }));

  try { await AdmissionCycle.collection.drop(); } catch (e) {}
  try { await Application.collection.drop(); } catch (e) {}

  const cycle2026 = await AdmissionCycle.create({ name: 'Fall 2026 Admissions', year: 2026, startDate: new Date('2026-01-01'), endDate: new Date('2026-08-15'), isActive: true });

  const appStatuses = ['CONFIRMED', 'OFFER_ACCEPTED', 'OFFER_GENERATED', 'ELIGIBILITY_CHECKED', 'DOCUMENT_SUBMITTED', 'APPLIED', 'REJECTED'];
  for (let i = 1; i <= 20; i++) {
    await Application.create({
      applicantId: i === 1 ? primaryStudentId : `APP-CANDIDATE-00${i}`,
      cycleId: cycle2026._id,
      programId: csProgram._id.toString(),
      email: i === 1 ? 'student@ulms.edu' : `applicant${i}@gmail.com`,
      firstName: i === 1 ? 'John' : `Applicant${i}`,
      lastName: i === 1 ? 'Doe' : `Candidate`,
      phone: `+1 (555) 99${10 + i}`,
      status: i === 1 ? 'CONFIRMED' : appStatuses[i % appStatuses.length],
      documents: [
        { docType: 'TRANSCRIPT', fileUrl: 'https://ulms.edu/docs/hs_transcript.pdf', verified: true },
        { docType: 'RECOMMENDATION', fileUrl: 'https://ulms.edu/docs/recommendation.pdf', verified: true }
      ]
    });
  }
  console.log('✅ admission_db seeded (20 applications)');

  // ------------------------------------------------------------------
  // 4. CONTENT DB (content_db)
  // ------------------------------------------------------------------
  console.log('📦 Seeding content_db...');
  const contentConn = getDbConnection('content_db');

  const Module = contentConn.model('Module', new mongoose.Schema({ courseId: String, title: String, description: String, order: Number, isActive: Boolean }));
  const Lesson = contentConn.model('Lesson', new mongoose.Schema({ moduleId: mongoose.Schema.Types.ObjectId, title: String, content: String, contentType: String, fileUrl: String, durationMin: Number, order: Number, isPublished: Boolean }));
  const LiveSession = contentConn.model('LiveSession', new mongoose.Schema({ courseId: String, title: String, startTime: Date, durationMinutes: Number, meetingUrl: String, status: String }));

  try { await Module.collection.drop(); } catch (e) {}
  try { await Lesson.collection.drop(); } catch (e) {}
  try { await LiveSession.collection.drop(); } catch (e) {}

  const createdModules = [];
  for (let i = 0; i < 15; i++) {
    const course = createdCourses[i % createdCourses.length];
    const mod = await Module.create({
      courseId: course._id.toString(),
      title: `Module ${i + 1}: Foundations of ${course.title}`,
      description: `Core theoretical concepts and introductory lab experiments for ${course.title}.`,
      order: i + 1,
      isActive: true
    });
    createdModules.push(mod);

    // Add 2 lessons per module (30 total lessons)
    await Lesson.create({
      moduleId: mod._id,
      title: `Lesson 1: Introduction and Key Concepts`,
      content: `# Lecture Notes\n\nWelcome to **${course.title}**. In this lesson we cover core architecture principles.`,
      contentType: 'TEXT',
      durationMin: 45,
      order: 1,
      isPublished: true
    });

    await Lesson.create({
      moduleId: mod._id,
      title: `Lesson 2: Video Lecture & Practical Implementation`,
      content: `Watch the full video demonstration and follow along in your local development environment.`,
      contentType: 'VIDEO',
      fileUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      durationMin: 60,
      order: 2,
      isPublished: true
    });
  }

  for (let i = 1; i <= 10; i++) {
    const course = createdCourses[i % createdCourses.length];
    await LiveSession.create({
      courseId: course._id.toString(),
      title: `Live Q&A & Lab Session ${i} for ${course.code}`,
      startTime: new Date(Date.now() + i * 86400000 * 2),
      durationMinutes: 90,
      meetingUrl: `https://zoom.us/j/9876543210${i}`,
      status: 'UPCOMING'
    });
  }

  console.log(`✅ content_db seeded (${createdModules.length} modules, 30 lessons, 10 live sessions)`);

  // ------------------------------------------------------------------
  // 5. ASSESSMENT DB (assessment_db)
  // ------------------------------------------------------------------
  console.log('📦 Seeding assessment_db...');
  const assessConn = getDbConnection('assessment_db');

  const Assignment = assessConn.model('Assignment', new mongoose.Schema({ title: String, description: String, sectionId: String, dueDate: Date, maxMarks: Number, createdBy: String }, { timestamps: true }));
  const Submission = assessConn.model('Submission', new mongoose.Schema({ assignmentId: mongoose.Schema.Types.ObjectId, studentId: String, fileUrl: String, submittedAt: Date, marksObtained: Number, feedback: String, gradedBy: String, gradedAt: Date, status: String }, { timestamps: true }));

  try { await Assignment.collection.drop(); } catch (e) {}
  try { await Submission.collection.drop(); } catch (e) {}

  const createdAssignments = [];
  for (let i = 0; i < 20; i++) {
    const sec = createdSections[i % createdSections.length];
    const isPast = i % 2 === 0;
    const dueDate = isPast ? new Date(Date.now() - (i + 1) * 86400000 * 3) : new Date(Date.now() + (i + 1) * 86400000 * 4);

    const asg = await Assignment.create({
      title: `Assignment ${i + 1}: ${createdCourses[i % createdCourses.length].title} Project`,
      description: `Complete exercises 1 through 5, attach source code zip and submission report in PDF format.`,
      sectionId: sec._id.toString(),
      dueDate,
      maxMarks: 100,
      createdBy: facultyUsers[0]._id.toString()
    });
    createdAssignments.push(asg);

    // Create submission for primary student if past assignment
    if (isPast) {
      await Submission.create({
        assignmentId: asg._id,
        studentId: primaryStudentId,
        fileUrl: `https://ulms.edu/uploads/submissions/assignment_${i + 1}_johndoe.pdf`,
        submittedAt: new Date(dueDate.getTime() - 3600000 * 5),
        marksObtained: 88 + (i % 10),
        feedback: 'Excellent implementation, well-commented code, and thorough analysis!',
        gradedBy: facultyUsers[0]._id.toString(),
        gradedAt: new Date(),
        status: 'GRADED'
      });
    }
  }

  console.log(`✅ assessment_db seeded (${createdAssignments.length} assignments, graded submissions)`);

  // ------------------------------------------------------------------
  // 6. GRADING DB (grading_db)
  // ------------------------------------------------------------------
  console.log('📦 Seeding grading_db...');
  const gradeConn = getDbConnection('grading_db');

  const Grade = gradeConn.model('Grade', new mongoose.Schema({ studentId: String, sectionId: String, semesterId: String, courseId: String, marks: Number, letterGrade: String, gradePoints: Number, isPublished: Boolean, publishedAt: Date, gradedBy: String }));
  const Transcript = gradeConn.model('Transcript', new mongoose.Schema({ studentId: String, gpaRecords: [{ semesterId: String, sgpa: Number, creditsEarned: Number }], cgpa: Number, totalCredits: Number, isVerified: Boolean }));
  const GradeAppeal = gradeConn.model('GradeAppeal', new mongoose.Schema({ studentId: String, gradeId: mongoose.Schema.Types.ObjectId, reason: String, status: String, reviewerNotes: String }, { timestamps: true }));

  try { await Grade.collection.drop(); } catch (e) {}
  try { await Transcript.collection.drop(); } catch (e) {}
  try { await GradeAppeal.collection.drop(); } catch (e) {}

  const createdGrades = [];
  for (let i = 0; i < 20; i++) {
    const course = createdCourses[i % createdCourses.length];
    const sec = createdSections[i % createdSections.length];
    const marks = 85 + (i % 14);
    const letter = marks >= 90 ? 'A' : marks >= 85 ? 'A-' : 'B+';
    const points = letter === 'A' ? 4.0 : letter === 'A-' ? 3.7 : 3.3;

    const g = await Grade.create({
      studentId: primaryStudentId,
      sectionId: sec._id.toString(),
      semesterId: semSpring2026._id.toString(),
      courseId: course._id.toString(),
      marks,
      letterGrade: letter,
      gradePoints: points,
      isPublished: true,
      publishedAt: new Date(),
      gradedBy: facultyUsers[i % facultyUsers.length]._id.toString()
    });
    createdGrades.push(g);
  }

  // Primary Student Transcript
  await Transcript.create({
    studentId: primaryStudentId,
    gpaRecords: [
      { semesterId: semFall2025._id.toString(), sgpa: 3.85, creditsEarned: 18 },
      { semesterId: semSpring2026._id.toString(), sgpa: 3.80, creditsEarned: 18 }
    ],
    cgpa: 3.82,
    totalCredits: 78,
    isVerified: true
  });

  // 5 Grade Appeals
  for (let i = 0; i < 5; i++) {
    await GradeAppeal.create({
      studentId: primaryStudentId,
      gradeId: createdGrades[i]._id,
      reason: `Requesting re-evaluation of Question ${i + 1} on the final examination.`,
      status: i % 2 === 0 ? 'APPROVED' : 'PENDING',
      reviewerNotes: i % 2 === 0 ? 'Mark adjustment approved (+3 marks).' : 'Appeal submitted to department head.'
    });
  }

  console.log(`✅ grading_db seeded (${createdGrades.length} grades, transcript, 5 appeals)`);

  // ------------------------------------------------------------------
  // 7. EXAMINATION DB (examination_db)
  // ------------------------------------------------------------------
  console.log('📦 Seeding examination_db...');
  const examConn = getDbConnection('examination_db');

  const ExamSchedule = examConn.model('ExamSchedule', new mongoose.Schema({ courseId: String, semesterId: String, examDate: Date, startTime: String, endTime: String, roomCode: String, invigilatorId: String }));
  const HallTicket = examConn.model('HallTicket', new mongoose.Schema({ studentId: String, semesterId: String, ticketCode: String, exams: [{ examScheduleId: mongoose.Schema.Types.ObjectId, seatNumber: String }], isApproved: Boolean }));

  try { await ExamSchedule.collection.drop(); } catch (e) {}
  try { await HallTicket.collection.drop(); } catch (e) {}

  const examSchedules = [];
  for (let i = 0; i < 20; i++) {
    const course = createdCourses[i % createdCourses.length];
    const examDate = new Date(Date.now() + (i + 5) * 86400000);
    const es = await ExamSchedule.create({
      courseId: course._id.toString(),
      semesterId: semSpring2026._id.toString(),
      examDate,
      startTime: '09:30',
      endTime: '12:30',
      roomCode: `Hall ${101 + (i % 5)}`,
      invigilatorId: facultyUsers[i % facultyUsers.length]._id.toString()
    });
    examSchedules.push(es);
  }

  await HallTicket.create({
    studentId: primaryStudentId,
    semesterId: semSpring2026._id.toString(),
    ticketCode: 'HT-2026-S2-8841',
    exams: examSchedules.slice(0, 6).map((es, idx) => ({
      examScheduleId: es._id,
      seatNumber: `A-${10 + idx}`
    })),
    isApproved: true
  });

  console.log(`✅ examination_db seeded (${examSchedules.length} exam schedules, hall ticket)`);

  // ------------------------------------------------------------------
  // 8. FINANCE DB (finance_db)
  // ------------------------------------------------------------------
  console.log('📦 Seeding finance_db...');
  const finConn = getDbConnection('finance_db');

  const Invoice = finConn.model('Invoice', new mongoose.Schema({ userId: String, amount: Number, currency: String, purpose: String, referenceId: String, status: String, dueDate: Date, paidAt: Date, transactionId: String }, { timestamps: true }));
  const LedgerEntry = finConn.model('LedgerEntry', new mongoose.Schema({ userId: String, amount: Number, type: String, description: String, date: Date }));

  try { await Invoice.collection.drop(); } catch (e) {}
  try { await LedgerEntry.collection.drop(); } catch (e) {}

  const invoicePurposes = ['TUITION_FEE', 'APPLICATION_FEE', 'LATE_REGISTRATION_FEE', 'LIBRARY_FINE'];
  for (let i = 0; i < 20; i++) {
    const isPaid = i % 3 !== 0;
    const inv = await Invoice.create({
      userId: primaryStudentId,
      amount: 150.00 + (i * 250),
      currency: 'USD',
      purpose: invoicePurposes[i % invoicePurposes.length],
      referenceId: `REF-FIN-2026-0${i + 1}`,
      status: isPaid ? 'PAID' : 'UNPAID',
      dueDate: new Date(Date.now() + (i - 5) * 86400000 * 7),
      paidAt: isPaid ? new Date(Date.now() - i * 86400000 * 3) : null,
      transactionId: isPaid ? `TXN-STRIPE-99${100 + i}` : null
    });

    if (isPaid) {
      await LedgerEntry.create({
        userId: primaryStudentId,
        amount: inv.amount,
        type: 'CREDIT',
        description: `Payment received for Invoice ${inv.referenceId}`,
        date: inv.paidAt
      });
    }
  }

  console.log('✅ finance_db seeded (20 invoices & transactions)');

  // ------------------------------------------------------------------
  // 9. LIBRARY DB (library_db)
  // ------------------------------------------------------------------
  console.log('📦 Seeding library_db...');
  const libConn = getDbConnection('library_db');

  const Book = libConn.model('Book', new mongoose.Schema({ title: String, author: String, isbn: String, category: String, totalCopies: Number, availableCopies: Number, shelfLocation: String }));
  const BookLoan = libConn.model('BookLoan', new mongoose.Schema({ bookId: mongoose.Schema.Types.ObjectId, studentId: String, loanDate: Date, dueDate: Date, returnDate: Date, status: String, renewCount: Number }));
  const Fine = libConn.model('Fine', new mongoose.Schema({ loanId: mongoose.Schema.Types.ObjectId, studentId: String, amount: Number, reason: String, status: String }));

  try { await Book.collection.drop(); } catch (e) {}
  try { await BookLoan.collection.drop(); } catch (e) {}
  try { await Fine.collection.drop(); } catch (e) {}

  const bookData = [
    { title: 'Clean Code: A Handbook of Agile Software Craftsmanship', author: 'Robert C. Martin', isbn: '9780132350884', category: 'Software Engineering' },
    { title: 'Introduction to Algorithms (4th Edition)', author: 'Thomas H. Cormen', isbn: '9780262046305', category: 'Computer Science' },
    { title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Erich Gamma et al.', isbn: '9780201633610', category: 'Software Engineering' },
    { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell & Peter Norvig', isbn: '9780134610993', category: 'Artificial Intelligence' },
    { title: 'Deep Learning', author: 'Ian Goodfellow et al.', isbn: '9780262035613', category: 'Artificial Intelligence' },
    { title: 'Database System Concepts (7th Edition)', author: 'Abraham Silberschatz', isbn: '9781260515046', category: 'Database Systems' },
    { title: 'Operating System Concepts', author: 'Abraham Silberschatz', isbn: '9781119800361', category: 'Computer Science' },
    { title: 'Computer Networking: A Top-Down Approach', author: 'James Kurose & Keith Ross', isbn: '9780136681557', category: 'Networking' },
    { title: 'Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', isbn: '9780135957059', category: 'Software Engineering' },
    { title: 'Python Data Science Handbook', author: 'Jake VanderPlas', isbn: '9781491912058', category: 'Data Science' },
    { title: 'Head First Design Patterns', author: 'Eric Freeman', isbn: '9781492078005', category: 'Software Engineering' },
    { title: 'You Don\'t Know JS Yet', author: 'Kyle Simpson', isbn: '9781680506952', category: 'Web Development' },
    { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isbn: '9781449373320', category: 'Database Systems' },
    { title: 'Modern Operating Systems', author: 'Andrew S. Tanenbaum', isbn: '9780133591620', category: 'Computer Science' },
    { title: 'Compilers: Principles, Techniques, and Tools', author: 'Alfred Aho', isbn: '9780321486813', category: 'Computer Science' },
    { title: 'System Design Interview', author: 'Alex Xu', isbn: '9781736049112', category: 'Software Engineering' },
    { title: 'Reinforcement Learning: An Introduction', author: 'Richard S. Sutton', isbn: '9780262039246', category: 'Artificial Intelligence' },
    { title: 'Hands-On Machine Learning with Scikit-Learn', author: 'Aurélien Géron', isbn: '9781492032649', category: 'Artificial Intelligence' },
    { title: 'Site Reliability Engineering', author: 'Betsy Beyer et al.', isbn: '9781491929124', category: 'DevOps' },
    { title: 'Structure and Interpretation of Computer Programs', author: 'Harold Abelson', isbn: '9780262510875', category: 'Computer Science' }
  ];

  const createdBooks = [];
  for (let i = 0; i < bookData.length; i++) {
    const b = await Book.create({
      ...bookData[i],
      totalCopies: 5,
      availableCopies: 3,
      shelfLocation: `Floor 2, Aisle ${i + 1}`
    });
    createdBooks.push(b);
  }

  for (let i = 0; i < 15; i++) {
    const book = createdBooks[i % createdBooks.length];
    const isReturned = i % 2 === 0;
    const loan = await BookLoan.create({
      bookId: book._id,
      studentId: primaryStudentId,
      loanDate: new Date(Date.now() - (i + 5) * 86400000 * 2),
      dueDate: new Date(Date.now() + (i - 3) * 86400000 * 2),
      returnDate: isReturned ? new Date() : null,
      status: isReturned ? 'RETURNED' : (i < 3 ? 'OVERDUE' : 'ISSUED'),
      renewCount: i % 3
    });

    if (i < 3) {
      await Fine.create({
        loanId: loan._id,
        studentId: primaryStudentId,
        amount: 15.00,
        reason: `Late book return for ${book.title}`,
        status: 'UNPAID'
      });
    }
  }

  console.log(`✅ library_db seeded (${createdBooks.length} books, 15 book loans, fines)`);

  // ------------------------------------------------------------------
  // 10. TIMETABLE DB (timetable_db)
  // ------------------------------------------------------------------
  console.log('📦 Seeding timetable_db...');
  const ttConn = getDbConnection('timetable_db');

  const Classroom = ttConn.model('Classroom', new mongoose.Schema({ building: String, roomNumber: String, capacity: Number }));
  const Schedule = ttConn.model('Schedule', new mongoose.Schema({ sectionId: String, classroomId: mongoose.Schema.Types.ObjectId, dayOfWeek: String, startTime: String, endTime: String }));
  const AttendanceSession = ttConn.model('AttendanceSession', new mongoose.Schema({ scheduleId: mongoose.Schema.Types.ObjectId, sectionId: String, semesterId: String, sessionDate: Date, status: String, openedBy: String, totalStudents: Number, presentCount: Number, absentCount: Number }));
  const AttendanceRecord = ttConn.model('AttendanceRecord', new mongoose.Schema({ sessionId: mongoose.Schema.Types.ObjectId, studentId: String, sectionId: String, semesterId: String, status: String, markedAt: Date }));

  try { await Classroom.collection.drop(); } catch (e) {}
  try { await Schedule.collection.drop(); } catch (e) {}
  try { await AttendanceSession.collection.drop(); } catch (e) {}
  try { await AttendanceRecord.collection.drop(); } catch (e) {}

  const classrooms = [];
  for (let i = 1; i <= 10; i++) {
    const cr = await Classroom.create({ building: 'Engineering Hall', roomNumber: `${100 + i}`, capacity: 50 });
    classrooms.push(cr);
  }

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  const schedules = [];

  for (let i = 0; i < 20; i++) {
    const sec = createdSections[i % createdSections.length];
    const sch = await Schedule.create({
      sectionId: sec._id.toString(),
      classroomId: classrooms[i % classrooms.length]._id,
      dayOfWeek: days[i % days.length],
      startTime: '09:00',
      endTime: '10:30'
    });
    schedules.push(sch);

    // Attendance Session & Record for primary student
    const sessionDate = new Date(Date.now() - (i + 1) * 86400000 * 2);
    const attSess = await AttendanceSession.create({
      scheduleId: sch._id,
      sectionId: sec._id.toString(),
      semesterId: semSpring2026._id.toString(),
      sessionDate,
      status: 'CLOSED',
      openedBy: facultyUsers[i % facultyUsers.length]._id.toString(),
      totalStudents: 30,
      presentCount: 27,
      absentCount: 3
    });

    const isPresent = i % 8 !== 0; // 88% attendance rate
    await AttendanceRecord.create({
      sessionId: attSess._id,
      studentId: primaryStudentId,
      sectionId: sec._id.toString(),
      semesterId: semSpring2026._id.toString(),
      status: isPresent ? 'PRESENT' : 'ABSENT',
      markedAt: sessionDate
    });
  }

  console.log(`✅ timetable_db seeded (${schedules.length} schedules, attendance sessions & 88% attendance records)`);

  // ------------------------------------------------------------------
  // 11. FORUM DB (forum_db)
  // ------------------------------------------------------------------
  console.log('📦 Seeding forum_db...');
  const forumConn = getDbConnection('forum_db');

  const ForumPost = forumConn.model('ForumPost', new mongoose.Schema({ title: String, content: String, authorId: String, authorName: String, category: String, upvotes: [String], isPinned: Boolean }, { timestamps: true }));
  const Comment = forumConn.model('Comment', new mongoose.Schema({ postId: mongoose.Schema.Types.ObjectId, content: String, authorId: String, authorName: String }, { timestamps: true }));

  await Promise.all([ForumPost.deleteMany({}), Comment.deleteMany({})]);

  const forumTopics = [
    { title: 'Best resources for mastering Data Structures & Algorithms?', category: 'ACADEMIC' },
    { title: 'Announcement: Midterm Exam Schedule Released for Spring 2026', category: 'ANNOUNCEMENT', pin: true },
    { title: 'Tips for setting up Docker & Microservices locally for SE301', category: 'HELP' },
    { title: 'Discussion: Machine Learning vs Deep Learning in Industry', category: 'GENERAL' },
    { title: 'How to optimize PostgreSQL queries with composite indexes?', category: 'ACADEMIC' },
    { title: 'Hackathon 2026: Team Formation & Idea Exchange Thread', category: 'GENERAL', pin: true },
    { title: 'Understanding React Server Components & Next.js App Router', category: 'ACADEMIC' },
    { title: 'Library extended study hours during finals week', category: 'ANNOUNCEMENT' },
    { title: 'Need help with Machine Learning Assignment 2 gradient descent', category: 'HELP' },
    { title: 'DevOps CI/CD Pipeline best practices with GitHub Actions', category: 'ACADEMIC' },
    { title: 'Career Guidance: Preparing for Software Engineering Internships', category: 'GENERAL' },
    { title: 'Natural Language Processing: Transformer Architecture overview', category: 'ACADEMIC' },
    { title: 'Study group meeting for Database Systems this Friday', category: 'HELP' },
    { title: 'Cloud Computing AWS credits distribution details', category: 'ANNOUNCEMENT' },
    { title: 'Which elective is recommended: Big Data Analytics or Computer Vision?', category: 'GENERAL' },
    { title: 'Capstone Project Proposal Guidelines & Deadlines', category: 'ANNOUNCEMENT' },
    { title: 'Python vs Rust for High Performance Computing', category: 'GENERAL' },
    { title: 'Cyber Security Lab setup troubleshooting guide', category: 'HELP' },
    { title: 'Recommended books for software architecture', category: 'GENERAL' },
    { title: 'Welcome to the New Academic Semester Spring 2026!', category: 'ANNOUNCEMENT', pin: true }
  ];

  for (let i = 0; i < forumTopics.length; i++) {
    const topic = forumTopics[i];
    const post = await ForumPost.create({
      title: topic.title,
      content: `Hello everyone!\n\nThis thread is dedicated to **${topic.title}**. Feel free to post your thoughts, code snippets, or questions below.`,
      authorId: i % 2 === 0 ? primaryStudentId : facultyUsers[i % facultyUsers.length]._id.toString(),
      authorName: i % 2 === 0 ? 'John Doe' : `${facultyNames[i % facultyNames.length].first} ${facultyNames[i % facultyNames.length].last}`,
      category: topic.category,
      upvotes: [primaryStudentId, studentUsers[1]._id.toString(), studentUsers[2]._id.toString()],
      isPinned: !!topic.pin
    });

    // Add 2 comments per post
    await Comment.create({
      postId: post._id,
      content: 'Great initiative! Thanks for sharing this helpful explanation.',
      authorId: studentUsers[1]._id.toString(),
      authorName: 'Alice Smith'
    });
    await Comment.create({
      postId: post._id,
      content: 'If anyone has questions regarding the assignment or project, please feel free to reach out during office hours.',
      authorId: facultyUsers[0]._id.toString(),
      authorName: 'Prof. Robert Smith'
    });
  }

  console.log(`✅ forum_db seeded (${forumTopics.length} forum posts & comments)`);

  // ------------------------------------------------------------------
  // 12. NOTIFICATION DB (notification_db)
  // ------------------------------------------------------------------
  console.log('📦 Seeding notification_db...');
  const notifConn = getDbConnection('notification_db');

  const NotificationLog = notifConn.model('NotificationLog', new mongoose.Schema({
    recipientId: String, recipientEmail: String, channel: String, templateSlug: String, subject: String, status: String, sentAt: Date, metadata: mongoose.Schema.Types.Mixed
  }, { timestamps: true }));

  await NotificationLog.deleteMany({});

  const notifTitles = [
    'Assignment 1 Graded: Data Structures & Algorithms',
    'New Fee Invoice Issued: Spring 2026 Tuition',
    'Exam Hall Ticket Approved for Spring 2026',
    'Upcoming Live Session: Software Engineering Principles',
    'Library Book Return Reminder: Clean Code',
    'New Reply on your Forum Post in Software Engineering',
    'Course Enrollment Confirmed: Artificial Intelligence',
    'Grade Appeal Status Updated: Approved',
    'University Announcement: Spring Holiday Schedule',
    'Certificate Issued: Dean\'s Honor List 2025',
    'Assignment 2 Due Tomorrow: Database Systems',
    'Attendance Alert: 88% overall attendance rate maintained',
    'New Lecture Slides Published in Cloud Computing',
    'Fee Receipt Confirmation: $1,250.00 Received',
    'Midterm Exam Venue Announcement'
  ];

  for (let i = 0; i < notifTitles.length; i++) {
    await NotificationLog.create({
      recipientId: primaryStudentId,
      recipientEmail: 'student@ulms.edu',
      channel: 'IN_APP',
      templateSlug: `notif-slug-${i + 1}`,
      subject: notifTitles[i],
      status: 'SENT',
      sentAt: new Date(Date.now() - i * 86400000),
      metadata: { link: '/dashboard' }
    });
  }

  console.log(`✅ notification_db seeded (${notifTitles.length} notifications)`);

  // ------------------------------------------------------------------
  // 13. DOCUMENT DB (document_db)
  // ------------------------------------------------------------------
  console.log('📦 Seeding document_db...');
  const docConn = getDbConnection('document_db');

  const IssuedCertificate = docConn.model('IssuedCertificate', new mongoose.Schema({
    studentId: String, certificateType: String, issueDate: Date, fileUrl: String, digitalSignature: String, verificationToken: String
  }, { timestamps: true }));

  const FileMetadata = docConn.model('FileMetadata', new mongoose.Schema({
    originalName: String, mimeType: String, sizeBytes: Number, fileUrl: String, uploadedBy: String
  }, { timestamps: true }));

  await Promise.all([IssuedCertificate.deleteMany({}), FileMetadata.deleteMany({})]);

  const certTypes = ['DIPLOMA', 'TRANSCRIPT', 'ENROLLMENT_VERIFICATION', 'SCHOLARSHIP_AWARD'];
  for (let i = 0; i < 12; i++) {
    await IssuedCertificate.create({
      studentId: primaryStudentId,
      certificateType: certTypes[i % certTypes.length],
      issueDate: new Date(Date.now() - i * 86400000 * 15),
      fileUrl: `https://ulms.edu/certificates/cert_${i + 1}_johndoe.pdf`,
      digitalSignature: `SHA256:a94a8fe5ccb19ba61c4c0873d391e987982fbbd3${i}`,
      verificationToken: `CERT-VERIFY-2026-000${i + 1}`
    });

    await FileMetadata.create({
      originalName: `document_${i + 1}.pdf`,
      mimeType: 'application/pdf',
      sizeBytes: 2048500,
      fileUrl: `https://ulms.edu/uploads/files/doc_${i + 1}.pdf`,
      uploadedBy: primaryStudentId
    });
  }

  console.log('✅ document_db seeded (12 certificates & file metadatas)');

  // ------------------------------------------------------------------
  // 14. SEARCH DB (search_db)
  // ------------------------------------------------------------------
  console.log('📦 Seeding search_db...');
  const searchConn = getDbConnection('search_db');

  const IndexedDocument = searchConn.model('IndexedDocument', new mongoose.Schema({
    entityId: String, entityType: String, title: String, content: String, tags: [String]
  }, { timestamps: true }));

  await IndexedDocument.deleteMany({});

  for (let i = 0; i < 20; i++) {
    const course = createdCourses[i % createdCourses.length];
    await IndexedDocument.create({
      entityId: course._id.toString(),
      entityType: 'COURSE',
      title: `${course.code}: ${course.title}`,
      content: `${course.title} course description, prerequisites, syllabus, and course notes.`,
      tags: ['academic', course.code.toLowerCase(), 'course']
    });
  }

  console.log('✅ search_db seeded (20 search documents)');

  // ------------------------------------------------------------------
  // 15. REPORTING DB (reporting_db)
  // ------------------------------------------------------------------
  console.log('📦 Seeding reporting_db...');
  const reportConn = getDbConnection('reporting_db');

  const AuditLog = reportConn.model('AuditLog', new mongoose.Schema({
    userId: String, action: String, resource: String, timestamp: Date, ipAddress: String
  }));

  await AuditLog.deleteMany({});

  for (let i = 0; i < 15; i++) {
    await AuditLog.create({
      userId: primaryStudentId,
      action: i % 2 === 0 ? 'LOGIN_SUCCESS' : 'SUBMIT_ASSIGNMENT',
      resource: 'Student Portal',
      timestamp: new Date(Date.now() - i * 3600000 * 4),
      ipAddress: '127.0.0.1'
    });
  }

  console.log('✅ reporting_db seeded (15 audit log entries)');

  console.log('\n🎉 ALL 15 ULMS MICROSERVICE DATABASES HAVE BEEN POPULATED WITH 10–20+ MOCK ITEMS PER PAGE!');
  console.log('========================================================================================');
  console.log('🔑 Primary Student Login: student@ulms.edu / Password123!');
  console.log('🔑 Primary Faculty Login: robert.smith@ulms.edu / Password123!');
  console.log('🔑 Primary Admin Login:   admin@ulms.edu / Password123!');
  console.log('========================================================================================\n');

  process.exit(0);
}

runSeed().catch((err) => {
  console.error('❌ Seeding failed with error:', err);
  process.exit(1);
});
