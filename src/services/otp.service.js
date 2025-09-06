const mailer = require("../utils/mailer");
const { status: httpStatus } = require("http-status");
const { OTP } = require("../models/otp.model")
const moment = require("moment");
const ApiError = require("../utils/apiError");
const { User } = require("../models/user.model");

//let otpStore = {}

const sentOTP = async (body) => {
    try {
        const { email } = body;
        if (!email) {
            return {
                status: httpStatus.status.BAD_REQUEST,
                message: "Email is required"
            }
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        // otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };
        const expires = Date.now() + 5 * 60 * 1000;

        const mailbody = {
            from: '"AutoPe Payment Solution"youremail@gmail.com',
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is ${otp} and valid for 5 minutes`
        }

        const mail = await mailer.sendMail(mailbody);
        console.log("Mail sent", mail);
        //otp to store in db
        const dataForDb = {
            email: email,
            otp: otp,
            expires: expires,
            isUsed: false
        }
        await OTP.create(dataForDb)

        return {
            status: httpStatus.OK,
            message: `OTP sent to ${email}`
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.BAD_GATEWAY,
            message: "Failed to sent OTP"
        }
    }
}
const resendOTP = async (body) => {
    try {
        const { email } = body;
        if (!email) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Email is required");
        }
        const existingOTP = await OTP.findOne({ email }).sort({ _id: -1 });
        if (existingOTP) {
            const now = moment();
            const createdtime = moment(existingOTP.createdAt);
            const difftime = now.diff(createdtime, "minutes");

            if (difftime < 3) {
                return {
                    status: httpStatus.BAD_REQUEST,
                    message: "Please wait for 3 minutes to send otp again"
                }
            }
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expires = Date.now() + 5 * 60 * 1000;

        const mailbody = {
            from: '"AutoPe Payment Solution" <youremail@gmail.com>',
            to: email,
            subject: "Your Resend OTP Code",
            text: `Your OTP is ${otp} and valid for 3 minutes`
        };
        const resendMail = await mailer.sendMail(mailbody);
        console.log("Resend Mail Successfull", resendMail);

        const dataForDb = {
            email: email,
            otp: otp,
            expires: expires,
        }
        await OTP.create(dataForDb)
        return {
            status: httpStatus.OK,
            message: `OTP resend successfully to ${email}`,
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.BAD_GATEWAY,
            message: "Failed to resend OTP"
        }
    }
}

const verifyOTP = async (body) => {
    try {
        const { email, otp } = body;
        if (!email || !otp) {
            return {
                status: httpStatus.BAD_REQUEST,
                message: "Email or OTP is requried"
            }
        }
        const record = await OTP.findOne({ email }).sort({ _id: -1 });
        if (!record) {
            return {
                status: httpStatus.BAD_REQUEST,
                message: "OTP not sent to this mail"
            }
        }
        if (Date.now() > record.expires) {
            return {
                status: httpStatus.BAD_REQUEST,
                message: "OTP is Expired"
            }
        }
        if (parseInt(otp) == record.otp) {
            record.isUsed = true;
            await record.save();

            await User.updateOne({ email }, { isVerified: true });
            return {
                status: httpStatus.OK,
                message: "OTP verified Successfully, Now kindly wait for Super-Admin Approval",
            }
        } else {
            return {
                status: httpStatus.UNAUTHORIZED,
                message: "Invalid OTP"
            }
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.BAD_GATEWAY,
            message: "Failed to verify OTP"
        }
    }
}
module.exports = {
    sentOTP,
    verifyOTP,
    resendOTP
}