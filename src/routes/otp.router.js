const express = require("express");
const { OTPController } = require("../controllers");
const validate = require("../middlewares/validator");
const { otpValidation } = require("../validations");
const router = express.Router();

router.post("/sent-otp", validate(otpValidation.sentOTPValidation), OTPController.otpsent);
router.post("/resend-otp", validate(otpValidation.resendOTPValidation), OTPController.otpresend);
router.post("/verify-otp", validate(otpValidation.verifyOTPValidation), OTPController.otpverify);

module.exports = router;