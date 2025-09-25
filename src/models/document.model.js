const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
    {
        fileName: String,
        content: String,
    },
    {
        timestamps: true
    }
);

const Document = mongoose.model("Document", documentSchema, "documents");

module.exports = { Document };