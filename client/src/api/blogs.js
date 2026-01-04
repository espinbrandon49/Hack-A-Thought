import { api } from "./client";

/**
 * Feed (public)
 * GET /blogs
 * returns: { blogs: [...] }
 */
export function getFeed() {
    return api.get("/blogs");
}

/**
 * Blog detail (public)
 * GET /blogs/:id
 * returns: { blog }
 */
export function getDetail(id) {
    return api.get(`/blogs/${id}`);
}

/**
 * Create blog (authed)
 * POST /blogs
 * body: { title, content }
 * returns: { blog }
 */
export function create({ title, content }) {
    return api.post("/blogs", { title, content });
}

/**
 * Update blog (authed + owner)
 * PUT /blogs/:id
 * body: { title, content }
 * returns: { updated: true }
 */
export function update(id, { title, content }) {
    return api.put(`/blogs/${id}`, { title, content });
}

/**
 * Delete blog (authed + owner)
 * DELETE /blogs/:id
 * returns: { deleted: true }
 */
export function remove(id) {
    return api.del(`/blogs/${id}`);
}
