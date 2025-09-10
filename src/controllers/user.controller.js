const userService = require("../services/user.service");
const asyncHandler = require("../utils/async.handler");

const userDelete = asyncHandler(async (req, res) => {
    const result = await userService.deleteUser(req.params);
    res.status(result?.status).json(result);
});

const userUpdate = asyncHandler(async (req, res) => {
    const result = await userService.updateUser(req.params, req.body);
    res.status(result?.status).json(result);
});

const userGet = asyncHandler(async (req,res) => {
    const result = await userService.getUsers();
    res.status(result?.status).json(result);
});

module.exports = {
    userDelete,
    userUpdate,
    userGet
}