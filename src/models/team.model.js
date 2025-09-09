const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        teamCode: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        teamMembers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            }
        ]
    },
    {
        timestamps: true
    }
);

const Team = mongoose.model("Team", teamSchema, "teams");

module.exports = { Team };
