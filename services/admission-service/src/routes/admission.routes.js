'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/ApplicationController');
const authenticate = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const { submitApplicationSchema, uploadDocsSchema, evaluateSchema } = require('../validators/admission.validator');

// Public or basic applicant routes
router.post('/applications',             validate(submitApplicationSchema), controller.submit);
router.post('/applications/:id/documents', validate(uploadDocsSchema),        controller.uploadDocs);
router.post('/applications/:id/accept',                                       controller.acceptOffer);

// Protected staff/admin routes
router.use(authenticate);

router.get('/applications',             requireRole('ADMIN', 'STAFF', 'SUPER_ADMIN'), controller.getAll);
router.get('/applications/:id',                                                        controller.getOne);
router.post('/applications/:id/evaluate', requireRole('ADMIN', 'STAFF', 'SUPER_ADMIN'), validate(evaluateSchema), controller.evaluate);
router.post('/applications/:id/offer',    requireRole('ADMIN', 'STAFF', 'SUPER_ADMIN'), controller.generateOffer);
router.post('/applications/:id/confirm',  requireRole('ADMIN', 'STAFF', 'SUPER_ADMIN'), controller.confirm);

router.post('/cycles',                  requireRole('ADMIN', 'SUPER_ADMIN'), controller.createCycle);
router.get('/cycles',                                                                controller.getCycles);

module.exports = router;
