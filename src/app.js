const express = require("express");
const app = express();
const otpRouter = require("./routes/otp.router");
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const superAdminRouter = require("./routes/superAdmin.route");

app.use(express.json());
app.use("/otp", otpRouter);
app.use("/auth", authRouter);
app.use("/user",userRouter);
app.use("/sup-admin",superAdminRouter);

module.exports = app;