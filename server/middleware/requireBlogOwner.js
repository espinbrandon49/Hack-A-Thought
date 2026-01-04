const { Blog } = require('../models');
const { fail } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const requireBlogOwner = asyncHandler(async (req, res, next) => {
    const blogId = req.params.id;
    const sessionUserId = req.session?.user_id;

    // If somehow called without auth, treat as unauthorized
    if (!sessionUserId) {
        return fail(res, 401, 'Unauthorized', 'UNAUTHORIZED');
    }

    const blog = await Blog.findByPk(blogId, { attributes: ['id', 'user_id'] });

    if (!blog) {
        return fail(res, 404, 'Blog not found', 'NOT_FOUND');
    }

    if (blog.user_id !== sessionUserId) {
        return fail(res, 403, 'Forbidden: not the blog owner', 'FORBIDDEN');
    }

    // attach for downstream use (handy later)
    req.blog = blog;

    return next();
});

module.exports = requireBlogOwner;
