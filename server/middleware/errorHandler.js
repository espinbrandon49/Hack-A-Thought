// server/middleware/errorHandler.js

function notFound(req, res, next) {
    res.status(404).json({
        ok: false,
        data: null,
        error: {
            message: "Not Found",
            code: "NOT_FOUND",
        },
    });
}

function errorHandler(err, req, res, next) {
    console.error(err);

    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    const code = err.code || "SERVER_ERROR";

    res.status(status).json({
        ok: false,
        data: null,
        error: {
            message,
            code,
        },
    });
}

module.exports = { notFound, errorHandler };
