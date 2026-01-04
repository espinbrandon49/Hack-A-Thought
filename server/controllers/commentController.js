const { Comment } = require('../models');
const { success, fail } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.createComment = asyncHandler(async (req, res) => {
    const { comment, blog_id } = req.body;

    if (!comment || !blog_id) {
        return fail(res, 400, 'comment and blog_id are required', 'VALIDATION_ERROR');
    }

    const blogId = Number(blog_id);
    if (!Number.isInteger(blogId)) {
        return fail(res, 400, 'blog_id must be an integer', 'VALIDATION_ERROR');
    }

    const newComment = await Comment.create({
        comment,
        blog_id: blogId,
        user_id: req.session.user_id,
    });

    return success(res, { comment: newComment }, 200);
});

exports.deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
        return fail(res, 404, 'Comment not found', 'NOT_FOUND');
    }

    if (comment.user_id !== req.session.user_id) {
        return fail(res, 403, 'Not authorized to delete this comment', 'FORBIDDEN');
    }

    await comment.destroy();

    return success(res, { deleted: true }, 200);
});
