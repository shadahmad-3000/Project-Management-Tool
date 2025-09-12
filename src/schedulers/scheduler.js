const cron = require("node-cron");

const reminder = () => {
    cron.schedule("2 * * * *",()=>{
        console.log("==============inside reminder schedular==============");
    });
};

module.exports = {
    reminder
}

