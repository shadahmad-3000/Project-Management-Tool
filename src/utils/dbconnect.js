const mongoose = require("mongoose");
const config = require("../utils/config");

const url = config?.MONGO_URI;
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


