'use strict';

const express = require('express');
const router = express.Router();
const payment = require('../controllers/PaymentController');
const invoice = require('../controllers/InvoiceController');
const authenticate = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');

router.use(authenticate);

// Invoices
router.get('/invoices/me', invoice.getMyInvoices);
router.get('/invoices',    requireRole('ADMIN', 'STAFF', 'SUPER_ADMIN'), invoice.getAll);
router.get('/invoices/:id', invoice.getOne);

// Payments & Ledger
router.post('/payments/charge', payment.processPayment);
router.get('/ledger/balance',  payment.getBalance);
router.get('/ledger/balance/:userId', requireRole('ADMIN', 'SUPER_ADMIN'), payment.getBalance);
router.get('/ledger/account/:accountId', requireRole('ADMIN', 'SUPER_ADMIN'), payment.getLedger);

module.exports = router;
