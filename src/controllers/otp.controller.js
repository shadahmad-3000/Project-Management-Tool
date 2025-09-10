const { OTPService } = require("../services/index");
const asyncHandler = require("../utils/async.handler");

const otpsent = asyncHandler(async (req, res) => {
    const result = await OTPService.sentOTP(req.body);
    res.status(result?.status).json(result);
});

const otpresend = asyncHandler(async (req, res) => {
    const result = await OTPService.resendOTP(req.body);
    res.status(result?.status).json(result);
});

const otpverify = asyncHandler(async (req, res) => {
    const result = await OTPService.verifyOTP(req.body);
    res.status(result?.status).send(result?.message);
});

module.exports = {
    otpsent,
    otpverify,
    otpresend
}