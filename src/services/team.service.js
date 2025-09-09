const { status: httpStatus } = require("http-status");
const { Team } = require("../models");

const createTeam = async (body) => {
    try {
        const { name, teamCode, teamMembers } = body;
    
        const team = await Team.create({
            name,
            teamCode,
            teamMembers
        });
        console.log("Team Created",team);
        if (!team) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "Team Not found"
            }
        }
        return {
            status: httpStatus.OK,
            message: "Team Created Succsessfully",
            data: team
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: error?.message || error
        }
    }
};

const updateTeam = async (body) => {
    try {
        const { teamCode, updateData } = body;
        const team = await Team.findOneAndUpdate(
            { teamCode: teamCode },
            { $set: updateData },
            { new: true }
        )
        return {
            status: httpStatus.OK,
            message: "Team Updated",
            data: team
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: error?.message || "Internal Server Error"
        }
    }
};

module.exports = {
    createTeam,
    updateTeam
}