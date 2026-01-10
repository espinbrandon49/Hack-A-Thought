import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { create, getFeed, remove, update } from "../api/blogs";
import { useAuth } from "../auth/AuthProvider";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import FormError from "../components/ui/FormError";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";

export default function Dashboard() {
    const { user } = useAuth();

    const [blogs, setBlogs] = useState([]);

    // editor state
    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // ui state
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const myBlogs = useMemo(() => {
        const uid = user?.id;
        if (!uid) return [];
        return (blogs || []).filter((b) => b.user_id === uid);
    }, [blogs, user?.id]);

    function flashSuccess(msg) {
        setSuccess(msg);
        setTimeout(() => setSuccess(null), 2500);
    }

    function resetEditor() {
        setEditingId(null);
        setTitle("");
        setContent("");
    }

    function startEdit(blog) {
        setEditingId(blog.id);
        setTitle(blog.title || "");
        setContent(blog.content || "");
    }

    async function load() {
        setError(null);
        setLoading(true);
        try {
            const data = await getFeed(); // returns: { blogs: [...] }
            setBlogs(Array.isArray(data?.blogs) ? data.blogs : []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            if (editingId) {
                await update(editingId, { title, content });
                flashSuccess("Post updated.");
            } else {
                await create({ title, content });
                flashSuccess("Post created.");
            }

            resetEditor();
            await load();
        } catch (err) {
            setError(err);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        setError(null);
        setDeletingId(id);

        try {
            await remove(id);
            flashSuccess("Post deleted.");
            await load();
        } catch (err) {
            setError(err);
        } finally {
            setDeletingId(null);
        }
    }

    if (!user) {
        return (
            <EmptyState title="You must be logged in to access the dashboard.">
                <Link to="/login" className="underline">
                    Go to Login
                </Link>
            </EmptyState>
        );
    }

    if (loading) {
        return (
            <div className="py-6">
                <Spinner label="Loading dashboard…" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {success ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                    {success}
                </div>
            ) : null}

            {error ? <FormError error={error} /> : null}

            <Card className="p-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold text-slate-900">
                            {editingId ? "Edit post" : "Create a post"}
                        </h2>

                        {editingId ? (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={resetEditor}
                                disabled={saving}
                            >
                                Cancel
                            </Button>
                        ) : null}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Title
                            </label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Post title"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Content
                            </label>
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your post…"
                                rows={8}
                                required
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Button type="submit" disabled={saving}>
                                {saving ? (
                                    <Spinner label={editingId ? "Saving…" : "Creating…"} />
                                ) : editingId ? (
                                    "Save changes"
                                ) : (
                                    "Create post"
                                )}
                            </Button>

                            {editingId ? (
                                <Link
                                    to={`/blogs/${editingId}`}
                                    className="text-sm text-slate-700 hover:text-slate-900 underline"
                                >
                                    View post
                                </Link>
                            ) : null}
                        </div>
                    </form>
                </div>
            </Card>

            <div className="space-y-3">
                <h3 className="text-base font-semibold text-slate-900">Your posts</h3>

                {!myBlogs.length ? (
                    <EmptyState title="No posts yet.">
                        Create your first post using the editor above.
                    </EmptyState>
                ) : (
                    myBlogs.map((b) => (
                        <Card key={b.id} className="p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <Link
                                        to={`/blogs/${b.id}`}
                                        className="block truncate text-sm font-semibold text-slate-900 hover:underline"
                                    >
                                        {b.title}
                                    </Link>

                                    <div className="mt-1 text-sm text-slate-600 line-clamp-2">
                                        {b.content}
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => startEdit(b)}
                                        disabled={saving || deletingId === b.id}
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(b.id)}
                                        disabled={saving || deletingId === b.id}
                                    >
                                        {deletingId === b.id ? "Deleting…" : "Delete"}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
