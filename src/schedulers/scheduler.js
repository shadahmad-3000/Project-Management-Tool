const cron = require("node-cron");
const { TaskDeadlineService } = require("../services")

const reminder = () => {
    cron.schedule("*/1 * * * *", async () => {
        try {
            await TaskDeadlineService.checkDeadlines();
        } catch (error) {
            console.error("Error in reminder scheduler:", error.message);
        }
    });
};

module.exports = {
    reminder
};
