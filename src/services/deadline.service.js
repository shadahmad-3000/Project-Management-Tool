const { Task } = require("../models");
const moment = require("moment");
const { sendEmail } = require("../utils/mailer");

const checkDeadlines = async () => {
    try {
        const tasks = await Task.find({
            taskStatus: { $ne: "Completed" } 
        });

        if (!tasks.length) return;

        const now = moment();

        for (let task of tasks) {
            const { startDate, endDate } = task.taskDeadline;
            if (!startDate || !endDate) continue;

            const start = moment(startDate);
            const end = moment(endDate);
            const halfTime = start.clone().add(end.diff(start) / 2, "milliseconds");

            if (now.isAfter(halfTime) && !task.halfTimeNotified) {
                await sendEmail(
                    task.assigneeEmail,
                    "Task Reminder",
                    `Reminder: Task "${task.taskName}" has reached half of its allotted time.`
                );

                task.halfTimeNotified = true; 
                await task.save();

                console.log(`Half-time reminder sent for task: ${task.taskName}`);
            }

            if (now.isAfter(end) && !task.deadlineMissedNotified) {
                await sendEmail(
                    task.assigneeEmail,
                    "Task Deadline Missed",
                    `Alert: Task "${task.taskName}" has missed its deadline!`
                );

                task.deadlineMissedNotified = true;
                await task.save();

                console.log(`Deadline missed alert sent for task: ${task.taskName}`);
            }
        }
    } catch (error) {
        console.error("Error in checkDeadlines service:", error.message);
    }
};
module.exports = {
    checkDeadlines
}