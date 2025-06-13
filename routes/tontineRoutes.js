const express = require('express');
const router = express.Router();
const tontineController = require('../controllers/tontinecontrollers');

router.get('/dashboard', tontineController.getDashboardData);

module.exports = router;
