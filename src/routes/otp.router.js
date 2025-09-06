const express = require("express");
const router = express.Router();
const { otpsent,otpresend ,otpverify } = require("../controllers/otp.controller");

router.post("/sent-otp", otpsent);
router.post("/resend-otp",otpresend);
router.post("/verify-otp", otpverify);

module.exports = router;