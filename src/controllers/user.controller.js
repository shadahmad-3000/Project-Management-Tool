const { UserService } = require("../services")
const asyncHandler = require("../utils/async.handler");

const userDelete = asyncHandler(async (req, res) => {
    const result = await UserService.deleteUser(req.params);
    res.status(result?.status).json(result);
});

const userUpdate = asyncHandler(async (req, res) => {
    const result = await UserService.updateUser(req.params, req.body);
    res.status(result?.status).json(result);
});

const userGet = asyncHandler(async (req, res) => {
    const result = await UserService.getUsers();
    res.status(result?.status).json(result);
});

const getUserbyIdController = asyncHandler(async (req, res) => {
    const result = await UserService.getUsersbyId(req.params);
    res.status(result?.status).json(result);
});

module.exports = {
    userDelete,
    userUpdate,
    userGet,
    getUserbyIdController
}