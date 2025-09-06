const userService = require("../services/user.service");
const {status:httpStatus }= require("http-status")

const userDelete = async (req, res) => {
    try {
        const result = await userService.deleteUser(req.params);
        if (!result) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: "User not found"
            });
        }

        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "User deleted successfully",
            data: result
        });
    } catch (error) {
        console.error(error?.message || error);

        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Internal Server Error"
        });
    }
};

const userUpdate = async (req, res) => {
    try {
        const result = await userService.updateUser(req.params, req.body);
        res.send(result);
    } catch (error) {
        console.error(error?.message || error);
    }
}
const userGet = async (req,res) => {
    try {
        const result = await userService.getUsers();
        return res.status(httpStatus.OK).json({
            status:httpStatus.OK,
            message: "Users fetch Successfully",
            data: result
        })
    } catch (error) {
        console.error(error?.message|| error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message:"Server Error"
        })
    }
}
module.exports = {
    userDelete,
    userUpdate,
    userGet
}