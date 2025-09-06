const superAdminService = require("../services/superAdmin.service");
const { status: httpStatus, default: status } = require("http-status");

const getPendingUsers = async (req, res) => {
    try {
        const result = await superAdminService.getPendingUsers();
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Pending users fetched successfully",
            data: result
        });
    } catch (error) {
        console.error(error?.message || error, "Internal Server Error");
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Server Error"
        });
    }
};

const approveUser = async (req, res) => {
    try {
        console.log("@@@@@@@@@@@@@@@");
        const { id } = req.params;
        const result = await superAdminService.approveUser(id);

        if (!result) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: "User not found"
            });
        }

        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "User Approved,now User can Log In",
            data: result
        });
    } catch (error) {
        console.error(error?.message || error, "Internal Server Error");
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Server Error"
        });
    }
};

const declineUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await superAdminService.declineUser(id);

        if (!result) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: "User not found"
            });
        }
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "User Declined and Removed"
        });
    } catch (error) {
        console.error(error?.message || error, "Internal Server Error");
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Server Error"
        });
    }
};

const roleAssign = async (req, res) => {
    try {
        const result = await superAdminService.assignRole(req.body);
        if (!result) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: "Role Not Assigned"
            });
        }
        //res.send(result);
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message:"Role Assigned Successfully",
            data: result
        })
    } catch (error) {
        console.error(error?.message || error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status:httpStatus.INTERNAL_SERVER_ERROR,
            message:"Server Error"
        })
    }
}
module.exports = {
    getPendingUsers,
    approveUser,
    declineUser,
    roleAssign
};
