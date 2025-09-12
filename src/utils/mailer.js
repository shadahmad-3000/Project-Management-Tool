const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { status: httpStatus} = require("http-status")
dotenv.config()

const mailer = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "mohdshadahmad786@gmail.com",
        pass: "getwaehpcjgknubu",
    },
});

const sendEmail = async (to,subject,text) => {
    try {
        let info = await mailer.sendMail({
            from: "mohdshadahmad786@gmail.com",
            to,
            subject,
            text
        });
        console.log("Mail Send",info.response);
    } catch (error) {
        console.error(error?.message || error);
        return{
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message:"Error in sending Email"
        }
    }
};

module.exports = {
    mailer,
    sendEmail
}