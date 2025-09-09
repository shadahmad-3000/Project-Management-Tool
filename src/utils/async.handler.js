const asyncHandler = (fn) => {
    return (req, res, next) => {
        try {
            Promise.resolve(fn(req, res, next)).catch((err) => {
                if (next) {
                    next(err);
                } else {
                    console.error(
                        `[AsyncHandler Error] ${req.method} ${req.originalUrl}:`,
                        err
                    );
                    res.status(500).json({
                        success: false,
                        message: err.message || "Internal Server Error",
                    });
                }
            });
        } catch (err) {
            if (next) {
                next(err);
            } else {
                console.error(
                    `[SyncHandler Error] ${req.method} ${req.originalUrl}:`,
                    err
                );
                res.status(500).json({
                    success: false,
                    message: err.message || "Internal Server Error",
                });
            }
        }
    };
};

module.exports = asyncHandler;
