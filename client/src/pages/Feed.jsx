import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeed } from "../api/blogs";

import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import FormError from "../components/ui/FormError";
import EmptyState from "../components/ui/EmptyState";

export default function Feed() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  if (loading) {
    return (
      <div className="py-6">
        <Spinner label="Loading posts…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <FormError error={error} fallback="Failed to load posts." />
        <Button variant="secondary" size="sm" onClick={load}>
          Retry
        </Button>
      </div>
    );
  }

  if (!blogs.length) {
    return (
      <EmptyState title="No posts yet.">
        Check back soon, or create the first post from Dashboard.
      </EmptyState>
    );
  }

  return (
    <div className="space-y-3">
      {blogs.map((b) => (
        <Link key={b.id} to={`/blogs/${b.id}`} className="block">
          <Card className="p-4 transition hover:bg-slate-50">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">
                {b.title}
              </h3>

              <div className="text-sm text-slate-600">
                {b.user?.username ? (
                  <span>
                    by{" "}
                    <span className="font-medium text-slate-900">
                      {b.user.username}
                    </span>
                  </span>
                ) : (
                  <span>by Unknown</span>
                )}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
