const nodemailer = require("nodemailer");

const mailer = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: "mohdshadahmad786@gmail.com",
        pass: "getwaehpcjgknubu",
    },
})
module.exports = mailer