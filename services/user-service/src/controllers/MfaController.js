'use strict';

const mfaService = require('../services/MfaService');
const asyncHandler = require('../utils/asyncHandler');

class MfaController {
  setup = asyncHandler(async (req, res) => {
    const result = await mfaService.setupTOTP(req.user.id);
    res.status(200).json({ success: true, data: result });
  });

  enable = asyncHandler(async (req, res) => {
    const result = await mfaService.enableMfa(req.user.id, req.body.token);
    res.status(200).json({ success: true, data: result });
  });

  disable = asyncHandler(async (req, res) => {
    const result = await mfaService.disableMfa(req.user.id, req.body.token);
    res.status(200).json({ success: true, data: result });
  });

  verify = asyncHandler(async (req, res) => {
    const isValid = await mfaService.verifyTOTP(req.user.id, req.body.token);
    res.status(200).json({ success: true, data: { valid: isValid } });
  });
}

module.exports = new MfaController();
