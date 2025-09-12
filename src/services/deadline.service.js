const { Task } = require("../models");
const { sendEmail } = require("../utils/mailer");
const { status: httpStatus } = require("http-status");
const moment = require("moment");

const checkDeadline = async (id) => {
    try {
        const tasks = id ? [await Task.findById()] : await Task.find();
        if (id && !tasks[0]) {
            return {
                status: 404,
                message: "Task not found"
            };
        };
        const now = moment();
        let notifications = [];
        for (let task of tasks) {
            const start = moment(task.start);
            const end = moment(task.end);
            if (!start.isValid() || !end.isValid()) continue;

            const totalDuration = end.diff(start, "minutes");
            const halfDuration = totalDuration / 2;
            const timePassed = now.diff(start, "minutes");


            if (end.isBefore(now) && !task.deadlineMissedNotified) {
                await sendEmail(
                    task.assigneeEmail,
                    "DEADLINE MISSED!",
                    `Deadline for your task assigned by ${task.assignedBy} has already passed on ${end.format("YYYY-MM-DD HH:mm")}.`
                );

                task.deadlineMissedNotified = true;
                await task.save();

                notifications.push(`Deadline missed email sent to ${task.assignedTo}`);
                continue;
            };
            if (!task.halfTimeNotified && timePassed >= halfDuration && now.isBefore(end)) {
                await sendEmail(
                    task.assigneeEmail,
                    "Task halfway reminder",
                    `Hello, your task assigned by ${task.assignedBy} is halfway done. Deadline: ${end.format("YYYY-MM-DD HH:mm")}`
                );

                task.halfTimeNotified = true;
                await task.save();

                notifications.push(`Halfway reminder sent to ${task.assignee}`);
            };
        }
        return {
            status: httpStatus.OK,
            message:"Deadline Check Complete",
            notifications
        }
    } catch (error) {
        console.error(error?.message || error);
        return{
            status: httpStatus.BAD_GATEWAY,
            message: error?.message || "Faild to check Deadline"
        }
    }
};

module.exports = {
    checkDeadline
}