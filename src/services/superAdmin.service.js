const { User } = require("../models/user.model");
const ApiError = require("../utils/apiError");
const { status: httpStatus } = require("http-status");

const getPendingUsers = async () => {
    return await User.find({
        isVerified: true,
        isApproved: false
    });
};

const approveUser = async (userId) => {
    return await User.findOneAndUpdate(
        { _id: userId },
        { isApproved: true },
        { new: true }
    );
};

const declineUser = async (userId) => {
    return await User.findOneAndDelete(
        { _id: userId }
    );
};

const assignRole = async (body) => {
    try {
        const { email, role } = body;
        if (!email) {
            return {
                status: httpStatus.BAD_REQUEST,
                message: "User Email is required"
            };
        }
        const validRole = ["User", "Admin", "Super-Admin", "Manager", "Team-Lead", "HR"];
        if (!validRole.includes(role)) {
            return {
                status: httpStatus.BAD_REQUEST,
                message: "Invalid Role"
            };
        }
        const user = await User.findOneAndUpdate(
            { email: email },
            { $set: { role } },
            { new: true }
        );
        console.log("User Found",user);
        if (!user) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "User Not Found"
            };
        }

        return {
            status: httpStatus.OK,
            message: `Role Updated to ${role}`,
            data: user
        };

    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: error?.message || "Internal Server Error"
        };
    }
};

module.exports = {
    getPendingUsers,
    approveUser,
    declineUser,
    assignRole
};
