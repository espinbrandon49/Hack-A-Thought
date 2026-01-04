// client/src/api/comments.js
import { api } from "./client";

/**
 * Create comment (authed)
 * POST /comments
 * body: { comment, blog_id }
 * returns: { comment }
 */
export function create({ comment, blog_id }) {
    return api.post("/comments", { comment, blog_id });
}

/**
 * Delete comment (authed + owner)
 * DELETE /comments/:id
 * returns: { deleted: true }
 */
export function remove(id) {
    return api.del(`/comments/${id}`);
}
