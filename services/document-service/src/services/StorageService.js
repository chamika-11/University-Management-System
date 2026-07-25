'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const FileMetadata = require('../models/FileMetadata.model');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const publisher = require('../events/publisher');

class StorageService {
  constructor() {
    // Ensure upload directory exists
    const fullPath = path.resolve(env.UPLOAD_DIR);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  }

  /**
   * Processes an uploaded file buffer, saves it to disk, hashes it, and stores metadata.
   */
  async uploadFile({ originalName, buffer, mimeType, sizeBytes, uploadedBy, isPublic = false }) {
    if (!env.ALLOWED_FILE_TYPES.includes(mimeType)) {
      throw AppError.badRequest(`File type '${mimeType}' is not allowed`, 'INVALID_FILE_TYPE');
    }

    if (sizeBytes > env.MAX_FILE_SIZE_BYTES) {
      throw AppError.badRequest('File size exceeds permitted threshold', 'FILE_TOO_LARGE');
    }

    // SHA-256 Hash calculation for digital signature/duplicate check
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    const filename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${path.extname(originalName)}`;
    const relativePath = path.join(env.UPLOAD_DIR, filename);
    const absolutePath = path.resolve(relativePath);

    // Save to local storage
    fs.writeFileSync(absolutePath, buffer);

    const file = await FileMetadata.create({
      filename,
      originalName,
      mimeType,
      sizeBytes,
      path: relativePath,
      sha256Hash: hash,
      uploadedBy,
      isPublic,
    });

    await publisher.publish('document.events', {
      eventType: 'document.uploaded',
      payload: { fileId: file._id.toString(), filename, originalName, sha256Hash: hash, uploadedBy },
    });

    return file;
  }

  async getFile(id) {
    const file = await FileMetadata.findById(id);
    if (!file) throw AppError.notFound('File');
    return file;
  }

  async deleteFile(id, userId) {
    const file = await FileMetadata.findById(id);
    if (!file) throw AppError.notFound('File');

    // Only owner or admin can delete
    if (file.uploadedBy !== userId) throw AppError.forbidden('You are not the owner of this file', 'FORBIDDEN');

    const absolutePath = path.resolve(file.path);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    await FileMetadata.findByIdAndDelete(id);

    await publisher.publish('document.events', {
      eventType: 'document.deleted',
      payload: { fileId: id, filename: file.filename, uploadedBy: userId },
    });

    return { message: 'File deleted successfully' };
  }
}

module.exports = new StorageService();
