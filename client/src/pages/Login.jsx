import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../auth/AuthProvider";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { refreshMe } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        try {
            setSubmitting(true);
            await login({ username: username.trim(), password });
            await refreshMe(); // pulls /users/me and sets user
            const to = location.state?.from || "/dashboard";
            navigate(to, { replace: true });
        } catch (err) {
            setError(err);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
                <div style={{ marginBottom: 10 }}>
                    <label>
                        Username
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={submitting}
                            style={{ display: "block", width: "100%", padding: 8 }}
                            autoComplete="username"
                        />
                    </label>
                </div>

                <div style={{ marginBottom: 10 }}>
                    <label>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={submitting}
                            style={{ display: "block", width: "100%", padding: 8 }}
                            autoComplete="current-password"
                        />
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={submitting || !username.trim() || !password}
                >
                    {submitting ? "Logging in…" : "Login"}
                </button>

                {error ? (
                    <p style={{ marginTop: 10 }}>
                        {error.message || "Login failed"}
                    </p>
                ) : null}
            </form>

            <p style={{ marginTop: 12 }}>
                Need an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
}
