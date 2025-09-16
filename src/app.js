const express = require("express");
const app = express();
const otpRouter = require("./routes/otp.router");
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const superAdminRouter = require("./routes/superAdmin.route");
const teamRouter = require("./routes/team.route");
const documentRouter = require("./routes/document.route");
const cors = require("cors");
const { reminder } = require("./schedulers/scheduler");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.use("/otp", otpRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/sup-admin", superAdminRouter);
app.use("/team", teamRouter);
app.use("/document",documentRouter);

reminder();

module.exports = app;