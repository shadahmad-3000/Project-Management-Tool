const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        taskName: {
            type: String,
            required: true,
        },
        taskId:{
            type:String,
            required:true,
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
        taskStatus: {
            type: String,
            required: true,
            enum: ["Not Started", "Pending", "In Progress", "Completed", "On Hold"],
            default: "Not-Started"
        },
        taskduration: {
            type: Number,
            required: true,
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