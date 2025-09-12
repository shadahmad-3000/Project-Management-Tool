const { AuthService } = require("../services");
const asyncHandler = require("../utils/async.handler");

const signup = asyncHandler(async (req, res) => {
    const result = await AuthService.signUp(req.body);
    res.status(result?.status).json(result);
});

const signIn = asyncHandler(async (req, res) => {
    const result = await AuthService.signin(req.body);
    res.status(result?.status).json(result);
});

const LogOut = asyncHandler(async (req, res) => {
    const result = await AuthService.logout(req.body);
    res.status(result?.status).json(result);
});

module.exports = {
    signup,
    signIn,
    LogOut
}