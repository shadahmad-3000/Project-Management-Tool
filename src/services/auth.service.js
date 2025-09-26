const { status: httpStatus } = require("http-status");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, OTP } = require("../models");
const config = require("../utils/config");
const JWT_SECRET = config?.JWT_SECRET;
const JWT_EXPIRES_IN = config?.JWT_EXPIRES_IN;
const crypto = require("crypto");
const OTPService = require("../services/otp.service");

/*const signUp = async (body) => {
  try {
    const { email, name, phoneNo } = body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        status: httpStatus.BAD_REQUEST,
        message: "Employee already exist with this mail",
        data: null,
      };
    }
    const autoPassword = crypto.randomBytes(4).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(autoPassword, salt);

    const newUser = await User.create({
      email,
      //password: hashedPassword,
      name,
      //empID,
      phoneNo,
      //designation,
      isPasswordChanged: false,
      isVerified: false,
      isApproved: false,
    });
    console.log("User Registerd:", newUser);

    const otpRes = await OTPService.sentOTP({ email });

    return {
      status: httpStatus.OK,
      message: otpRes?.message,
      data: newUser,
    };
  } catch (error) {
    console.error(error?.message || error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to registed User",
      data: null,
    };
  }
};*/

const signin = async (body) => {
  try {
    const { email, password } = body;
    const user = await User.findOne({ email });
    if (!user) {
      return {
        status: httpStatus.BAD_REQUEST,
        message: "User Not Found",
      };
    }
    const passMatch = await bcrypt.compare(password, user.password);
    console.log("password match", passMatch);

    if (!passMatch) {
      return {
        status: httpStatus.UNAUTHORIZED,
        message: "Password Not Matched",
      };
    }

    //generate jwt
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    // to save token in DB
    user.token = token;
    await user.save();

    if (user.isFirstLogin) {
      return {
        status: httpStatus.OK,
        message: "Please change your password",
        token,
        role: user?.role,
        forcePasswordChange: true,
      };
    }
    return {
      status: httpStatus.OK,
      message: "Signin Successfull",
      token: token,
      role: user?.role,
      forcePasswordChange: false,
    };
  } catch (error) {
    console.error(error?.message || error);
    return {
      status: httpStatus.BAD_GATEWAY,
      message: "Failed to signin",
    };
  }
};

const changePassword = async (body) => {
  try {
    const { email, oldPassword, newPassword } = body;

    const user = await User.findOne({ email });
    if (!user) {
      return {
        status: httpStatus.NOT_FOUND,
        message: "User Not Found",
      };
    }
    console.log("Old Password", oldPassword);
    console.log("HashedPassword", user.password);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    console.log("Password Match", isMatch);

    if (!isMatch) {
      return {
        status: httpStatus.UNAUTHORIZED,
        message: "Password Not Matched",
      };
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.isFirstLogin = false;
    await user.save();

    return {
      status: httpStatus.OK,
      message: "Password changed Successfully",
    };
  } catch (error) {
    console.error(error?.message || error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to change Password",
    };
  }
};

const logout = async (body) => {
  try {
    const { email } = body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return {
        status: httpStatus.BAD_REQUEST,
        message: "User Not Found",
      };
    }
    existingUser.token = null;
    await existingUser.save();

    return {
      status: httpStatus.OK,
      message: "Log Out Successfull",
    };
  } catch (error) {
    console.error(error?.message || error);
    return {
      status: httpStatus.BAD_GATEWAY,
      message: "Failed to Log Out",
    };
  }
};

const forgetPassword = async (body) => {
  try {
    const { email } = body;
    if (!email) {
      return {
        status: httpStatus.NOT_FOUND,
        message: "Email is Required!",
      };
    }
    const user = await User.findOne({ email });
    if (!user) {
      return {
        status: httpStatus.NOT_FOUND,
        message: "User not found with this email",
      };
    }
    OTPService.sentOTP({ email });
    return {
      status: httpStatus.OK,
      message: `OTP send to ${email}`,
    };
  } catch (error) {
    console.error(error?.message || error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to Reset Password, Due to Some Error",
    };
  }
};

const resetPassword = async (body) => {
  try {
    const { email, newPassword } = body;
    if (!email || !newPassword) {
      return {
        status: httpStatus.NOT_FOUND,
        message: "All fields are Mandatory",
      };
    }
    const user = await User.findOne({ email });
    if (!user) {
      return {
        status: httpStatus.NOT_FOUND,
        message: "User Not Found",
      };
    }    
    if (!user.isVerified) {
      return {
        status: httpStatus.UNAUTHORIZED,
        message: "OTP Verification is required to set new Password",
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    user.isFirstLogin = false;
    user.isVerified = true;
    await user.save();

    return {
      status: httpStatus.OK,
      message: "Reset password done Successfully",
    };
  } catch (error) {
    console.error(error?.message || error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to reset Password",
    };
  }
};
module.exports = {
  signin,
  logout,
  changePassword,
  forgetPassword,
  resetPassword,
};
