import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function ProtectedRoute({ children }) {
    const { isAuthed, bootLoading, bootError } = useAuth();
    const location = useLocation();

    // Loading state (L)
    if (bootLoading) return <div>Loading…</div>;

    // Error state (E) - if auth boot actually failed
    if (bootError) {
        return (
            <div>
                <strong>Error:</strong> {bootError.message || "Auth boot failed"}
            </div>
        );
    }

    // Not authed => redirect
    if (!isAuthed) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return children;
}
