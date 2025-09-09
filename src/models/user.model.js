const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        password: {
            type: String,
            required: true
        },
        empID: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        designation: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true,
            index: true
        },
        department: {
            type: String,
            required: false
        },
        team: {
            type: String,
            required: false
        },
        role: {
            type: String,
            required: false,
            enum: ["User", "Admin", "Super-Admin", "Manager", "HR", "Team-Lead"],
            default: "User"
        },
        joiningDate: {
            type: Date,
            required: false
        },
        address: {
            type: String,
            required: false,
        },
        nearestMetroStation: {
            type: String,
            requrired: false
        },
        transportType: {
            type: String,
            required: false
        },
        token: {
            type: String,
            required: false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isApproved: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema, "users");

module.exports = { User };