const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        otp: {
            type: Number,
            required: true
        },
        expires: {
            type: Date,
            required: true,
        },
        isUsed: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);

const OTP = mongoose.model("OTP", otpSchema, "otps");

module.exports = { OTP };