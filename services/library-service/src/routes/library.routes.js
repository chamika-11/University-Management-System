'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/CatalogController');
const authenticate = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');

router.use(authenticate);

// Public student catalog routes
router.get('/books', controller.search);
router.get('/loans/me', controller.getStudentLoans);

// Checkout and Return transaction routes
router.post('/checkout', requireRole('STUDENT'), controller.checkout);
router.post('/loans/:loanId/return', requireRole('ADMIN', 'STAFF'), controller.return);
router.post('/loans/:loanId/renew', requireRole('STUDENT'), controller.renew);

// Admin-only management
router.post('/books', requireRole('ADMIN', 'STAFF', 'SUPER_ADMIN'), controller.addBook);
router.get('/loans/student/:studentId', requireRole('ADMIN', 'STAFF', 'SUPER_ADMIN'), controller.getStudentLoans);

module.exports = router;
