const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { status: httpStatus} = require("http-status")
dotenv.config()

const mailer = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to,subject,text) => {
    try {
        let info = await mailer.sendMail({
            from: process.env.EMAIL_USER,
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