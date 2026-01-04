function success(res, data, status = 200) {
    return res.status(status).json({
        ok: true,
        data,
        error: null,
    });
}

function fail(res, status, message, code = "BAD_REQUEST") {
    return res.status(status).json({
        ok: false,
        data: null,
        error: {
            message,
            code,
        },
    });
}

module.exports = { success, fail };
