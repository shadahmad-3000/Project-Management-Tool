const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        projectCode: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        description: {
            type: String,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["Not Started", "Pending", "In Progress", "Completed", "On Hold"],
            default: "Not Started",
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        assignedTo: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Team",
                index: true,
            }
        ],
    },
    {
        timestamps: true
    }
);

const Project = mongoose.model("Project", projectSchema, "projects");

module.exports = { Project };