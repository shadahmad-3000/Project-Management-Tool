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
        console.log("Team Created", team);
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

const getTeam = async () => {
    try {
        const allTeams = await Team.find();
        if (!allTeams) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "Teams Not Found"
            }
        };
        return {
            status: httpStatus.OK,
            message: "All Team Fetch Successfully",
            data: allTeams
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.BAD_REQUEST,
            message: "Failed to fetch teams"
        }
    }
};

const getTeambyId = async (param) => {
    try {
        const { id } = param
        const allTeams = await Team.findById(id);
        if (!allTeams) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "Team Not Found"
            }
        };
        return {
            status: httpStatus.OK,
            message: "Team Fetch Successfully",
            data: allTeams
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.BAD_REQUEST,
            message: "Failed to fetch team"
        }
    }
};

module.exports = {
    createTeam,
    updateTeam,
    getTeam,
    getTeambyId
}