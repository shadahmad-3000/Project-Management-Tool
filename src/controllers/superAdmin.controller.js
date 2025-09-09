const { SuperAdminService } = require("../services");
const { status: httpStatus } = require("http-status");

const usersAdd = async (req,res) => {
    try {
        const result = await SuperAdminService.addUsers(req.body);
        if(!result){
            return{
                status: httpStatus.NOT_FOUND,
                message:"Result Not Found"
            }
        };
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "User Added",
            data: result
        })
    } catch (error) {
        console.error(error?.message || error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message:"Server Error"
        })  
    }
};

const getPendingUsers = async (req, res) => {
    try {
        const result = await SuperAdminService.getPendingUsers();
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
        const result = await SuperAdminService.approveUser(id);

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
        const result = await SuperAdminService.declineUser(id);

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
        const result = await SuperAdminService.assignRole(req.body);
        if (!result) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: "Role Not Assigned"
            });
        }
        //res.send(result);
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Role Assigned Successfully",
            data: result
        })
    } catch (error) {
        console.error(error?.message || error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Server Error"
        })
    }
};

const projectCreate = async (req, res) => {
    try {

        const result = await SuperAdminService.createProject(req.body);

        if (!result) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "Project Not Found"
            }
        }
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Project Created",
            data: result
        })
    } catch (error) {
        console.error(error?.message || error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message:"Internal Server Error"
        })
    }
};

const projectUpdate = async (req, res) => {
    try {
        const result = await SuperAdminService.updateProject(req.body);
        if (!result) {
            return {
                status: httpStatus.BAD_REQUEST,
                message: "Result Not Found"
            }
        };
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Project Updated",
            data: result
        })
    } catch (error) {
        console.error(error?.message || error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message:"Internal Server Error"
        })
    }
};

module.exports = {
    usersAdd,
    getPendingUsers,
    approveUser,
    declineUser,
    roleAssign,
    projectCreate,
    projectUpdate
};
