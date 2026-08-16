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

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/user_db';

async function setupCredentials() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB user_db');

    const Role = mongoose.model('Role', new mongoose.Schema({
      name: String, description: String, isDefault: Boolean, isSystem: Boolean
    }, { timestamps: true }));

    const User = mongoose.model('User', new mongoose.Schema({
      email: { type: String, unique: true },
      passwordHash: String,
      roleId: mongoose.Schema.Types.ObjectId,
      profileType: String,
      status: String,
      isEmailVerified: Boolean,
      loginAttempts: { type: Number, default: 0 },
      lockedUntil: { type: Date, default: null }
    }, { timestamps: true }));

    const StudentProfile = mongoose.model('StudentProfile', new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      studentId: String,
      firstName: String,
      lastName: String,
      gender: String,
      phone: String,
      enrollmentYear: Number,
      enrollmentStatus: String,
      cgpa: Number,
      nationality: String
    }, { timestamps: true }));

    const FacultyProfile = mongoose.model('FacultyProfile', new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      employeeId: String,
      firstName: String,
      lastName: String,
      designation: String,
      phone: String,
      office: String,
      officeHours: String,
      bio: String
    }, { timestamps: true }));

    const AdminProfile = mongoose.model('AdminProfile', new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      employeeId: String,
      firstName: String,
      lastName: String,
      department: String,
      accessLevel: Number
    }, { timestamps: true }));

    const StaffProfile = mongoose.model('StaffProfile', new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      staffId: String,
      employeeId: String,
      firstName: String,
      lastName: String,
      department: String,
      designation: String
    }, { timestamps: true }));

    // 1. Ensure Roles exist
    let adminRole = await Role.findOne({ name: 'ADMIN' });
    if (!adminRole) adminRole = await Role.create({ name: 'ADMIN', description: 'Admin role', isDefault: false, isSystem: true });

    let studentRole = await Role.findOne({ name: 'STUDENT' });
    if (!studentRole) studentRole = await Role.create({ name: 'STUDENT', description: 'Student role', isDefault: true, isSystem: true });

    let facultyRole = await Role.findOne({ name: 'FACULTY' });
    if (!facultyRole) facultyRole = await Role.create({ name: 'FACULTY', description: 'Faculty role', isDefault: false, isSystem: true });

    let staffRole = await Role.findOne({ name: 'STAFF' });
    if (!staffRole) staffRole = await Role.create({ name: 'STAFF', description: 'Staff role', isDefault: false, isSystem: true });

    const password = 'Password123';
    const passwordHash = await bcrypt.hash(password, 10);

    // 2. Ensure core users exist
    const coreUsers = [
      // ADMINS
      { email: 'admin@ulms.edu', roleId: adminRole._id, profileType: 'ADMIN', firstName: 'System', lastName: 'Administrator', dept: 'IT Operations', accessLevel: 5 },
      { email: 'superadmin@ulms.edu', roleId: adminRole._id, profileType: 'ADMIN', firstName: 'Super', lastName: 'Admin', dept: 'IT Operations', accessLevel: 5 },
      { email: 'registrar@ulms.edu', roleId: adminRole._id, profileType: 'ADMIN', firstName: 'Eleanor', lastName: 'Vance', dept: 'Academic Registry', accessLevel: 4 },
      { email: 'bursar@ulms.edu', roleId: adminRole._id, profileType: 'ADMIN', firstName: 'Marcus', lastName: 'Brody', dept: 'Finance Office', accessLevel: 4 },
      { email: 'librarian@ulms.edu', roleId: adminRole._id, profileType: 'ADMIN', firstName: 'Hannah', lastName: 'Abbott', dept: 'University Library', accessLevel: 3 },
      { email: 'support@ulms.edu', roleId: adminRole._id, profileType: 'ADMIN', firstName: 'David', lastName: 'Geller', dept: 'Student Services', accessLevel: 3 },

      // STUDENTS
      { email: 'student@ulms.edu', roleId: studentRole._id, profileType: 'STUDENT', firstName: 'John', lastName: 'Doe', studentId: 'STU-2026-0001' },
      { email: 'alice.smith@ulms.edu', roleId: studentRole._id, profileType: 'STUDENT', firstName: 'Alice', lastName: 'Smith', studentId: 'STU-2026-0010' },
      { email: 'bob.johnson@ulms.edu', roleId: studentRole._id, profileType: 'STUDENT', firstName: 'Bob', lastName: 'Johnson', studentId: 'STU-2026-0011' },

      // FACULTY
      { email: 'faculty@ulms.edu', roleId: facultyRole._id, profileType: 'FACULTY', firstName: 'Robert', lastName: 'Smith', designation: 'Professor', dept: 'Computer Science' },
      { email: 'robert.smith@ulms.edu', roleId: facultyRole._id, profileType: 'FACULTY', firstName: 'Robert', lastName: 'Smith', designation: 'Professor', dept: 'Computer Science' },
      { email: 'sarah.johnson@ulms.edu', roleId: facultyRole._id, profileType: 'FACULTY', firstName: 'Sarah', lastName: 'Johnson', designation: 'Associate Professor', dept: 'Software Engineering' },

      // STAFF
      { email: 'staff@ulms.edu', roleId: staffRole._id, profileType: 'STAFF', firstName: 'Staff', lastName: 'Coordinator', dept: 'Student Affairs', designation: 'Coordinator' },
      { email: 'staff1@ulms.edu', roleId: staffRole._id, profileType: 'STAFF', firstName: 'StaffMember1', lastName: 'Officer', dept: 'Admissions & Registrar', designation: 'Academic Coordinator' }
    ];

    for (const u of coreUsers) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        user = await User.create({
          email: u.email,
          passwordHash,
          roleId: u.roleId,
          profileType: u.profileType,
          status: 'ACTIVE',
          isEmailVerified: true,
          loginAttempts: 0,
          lockedUntil: null
        });

        if (u.profileType === 'ADMIN') {
          await AdminProfile.create({
            userId: user._id,
            employeeId: `ADM-${Date.now().toString().slice(-4)}`,
            firstName: u.firstName,
            lastName: u.lastName,
            department: u.dept || 'Administration',
            accessLevel: u.accessLevel || 4
          });
        } else if (u.profileType === 'STUDENT') {
          await StudentProfile.create({
            userId: user._id,
            studentId: u.studentId || `STU-${Date.now().toString().slice(-4)}`,
            firstName: u.firstName,
            lastName: u.lastName,
            gender: 'MALE',
            phone: '+1 (555) 019-2831',
            enrollmentYear: 2024,
            enrollmentStatus: 'ENROLLED',
            cgpa: 3.8,
            nationality: 'American'
          });
        } else if (u.profileType === 'FACULTY') {
          await FacultyProfile.create({
            userId: user._id,
            employeeId: `FAC-${Date.now().toString().slice(-4)}`,
            firstName: u.firstName,
            lastName: u.lastName,
            designation: u.designation || 'Professor',
            phone: '+1 (555) 020-4001',
            office: 'Engineering Bldg Room 101',
            officeHours: 'Mon/Wed 14:00 - 16:00',
            bio: `Professor in ${u.dept || 'Computer Science'}`
          });
        } else if (u.profileType === 'STAFF') {
          await StaffProfile.create({
            userId: user._id,
            staffId: `STF-${Date.now().toString().slice(-4)}`,
            employeeId: `EMP-${Date.now().toString().slice(-4)}`,
            firstName: u.firstName,
            lastName: u.lastName,
            department: u.dept || 'Academic Support',
            designation: u.designation || 'Staff Officer'
          });
        }
        console.log(`✨ Created new user: ${u.email} (${u.profileType})`);
      }
    }

    // 3. Update ALL existing users in user_db to have password 'Password123'
    const updateResult = await User.updateMany(
      {},
      {
        $set: {
          passwordHash: passwordHash,
          status: 'ACTIVE',
          loginAttempts: 0,
          lockedUntil: null,
          isEmailVerified: true
        }
      }
    );

    console.log(`🔐 Updated ${updateResult.modifiedCount} user passwords to "${password}".`);

    const allUsers = await User.find({}).sort({ profileType: 1, email: 1 });
    console.log(`\n========================================`);
    console.log(`🎉 ALL ULMS USERS READY WITH PASSWORD: ${password}`);
    console.log(`========================================`);
    allUsers.forEach(u => {
      console.log(`- [${u.profileType.padEnd(8)}] ${u.email}`);
    });

  } catch (error) {
    console.error('❌ Failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

setupCredentials();
