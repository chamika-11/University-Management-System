'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/SearchController');
const authenticate = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');

router.use(authenticate);

// Public lookup search api
router.get('/', controller.search);

// Internal admin indexing trigger
router.post('/index', requireRole('ADMIN', 'SUPER_ADMIN'), controller.index);

module.exports = router;
