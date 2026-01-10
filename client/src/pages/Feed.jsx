import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeed } from "../api/blogs";

function safeCommentCount(blog) {
    const arr =
        blog?.Comments ||
        blog?.comments ||
        blog?.Comment ||
        blog?.comment ||
        [];
    return Array.isArray(arr) ? arr.length : 0;
}

function formatDate(value) {
    if (!value) return "";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
}

export default function Feed() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        let alive = true;

        async function load() {
            setLoading(true);
            setError(null);

            try {
                const data = await getFeed(); // returns { blogs: [...] }
                if (!alive) return;
                setBlogs(Array.isArray(data?.blogs) ? data.blogs : []);
            } catch (e) {
                if (!alive) return;
                setError(e);
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        }

        load();
        return () => {
            alive = false;
        };
    }, []);

    // L
    if (loading) return <p>Loading…</p>;

    // E
    if (error) return <p>{error.message || "Failed to load feed"}</p>;

    // E (Empty)
    if (!blogs.length) return <p>No posts yet.</p>;

    // Success
    return (
        <div>
            <h2>Feed</h2>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {blogs.map((b) => {
                    const author = b?.User?.username || b?.User?.name || "Unknown";
                    const created = formatDate(b?.createdAt);
                    const commentCount = safeCommentCount(b);

                    return (
                        <li
                            key={b.id}
                            style={{
                                padding: 12,
                                border: "1px solid #ddd",
                                borderRadius: 8,
                                marginBottom: 12,
                            }}
                        >
                            <h3 style={{ margin: "0 0 6px 0" }}>
                                <Link to={`/blogs/${b.id}`}>{b.title || "(Untitled)"}</Link>
                            </h3>

                            <div style={{ opacity: 0.8, fontSize: 14 }}>
                                <span>By {author}</span>
                                {created ? <span> • {created}</span> : null}
                                <span> • {commentCount} comments</span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
