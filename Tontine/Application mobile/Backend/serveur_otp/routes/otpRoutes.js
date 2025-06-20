const express = require('express')
const router = express.Router()
const verifyOTPController = require('../controllers/verifyOTPControllers')
const inviteController = require('../controllers/inviteController')
const sendOTPController = require('../controllers/sendOTPController')

router.post('/send-otp', sendOTPController.sendOTP)
router.post('/verify-otp', verifyOTPController.verifyOTP)
router.get('/invite', inviteController.invite)

module.exports = router