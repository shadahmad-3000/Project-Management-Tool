const authService = require("../services/auth.service");
const { status: httpStatus } = require("http-status");

const signup = async (req, res) => {
    try {
        const result = await authService.signUp(req.body);
        if (!result) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "Result not Found"
            }
        };
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "SignUp Successful",
            data: result
        })
    } catch (error) {
        console.error(error?.message, "Error");
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Internal Server Error"
        })
    }
};

const signIn = async (req, res) => {
    try {
        const result = await authService.signin(req.body);
        if (!result) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "Result not Found"
            }
        };
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Sign In Successful",
            data: result
        })
    } catch (error) {
        console.error(error?.message, "Error");
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Internal Server Error"
        })
    }
};

const LogOut = async (req, res) => {
    try {
        const result = await authService.logout(req.body);
        if (!result) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "Result not Found"
            }
        };
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Log Out",
            data: result
        })
    } catch (error) {
        console.error(error?.message, "Error here !!!!");
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Internal Server Error"
        })
    }
};

module.exports = {
    signup,
    signIn,
    LogOut
}