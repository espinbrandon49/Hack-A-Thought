import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { logout } from "../api/auth";

export default function AppShell({ children }) {
    const { user, bootLoading, bootError, refreshMe, setUser } = useAuth();
    const [success, setSuccess] = useState(null);

    function flashSuccess(msg) {
        setSuccess(msg);
        setTimeout(() => setSuccess(null), 2500);
    }

    async function handleLogout() {
        try {
            await logout();
        } catch {
            // Even if logout fails, we still clear client auth state
        } finally {
            setUser(null);
            flashSuccess("Logged out.");
        }
    }

    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
            <nav
                style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: "1px solid #ddd",
                    marginBottom: 16,
                }}
            >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Link to="/">Feed</Link>
                    {user ? <Link to="/dashboard">Dashboard</Link> : null}
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {bootLoading ? (
                        <span>Loading…</span>
                    ) : user ? (
                        <>
                            <span style={{ opacity: 0.8 }}>
                                Signed in{user.username ? ` as ${user.username}` : ""}
                            </span>
                            <button type="button" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Signup</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Auth boot error (L/E/E at app level) */}
            {bootError ? (
                <div style={{ padding: 12, border: "1px solid #f5c2c7" }}>
                    <strong>Error:</strong> {bootError.message || "Failed to load session"}
                    <div style={{ marginTop: 8 }}>
                        <button type="button" onClick={refreshMe}>
                            Retry
                        </button>
                    </div>
                </div>
            ) : null}

            <main>{children}</main>
            
        </div>
    );
}
