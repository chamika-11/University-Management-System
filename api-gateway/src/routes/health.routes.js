const express = require('express');
const HealthCheckController = require('../controllers/HealthCheckController');

const router = express.Router();

router.get('/', HealthCheckController.getHealth);
router.get('/services', HealthCheckController.getServicesHealth);

module.exports = router;
