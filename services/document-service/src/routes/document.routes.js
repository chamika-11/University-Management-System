'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require('../controllers/FileController');
const certController = require('../controllers/CertificateController');
const authenticate = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');

const upload = multer({ storage: multer.memoryStorage() });

// Public QR code verification endpoint
router.get('/certificates/verify/:token', certController.verify);

// Protected routes
router.use(authenticate);

router.post('/upload', upload.single('file'), fileController.upload);
router.get('/files/:id', fileController.download);
router.delete('/files/:id', fileController.delete);

router.post('/certificates/issue', requireRole('ADMIN', 'SUPER_ADMIN'), certController.issue);
router.get('/certificates', certController.getStudentCerts);
router.get('/certificates/student/:studentId', requireRole('ADMIN', 'FACULTY', 'SUPER_ADMIN'), certController.getStudentCerts);

module.exports = router;
