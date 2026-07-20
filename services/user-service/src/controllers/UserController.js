'use strict';

const userRepo = require('../repositories/user.repository');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const pick = require('../utils/pick');

class UserController {
  getAll = asyncHandler(async (req, res) => {
    const { page, limit, profileType, status } = req.query;
    const filter = {};
    if (profileType) filter.profileType = profileType;
    if (status) filter.status = status;
    const result = await userRepo.findAll(filter, { page, limit });
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });

  getOne = asyncHandler(async (req, res) => {
    const user = await userRepo.findById(req.params.id);
    if (!user) throw AppError.notFound('User');
    res.status(200).json({ success: true, data: { user } });
  });

  update = asyncHandler(async (req, res) => {
    const data = pick(req.body, ['status', 'isEmailVerified']);
    const user = await userRepo.updateById(req.params.id, data);
    if (!user) throw AppError.notFound('User');
    res.status(200).json({ success: true, data: { user } });
  });

  delete = asyncHandler(async (req, res) => {
    const user = await userRepo.deleteById(req.params.id);
    if (!user) throw AppError.notFound('User');
    res.status(200).json({ success: true, data: { message: 'User deleted successfully' } });
  });

  lock = asyncHandler(async (req, res) => {
    const { durationMinutes = 60 } = req.body;
    const until = new Date(Date.now() + durationMinutes * 60 * 1000);
    const user = await userRepo.lockAccount(req.params.id, until);
    if (!user) throw AppError.notFound('User');
    res.status(200).json({ success: true, data: { message: `Account locked until ${until.toISOString()}` } });
  });

  unlock = asyncHandler(async (req, res) => {
    const user = await userRepo.unlockAccount(req.params.id);
    if (!user) throw AppError.notFound('User');
    res.status(200).json({ success: true, data: { message: 'Account unlocked successfully' } });
  });
}

module.exports = new UserController();
