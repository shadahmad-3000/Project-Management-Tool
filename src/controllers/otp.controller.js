const otpService = require("../services/otp.service");
const { status: httpStatus } = require("http-status");

const otpsent = async (req, res) => {
    try {
        const result = await otpService.sentOTP(req.body);
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "OTP send Successfully",
            data: result
        })
    } catch (error) {
        console.error(error?.message || error);
        return res.status(httpStatus.BAD_GATEWAY).json({
            status: httpStatus.BAD_GATEWAY,
            message: error?.message || "Internal Server Error"
        })
    }
};

const otpresend = async (req, res) => {
    try {
        const result = await otpService.resendOTP(req.body);
        if (!result) {
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: "OTP Not Resend"
            })
        }
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "OTP Resend Successfully",
            data: result
        })
    } catch (error) {
        console.error(error?.message || error);
        res.status(httpStatus.BAD_GATEWAY).json({
            status: httpStatus.BAD_GATEWAY,
            message: "Internal Server Error"
        })
    }
};

const otpverify = async (req, res) => {
    try {
        const result = await otpService.verifyOTP(req.body);
        res.send(result);
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.OK,
            message: "Internal Server Error"
        }
    }
};

module.exports = {
    otpsent,
    otpverify,
    otpresend
}