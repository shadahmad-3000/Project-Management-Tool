const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const { status: httpStatus } = require("http-status");

const JWT_SECRET = config?.JWT_SECRET;

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(httpStatus.NOT_FOUND).json({
            status: httpStatus.NOT_FOUND,
            message: "Access Denied, No Token Provided"
        })
    };

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Invalid Token"
            });
        }
        req.user = decoded;
        next();
    });
};


