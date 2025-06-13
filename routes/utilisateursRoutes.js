const express = require('express');
const router = express.Router();
const utilisateursController = require('../controllers/utilisateursControllers');

router.get('/user', utilisateursController.getDashboardData);
module.exports = router;