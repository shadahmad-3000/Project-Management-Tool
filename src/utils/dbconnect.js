const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const url = process.env.MONGO_URL;
const dbConnect = async () => {
    try {
        await mongoose.connect(url);
        console.log("DataBase Connected Successfully");
    } catch (error) {
        console.error("Error in Connecting Database");
    }
}

module.exports = {
    dbConnect
}


