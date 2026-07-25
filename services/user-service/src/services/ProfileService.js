'use strict';

const profileRepo = require('../repositories/profile.repository');
const userRepo = require('../repositories/user.repository');
const publisher = require('../events/publisher');
const AppError = require('../utils/AppError');
const pick = require('../utils/pick');

const UPDATABLE_FIELDS = {
  STUDENT: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phone', 'photo', 'bloodGroup', 'nationality'],
  FACULTY: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phone', 'photo', 'specializations', 'qualifications', 'office', 'officeHours', 'bio'],
  ADMIN: ['firstName', 'lastName', 'phone', 'photo', 'department'],
  STAFF: ['firstName', 'lastName', 'phone', 'photo', 'designation', 'department'],
};

class ProfileService {
  async createProfile(userId, profileType, data) {
    const user = await userRepo.findById(userId);
    if (!user) throw AppError.notFound('User');

    const exists = await profileRepo.existsByUserId(profileType, userId);
    if (exists) throw AppError.conflict('Profile already exists for this user', 'PROFILE_EXISTS');

    const profile = await profileRepo.create(profileType, { ...data, userId });

    await publisher.publish('user.events', {
      eventType: 'user.profile_created',
      payload: { userId: userId.toString(), role: profileType, profileId: profile._id.toString() },
    });

    return profile;
  }

  async getProfile(userId, profileType) {
    const profile = await profileRepo.findByUserId(profileType, userId);
    if (!profile) throw AppError.notFound('Profile');
    return profile;
  }

  async updateProfile(userId, profileType, rawData) {
    const allowedFields = UPDATABLE_FIELDS[profileType] || [];
    const data = pick(rawData, allowedFields);

    const profile = await profileRepo.updateByUserId(profileType, userId, data);
    if (!profile) throw AppError.notFound('Profile');

    await publisher.publish('user.events', {
      eventType: 'user.profile_updated',
      payload: { userId: userId.toString(), fields: Object.keys(data) },
    });

    return profile;
  }

  async getAllProfiles(profileType, filter = {}, options = {}) {
    return profileRepo.findAll(profileType, filter, options);
  }

  // Addresses
  async addAddress(ownerId, ownerType, data) {
    return profileRepo.createAddress({ ...data, ownerId, ownerType });
  }

  async getAddresses(ownerId) {
    return profileRepo.findAddresses(ownerId);
  }

  async removeAddress(addressId) {
    const address = await profileRepo.findAddresses(addressId);
    if (!address) throw AppError.notFound('Address');
    return profileRepo.deleteAddress(addressId);
  }

  // Emergency Contacts
  async addEmergencyContact(ownerId, data) {
    return profileRepo.createEmergencyContact({ ...data, ownerId });
  }

  async getEmergencyContacts(ownerId) {
    return profileRepo.findEmergencyContacts(ownerId);
  }
}

module.exports = new ProfileService();
