import express from "express"
import{verifyOTP} from "../controllers/verifyOTPController.js"
import{sendOTP} from "../controllers/sendOTPController.js"
import{invite} from "../controllers/inviteController.js"

const router = express.Router()

router.post('/send-otp', sendOTP)
router.post('/verify-otp', verifyOTP)
router.get('/invite', invite)


export default router