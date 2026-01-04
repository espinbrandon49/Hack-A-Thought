const { Blog, User, Comment } = require('../models');
const { success, fail } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getFeed = asyncHandler(async (req, res) => {
    const blogs = await Blog.findAll({
        include: [
            { model: User, attributes: ['id', 'username', 'name'] },
            { model: Comment, attributes: ['id'] },
        ],
        order: [['createdAt', 'DESC']],
    });

    return success(res, { blogs });
});

exports.getDetail = asyncHandler(async (req, res) => {
    const blog = await Blog.findByPk(req.params.id, {
        include: [
            { model: User, attributes: ['id', 'username', 'name'] },
            {
                model: Comment,
                attributes: ['id', 'comment', 'createdAt', 'user_id', 'blog_id'],
                include: [{ model: User, attributes: ['id', 'username', 'name'] }],
            },
        ],
    });

    if (!blog) {
        return fail(res, 404, 'Blog not found', 'NOT_FOUND');
    }

    return success(res, { blog });
});

exports.createBlog = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return fail(res, 400, 'title and content are required', 'VALIDATION_ERROR');
    }

    const newBlog = await Blog.create({
        title,
        content,
        user_id: req.session.user_id,
    });

    return success(res, { blog: newBlog }, 200);
});

exports.updateBlog = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    const [updatedCount] = await Blog.update(
        { title, content },
        { where: { id: req.params.id, user_id: req.session.user_id } }
    );

    if (!updatedCount) {
        return fail(res, 404, 'Blog not found or not owned', 'NOT_FOUND');
    }

    return success(res, { updated: true });
});

exports.deleteBlog = asyncHandler(async (req, res) => {
    const deletedCount = await Blog.destroy({
        where: { id: req.params.id, user_id: req.session.user_id },
    });

    if (!deletedCount) {
        return fail(res, 404, 'Blog not found or not owned', 'NOT_FOUND');
    }

    return success(res, { deleted: true });
});
