const { status: httpStatus } = require("http-status");
const { TeamService } = require("../services");

const teamCreate = async (req, res) => {
    try {
        const result = await TeamService.createTeam(req.body);
        if (!result) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "Result not Found"
            }
        };
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Team Created",
            data: result
        })
    } catch (error) {
        console.error(error?.message || error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message:"Internal Server Error"
        })
    }
};

const teamUpdate = async (req,res) => {
    try {
        const result = await TeamService.updateTeam(req.body);
        if(!result){
            return{
                status: httpStatus.NOT_FOUND,
                message:"Result Not Found"
            }
        };
        res.status(httpStatus.OK).json({
            status:httpStatus.OK,
            message: "Team Updated",
            data: result
        });
    } catch (error) {
        console.error(error?.message || error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message:"Internal Server Error"
        })
    }
};

module.exports = { teamCreate,teamUpdate }