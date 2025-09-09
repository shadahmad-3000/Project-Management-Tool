const { status: httpStatus } = require("http-status");

exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log("Allowed roles: ", allowedRoles);
        console.log("user role: ", req.user?.role)
        if (allowedRoles.includes(req.user?.role)) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Access Denied!"
            });
        }
        next();
    };
};