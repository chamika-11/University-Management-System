'use strict';

const path = require('path');
const fs = require('fs');
const storageService = require('../services/StorageService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

class FileController {
  upload = asyncHandler(async (req, res) => {
    if (!req.file) throw AppError.badRequest('No file uploaded', 'EMPTY_FILE');

    const file = await storageService.uploadFile({
      originalName: req.file.originalname,
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      uploadedBy: req.user?.id || 'ANONYMOUS',
      isPublic: req.body.isPublic === 'true',
    });

    res.status(201).json({ success: true, data: { file } });
  });

  download = asyncHandler(async (req, res) => {
    const file = await storageService.getFile(req.params.id);
    const absolutePath = path.resolve(file.path);

    if (!fs.existsSync(absolutePath)) {
      throw AppError.notFound('Physical file not found on disk');
    }

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    fs.createReadStream(absolutePath).pipe(res);
  });

  delete = asyncHandler(async (req, res) => {
    const result = await storageService.deleteFile(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: result });
  });
}

module.exports = new FileController();
