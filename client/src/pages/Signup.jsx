import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import { useAuth } from "../auth/AuthProvider";

export default function Signup() {
    const navigate = useNavigate();
    const { refreshMe } = useAuth();

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        try {
            setSubmitting(true);
            await signup({
                name: name.trim(),
                username: username.trim(),
                password,
            });
            await refreshMe();
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div>
            <h2>Signup</h2>

            <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
                <div style={{ marginBottom: 10 }}>
                    <label>
                        Name
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={submitting}
                            style={{ display: "block", width: "100%", padding: 8 }}
                            autoComplete="name"
                        />
                    </label>
                </div>

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
                            autoComplete="new-password"
                        />
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={
                        submitting || !name.trim() || !username.trim() || !password
                    }
                >
                    {submitting ? "Creating…" : "Create account"}
                </button>

                {error ? (
                    <p style={{ marginTop: 10 }}>
                        {error.message || "Signup failed"}
                    </p>
                ) : null}
            </form>

            <p style={{ marginTop: 12 }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}
