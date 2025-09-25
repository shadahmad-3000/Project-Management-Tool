const { status: httpStatus } = require("http-status");
const { User } = require("../models");

const authorizeRoles = (roles) => {
    return async (req, res, next) => {
        console.log("Allowed roles: ", roles);
        console.log("User object", req.user);
        const user = await User.findOne({ _id: req?.user?.id });
        console.log("User:", user);
        console.log("user role: ", user?.role)
        if (!roles.includes(user?.role)) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Access Denied!"
            });
        }
        next();
    };
};

module.exports = {
    authorizeRoles
};