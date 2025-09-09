const { SuperAdminService } = require("../services");
const { status: httpStatus } = require("http-status");
const asyncHandler = require("../utils/async.handler");

const usersAdd = asyncHandler(async (req,res) => {
    const result = await SuperAdminService.addUsers(req.body);
    res.status(result?.status).json(result);
});

const getPendingUsers = asyncHandler(async (req,res) => {
    const result = await SuperAdminService.getPendingUsers();
    res.status(result?.status).json(result);
});

const approveUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await SuperAdminService.approveUser(id);
    res.status(result?.status).json(result);

});

const declineUser = asyncHandler(async (req,res) => {
    const {id} = req.params;
    const result = await SuperAdminService.declineUser(id);
    res.status(result?.status).json(result);
});

const roleAssign = asyncHandler(async (req, res) => {
    const result = await SuperAdminService.roleAssign(req.body);
    res.status(result?.status).json(result);
});

const projectCreate = asyncHandler(async (req,res) => {
    const result = await SuperAdminService.createProject(req.body);
    res.status(result?.status).json(result);
});

const projectUpdate = asyncHandler(async (req,res) => {
    const result = await SuperAdminService.updateProject(req.body);
    res.status(result?.status).json(result);
})

module.exports = {
    usersAdd,
    getPendingUsers,
    approveUser,
    declineUser,
    roleAssign,
    projectCreate,
    projectUpdate
};
