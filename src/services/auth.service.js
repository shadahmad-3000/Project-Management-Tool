const { status: httpStatus } = require("http-status");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const { OTPService } = require("../services")
const { User } = require("../models");
const config = require("../utils/config");

const JWT_SECRET = config?.JWT_SECRET;
const JWT_EXPIRES_IN = config?.JWT_EXPIRES_IN;

//User Registration
const signUp = async (body) => {
    try {
        const { email, password, name, empID, phoneNo, designation } = body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return {
                status: httpStatus.BAD_REQUEST,
                message: "Employee already exist with this mail",
                data: null
            }
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
            empID,
            phoneNo,
            designation,
            isVerified: false,
            isApproved: false,
        });
        console.log("User Registerd:", newUser);

        const otpRes = await OTPService.sentOTP({ email });

        return {
            status: httpStatus.OK,
            message: otpRes?.message,
            data: newUser
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.BAD_GATEWAY,
            message: "Failed to registed User",
            data: null
        }
    }
};

const signin = async (body) => {
    try {
        const { email, password } = body;
        const user = await User.findOne({ email });
        if (!user) {
            return {
                status: httpStatus.BAD_REQUEST,
                message: "User Not Found",
            }
        }
        //check user is verified or not
        if (!user.isVerified) {
            return {
                status: httpStatus.UNAUTHORIZED,
                message: "Please verify your email with OTP before logging in"
            };
        }
        //check user is approved or not
        if (!user.isApproved) {
            return {
                status: httpStatus.UNAUTHORIZED,
                message: "Your Account needs approval from Super-Admin"
            }
        }
        const passMatch = await bcrypt.compare(password, user.password);
        if (!passMatch) {
            return {
                status: httpStatus.UNAUTHORIZED,
                message: "Password Not Matched"
            }
        }

        //generate jwt
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        )
        // to save token in DB
        user.token = token;
        await user.save();

        return {
            status: httpStatus.OK,
            message: "Signin Successfull",
            token: token
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.BAD_GATEWAY,
            message: "Failed to signin"
        }
    }
}
const logout = async (body) => {
    try {
        const { email } = body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return {
                status: httpStatus.BAD_REQUEST,
                message: "User Not Found"
            }
        }
        existingUser.token = null;
        await existingUser.save();

        return {
            status: httpStatus.OK,
            message: "Log Out Successfull"
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.status.BAD_GATEWAY,
            message: "Failed to Log Out"
        }
    }
};

module.exports = {
    signin,
    signUp,
    logout
};