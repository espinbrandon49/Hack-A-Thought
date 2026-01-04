const { User } = require('../models');
const { success, fail } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

function stripPassword(userInstance) {
    if (!userInstance) return userInstance;
    const plain = userInstance.get ? userInstance.get({ plain: true }) : userInstance;
    if (plain && Object.prototype.hasOwnProperty.call(plain, 'password')) {
        delete plain.password;
    }
    return plain;
}

function destroySession(req) {
    return new Promise((resolve, reject) => {
        req.session.destroy((err) => (err ? reject(err) : resolve()));
    });
}

exports.signup = asyncHandler(async (req, res) => {
    const userData = await User.create(req.body);

    await new Promise((resolve) => {
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            resolve();
        });
    });

    return success(res, { user: stripPassword(userData) }, 200);
});

exports.login = asyncHandler(async (req, res) => {
    const userData = await User.findOne({ where: { username: req.body.username } });

    if (!userData) {
        return fail(res, 400, 'Incorrect username or password', 'INVALID_CREDENTIALS');
    }

    const validPassword = await userData.checkPassword(req.body.password);
    if (!validPassword) {
        return fail(res, 400, 'Incorrect username or password', 'INVALID_CREDENTIALS');
    }

    await new Promise((resolve) => {
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            resolve();
        });
    });

    return success(res, { user: stripPassword(userData) }, 200);
});

exports.logout = asyncHandler(async (req, res) => {
    if (!req.session?.logged_in) {
        return fail(res, 401, 'Not logged in', 'UNAUTHORIZED');
    }

    await destroySession(req);
    return success(res, { logged_out: true }, 200);
});

exports.me = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
    });

    if (!user) {
        return fail(res, 404, 'User not found', 'NOT_FOUND');
    }

    return success(res, { user });
});
