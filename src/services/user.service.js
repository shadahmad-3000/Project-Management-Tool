const { User } = require("../models");
const { status: httpStatus } = require("http-status");
const ApiError = require("../utils/apiError");

const deleteUser = async (param) => {
    try {
        const { empID } = param;

        const deletedUser = await User.findOneAndDelete({ empID });
        if (!deletedUser) {
            throw new ApiError(httpStatus.NOT_FOUND, `User not found with empId: ${empID}`);
        }
        return {
            status: httpStatus.OK,
            message: "User Deleted Successfully",
            data: deletedUser
        };
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: error?.statusCode || httpStatus.BAD_GATEWAY,
            message: error?.message || "Failed to Delete User"
        };
    }
};

const updateUser = async (param, body) => {
    try {
        const { empID } = param;
        const { updateData } = body;

        const user = await User.findOneAndUpdate(
            { empID: empID },
            { $set: updateData },
            { new: true }
        )

        console.log("User's Data Updated", user);

        if (!user) {
            return {
                status: httpStatus.BAD_REQUEST,
                message: "User Not Found"
            }
        }
        return {
            status: httpStatus.OK,
            message: "User's Data Updated Successfully",
            data: user
        }
    } catch (error) {
        console.error(error?.message || error, "Internal Server Error");
        return {
            status: httpStatus.BAD_GATEWAY,
            message: "Failed to update User Data"
        }
    }
}
const getUsers = async () => {
    try {
        const allUsers = await User.find();
    
        return {
            status: httpStatus.OK,
            message: "All Users are here",
            data: allUsers
        }
    } catch (error) {
        console.error(error?.message || error, "Intertnal Server Error");
        return {
            status: httpStatus.BAD_GATEWAY,
            message: "Error in Fetching Users!!!"
        }
    }
};

const getUsersbyId = async () => {
    try {
        const allUsers = await User.find();
    
        return {
            status: httpStatus.OK,
            message: "User is here",
            data: allUsers
        }
    } catch (error) {
        console.error(error?.message || error, "Intertnal Server Error");
        return {
            status: httpStatus.BAD_GATEWAY,
            message: "Error in Fetching User!!!"
        }
    }
};

module.exports = {
    deleteUser,
    updateUser,
    getUsers,
    getUsersbyId
}