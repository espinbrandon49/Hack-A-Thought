module.exports = function withAuth(req, res, next) {
    if (!req.session?.logged_in) {
        return res.status(401).json({
            ok: false,
            data: null,
            error: {
                message: "Unauthorized",
                code: "UNAUTHORIZED",
            },
        });
    }

    next();
};
