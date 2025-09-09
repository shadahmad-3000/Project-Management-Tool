const { status: httpStatus } = require("http-status");
const { TeamService } = require("../services");
const asyncHandler = require("../utils/async.handler");

const teamCreate = asyncHandler(async (req,res) => {
    const result = await TeamService.createTeam(req.body);
    res.status(result?.status).json(result);
});

const teamUpdate = asyncHandler(async (req,res) => {
    const result = await TeamService.updateTeam(req.body);
    res.status(result?.status).json(result);
});

module.exports = { teamCreate,teamUpdate }