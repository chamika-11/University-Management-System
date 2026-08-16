'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/user_db';

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

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
    }, { timestamps: true }));

    const AdminProfile = mongoose.model('AdminProfile', new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      employeeId: String,
      firstName: String,
      lastName: String,
      department: String,
      accessLevel: Number,
    }, { timestamps: true }));

    // Ensure ADMIN role exists
    let adminRole = await Role.findOne({ name: 'ADMIN' });
    if (!adminRole) {
      adminRole = await Role.create({ name: 'ADMIN', description: 'Admin role', isDefault: false, isSystem: true });
    }

    const email = 'superadmin@ulms.edu';
    const password = 'Password123';
    const passwordHash = await bcrypt.hash(password, 10);

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        passwordHash,
        roleId: adminRole._id,
        profileType: 'ADMIN',
        status: 'ACTIVE',
        isEmailVerified: true
      });

      await AdminProfile.create({
        userId: user._id,
        employeeId: `ADM-SUPER-001`,
        firstName: 'Super',
        lastName: 'Administrator',
        department: 'IT Operations',
        accessLevel: 5
      });
      console.log(`✅ Successfully seeded Super Admin:\nEmail: ${email}\nPassword: ${password}`);
    } else {
      console.log(`⚠️ Admin ${email} already exists.`);
    }

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
