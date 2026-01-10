// src/pages/BlogDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { getDetail } from "../api/blogs";
import { create as createComment, remove as deleteComment } from "../api/comments";

import Card from "../components/ui/Card";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import FormError from "../components/ui/FormError";
import EmptyState from "../components/ui/EmptyState";

export default function BlogDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [success, setSuccess] = useState(null);

  const isOwner = useMemo(() => {
    if (!user?.id || !blog?.user_id) return false;
    return user.id === blog.user_id;
  }, [user?.id, blog?.user_id]);

  function flashSuccess(msg) {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 2500);
  }

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const data = await getDetail(id); // returns: { blog }
      setBlog(data?.blog || null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleAddComment(e) {
    e.preventDefault();
    setCommentError(null);

    const text = commentText.trim();
    if (!text) return;

    setPosting(true);
    try {
      await createComment({ comment: text, blog_id: Number(id) });
      setCommentText("");
      flashSuccess("Comment posted.");
      await load();
    } catch (err) {
      setCommentError(err);
    } finally {
      setPosting(false);
    }
  }

  async function handleDeleteComment(commentId) {
    setCommentError(null);
    setDeletingId(commentId);

    try {
      await deleteComment(commentId);
      flashSuccess("Comment deleted.");
      await load();
    } catch (err) {
      setCommentError(err);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="py-6">
        <Spinner label="Loading post…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <FormError error={error} fallback="Failed to load post." />
        <Link
          to="/"
          className="text-sm underline text-slate-700 hover:text-slate-900"
        >
          Back to Feed
        </Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="space-y-4">
        <EmptyState title="Post not found." />
        <Link
          to="/"
          className="text-sm underline text-slate-700 hover:text-slate-900"
        >
          Back to Feed
        </Link>
      </div>
    );
  }

  const comments = Array.isArray(blog?.comments) ? blog.comments : [];

  return (
    <div className="space-y-6">
      {success ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {success}
        </div>
      ) : null}

      <Card className="p-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">{blog.title}</h2>

          <div className="text-sm text-slate-600">
            {blog.user?.username ? (
              <span>
                by{" "}
                <span className="font-medium text-slate-900">
                  {blog.user.username}
                </span>
              </span>
            ) : (
              <span>by Unknown</span>
            )}
          </div>

          <div className="pt-3 text-sm text-slate-800 whitespace-pre-wrap">
            {blog.content}
          </div>

          {isOwner ? (
            <div className="pt-3">
              <Link
                to="/dashboard"
                className="text-sm underline text-slate-700 hover:text-slate-900"
              >
                Manage in Dashboard
              </Link>
            </div>
          ) : null}
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="text-base font-semibold text-slate-900">Comments</h3>

        {!user ? (
          <EmptyState title="Login to comment.">
            <Link to="/login" className="underline">
              Go to Login
            </Link>
          </EmptyState>
        ) : (
          <Card className="p-4">
            <form onSubmit={handleAddComment} className="space-y-3">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment…"
                rows={4}
                required
              />

              {commentError ? <FormError error={commentError} /> : null}

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={posting}>
                  {posting ? <Spinner label="Posting…" /> : "Post comment"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {!comments.length ? (
          <EmptyState title="No comments yet.">Be the first to add one.</EmptyState>
        ) : (
          <div className="space-y-3">
            {comments.map((c) => {
              const canDelete = user?.id && c.user_id === user.id;

              return (
                <Card key={c.id} className="p-4">
                  <div className="space-y-2">
                    <div className="text-sm text-slate-700 whitespace-pre-wrap">
                      {c.comment}
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                      <span>
                        {c.user?.username ? `@${c.user.username}` : "Unknown"}
                        {c.createdAt
                          ? ` · ${new Date(c.createdAt).toLocaleString()}`
                          : ""}
                      </span>

                      {canDelete ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(c.id)}
                          disabled={deletingId === c.id}
                        >
                          {deletingId === c.id ? "Deleting…" : "Delete"}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
