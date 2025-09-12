const mongoose = require("mongoose");
const moment = require("moment");

const taskSchema = new mongoose.Schema(
    {
        taskName: {
            type: String,
            required: true,
        },
        taskId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        description: {
            type: String,
            required: true
        },
        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        assignedTo: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Team",
                required: true,
                index: true
            }
        ],
        assigneeEmail: [
            {
                type: String,
                required: true
            }
        ],
        taskStatus: {
            type: String,
            required: true,
            enum: ["Not Started", "Pending", "In Progress", "Completed", "On Hold"],
            default: "Not-Started"
        },
        taskduration: {
            type: String,
            required: true,
        },
        taskDeadline: {
            startDate: {
                type: Date,
                get: (v) => moment(v).format("YYYY_MM_DD HH:mm"),
                set: (v) => moment(v, "YYYY-MM-DD HH:mm").toDate()
            },
            endDate: {
                type: Date,
                get: (v) => moment(v).format("YYYY-MM-DD"),
                set: (v) => (v, "YYYY-MM-DD HH:mm").toDate()
            }
        },
        taskPriority: {
            type: String,
            required: true,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },

    },
    {
        timestamps: true
    },
);

const Task = mongoose.model("Task", taskSchema, "tasks");

module.exports = { Task };