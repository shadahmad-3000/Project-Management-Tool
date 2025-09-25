const { TaskDeadlineService } = require("../services");
const asyncHandler = require("../utils/async.handler");

const TaskDeadlineController = asyncHandler(async (req, res) => {
    const result = await TaskDeadlineService.checkDeadlines();
    res.status(result?.message).json(result);
});

module.exports = { TaskDeadlineController }