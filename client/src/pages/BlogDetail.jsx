import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDetail } from "../api/blogs";
import { create as createComment, remove as removeComment } from "../api/comments";
import { useAuth } from "../auth/AuthProvider";

export default function BlogDetail() {
    const { id } = useParams();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [blog, setBlog] = useState(null);

    const [commentText, setCommentText] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentError, setCommentError] = useState(null);
    const [success, setSuccess] = useState(null);

    async function load() {
        setLoading(true);
        setError(null);

        try {
            const data = await getDetail(id); // returns { blog }
            setBlog(data?.blog ?? null);
        } catch (e) {
            setError(e);
            setBlog(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const comments = blog?.Comments || blog?.comments || [];
    const author = blog?.User?.username || blog?.User?.name || "Unknown";
    const createdAt = blog?.createdAt ? new Date(blog.createdAt).toLocaleString() : "";

    async function handleAddComment(e) {
        e.preventDefault();
        setCommentError(null);

        const text = commentText.trim();
        if (!text) return;

        try {
            setCommentLoading(true);
            await createComment({ comment: text, blog_id: Number(id) });
            setCommentText("");
            flashSuccess("Comment added.");
            await load(); // simple + reliable refresh
        } catch (e2) {
            setCommentError(e2);
        } finally {
            setCommentLoading(false);
        }
    }

    function flashSuccess(msg) {
        setSuccess(msg);
        setTimeout(() => setSuccess(null), 2500);
    }

    async function handleDeleteComment(commentId) {
        setCommentError(null);
        try {
            setCommentLoading(true);
            await removeComment(commentId);
            flashSuccess("Comment deleted.");
            await load();
        } catch (e2) {
            setCommentError(e2);
        } finally {
            setCommentLoading(false);
        }
    }

    // L
    if (loading) return <p>Loading…</p>;

    // E
    if (error) return <p>{error.message || "Failed to load blog"}</p>;

    // E (Empty / Not found)
    if (!blog) return <p>Blog not found.</p>;

    return (
        <div>
            <p>
                <Link to="/">← Back to Feed</Link>
            </p>

            <h2 style={{ marginBottom: 6 }}>{blog.title || "(Untitled)"}</h2>
            <div style={{ opacity: 0.8, marginBottom: 12 }}>
                <span>By {author}</span>
                {createdAt ? <span> • {createdAt}</span> : null}
            </div>

            <div
                style={{
                    padding: 12,
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    marginBottom: 16,
                    whiteSpace: "pre-wrap",
                }}
            >
                {blog.content || ""}
            </div>

            <h3 style={{ marginTop: 0 }}>Comments</h3>

            {/* Add comment (authed) */}
            {user ? (
                <form onSubmit={handleAddComment} style={{ marginBottom: 16 }}>
                    <textarea
                        rows={3}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment…"
                        style={{ width: "100%", padding: 8 }}
                        disabled={commentLoading}
                    />
                    <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                        <button type="submit" disabled={commentLoading || !commentText.trim()}>
                            {commentLoading ? "Posting…" : "Post Comment"}
                        </button>
                        {commentError ? (
                            <span style={{ color: "crimson" }}>
                                {commentError.message || "Comment action failed"}
                            </span>
                        ) : null}
                    </div>
                </form>
            ) : (
                <p style={{ opacity: 0.8 }}>
                    <Link to="/login">Log in</Link> to add a comment.
                </p>
            )}

            {/* Comments list (L/E/E within the section) */}
            {Array.isArray(comments) && comments.length === 0 ? (
                <p>No comments yet.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {comments.map((c) => {
                        const cAuthor = c?.User?.username || c?.User?.name || "Unknown";
                        const cCreated = c?.createdAt ? new Date(c.createdAt).toLocaleString() : "";
                        const isOwner = user && Number(c?.user_id) === Number(user?.id);

                        return (
                            <li
                                key={c.id}
                                style={{
                                    padding: 12,
                                    border: "1px solid #ddd",
                                    borderRadius: 8,
                                    marginBottom: 12,
                                }}
                            >
                                <div style={{ whiteSpace: "pre-wrap" }}>{c.comment}</div>
                                <div style={{ opacity: 0.8, fontSize: 14, marginTop: 6 }}>
                                    <span>By {cAuthor}</span>
                                    {cCreated ? <span> • {cCreated}</span> : null}
                                </div>

                                {isOwner ? (
                                    <div style={{ marginTop: 8 }}>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteComment(c.id)}
                                            disabled={commentLoading}
                                        >
                                            {commentLoading ? "Working…" : "Delete"}
                                        </button>
                                    </div>
                                ) : null}
                            </li>
                        );
                    })}
                </ul>
            )}
            {success ? <p style={{ color: "green" }}>{success}</p> : null}
        </div>
    );
}
