const { OTPService } = require("../services");
const { status: httpStatus } = require("http-status");

const otpsent = async (req, res) => {
    try {
        const result = await OTPService.sentOTP(req.body);
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
        const result = await OTPService.resendOTP(req.body);
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
        const result = await OTPService.verifyOTP(req.body);
        res.send(result);
    } catch (error) {
        console.error(error?.message || error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message:"Internal Server Error"
        })
    }
};

module.exports = {
    otpsent,
    otpverify,
    otpresend
}