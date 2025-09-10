const authService = require("../services/auth.service");
const asyncHandler = require("../utils/async.handler");

const signup = asyncHandler(async (req, res) => {
    const result = await authService.signUp(req.body);
    res.status(result?.status).json(result);
});

const signIn = asyncHandler(async (req,res) => {
    const result = await authService.signin(req.body);
    res.status(result?.status).json(result);
});

const LogOut = asyncHandler(async (req,res) => {
    const result = await authService.logout(req.body);
    res.status(result?.status).json(result);
});

module.exports = {
    signup,
    signIn,
    LogOut
}