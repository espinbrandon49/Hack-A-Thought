// client/src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { getFeed, create, update, remove } from "../api/blogs";

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [blogs, setBlogs] = useState([]);

    // create/edit form state
    const [mode, setMode] = useState("create"); // "create" | "edit"
    const [editingId, setEditingId] = useState(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const [success, setSuccess] = useState(null);

    const myBlogs = useMemo(() => {
        const uid = Number(user?.id);
        return blogs.filter((b) => Number(b?.user_id) === uid);
    }, [blogs, user]);

    function flashSuccess(msg) {
        setSuccess(msg);
        setTimeout(() => setSuccess(null), 2500);
    }

    async function load() {
        setLoading(true);
        setError(null);

        try {
            const data = await getFeed(); // { blogs }
            setBlogs(Array.isArray(data?.blogs) ? data.blogs : []);
        } catch (e) {
            setError(e);
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function resetForm() {
        setMode("create");
        setEditingId(null);
        setTitle("");
        setContent("");
        setSubmitError(null);
    }

    function startEdit(blog) {
        setMode("edit");
        setEditingId(blog.id);
        setTitle(blog.title || "");
        setContent(blog.content || "");
        setSubmitError(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitError(null);

        const t = title.trim();
        const c = content.trim();
        if (!t || !c) return;

        try {
            setSubmitting(true);

            if (mode === "create") {
                await create({ title: t, content: c });
                flashSuccess("Post created.");
            } else {
                await update(editingId, { title: t, content: c });
                flashSuccess("Post updated.");
            }
            resetForm();
            await load();
        } catch (e2) {
            setSubmitError(e2);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id) {
        const ok = window.confirm("Delete this post?");
        if (!ok) return;

        setSubmitError(null);

        try {
            setSubmitting(true);
            await remove(id);
            flashSuccess("Post deleted.");
            await load();
        } catch (e2) {
            setSubmitError(e2);
        } finally {
            setSubmitting(false);
        }
    }

    // L/E/E at page level
    if (loading) return <p>Loading…</p>;
    if (error) return <p>{error.message || "Failed to load dashboard"}</p>;

    return (
        <div>
            <h2>Dashboard</h2>

            {/* Create/Edit */}
            <div
                style={{
                    padding: 12,
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    marginBottom: 16,
                }}
            >
                <h3 style={{ marginTop: 0 }}>
                    {mode === "create" ? "Create Post" : "Edit Post"}
                </h3>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 10 }}>
                        <label>
                            Title
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={submitting}
                                style={{ display: "block", width: "100%", padding: 8 }}
                            />
                        </label>
                    </div>

                    <div style={{ marginBottom: 10 }}>
                        <label>
                            Content
                            <textarea
                                rows={6}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                disabled={submitting}
                                style={{ display: "block", width: "100%", padding: 8 }}
                            />
                        </label>
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <button
                            type="submit"
                            disabled={submitting || !title.trim() || !content.trim()}
                        >
                            {submitting
                                ? mode === "create"
                                    ? "Creating…"
                                    : "Saving…"
                                : mode === "create"
                                    ? "Create"
                                    : "Save"}
                        </button>

                        {mode === "edit" ? (
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                        ) : null}
                    </div>

                    {submitError ? (
                        <p style={{ marginTop: 10 }}>
                            {submitError.message || "Action failed"}
                        </p>
                    ) : null}
                </form>
            </div>

            {/* My Blogs list */}
            <h3 style={{ marginTop: 0 }}>Your Posts</h3>

            {myBlogs.length === 0 ? (
                <p>You haven’t posted yet.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {myBlogs.map((b) => (
                        <li
                            key={b.id}
                            style={{
                                padding: 12,
                                border: "1px solid #ddd",
                                borderRadius: 8,
                                marginBottom: 12,
                            }}
                        >
                            <h4 style={{ margin: "0 0 6px 0" }}>{b.title || "(Untitled)"}</h4>

                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <button type="button" onClick={() => navigate(`/blogs/${b.id}`)}>
                                    View
                                </button>
                                <button type="button" onClick={() => startEdit(b)} disabled={submitting}>
                                    Edit
                                </button>
                                <button type="button" onClick={() => handleDelete(b.id)} disabled={submitting}>
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {success ? <p style={{ color: "green" }}>{success}</p> : null}
        </div>
    );
}
