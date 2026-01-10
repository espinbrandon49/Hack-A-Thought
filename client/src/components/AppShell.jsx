import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { logout } from "../api/auth";

import Button from "./ui/Button";
import Card from "./ui/Card";
import FormError from "./ui/FormError";
import Spinner from "./ui/Spinner";

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
    <div className="min-h-screen bg-slate-50">
      {/* Page container */}
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Top nav */}
        <nav className="mb-6 flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-semibold text-slate-900 hover:text-slate-700"
            >
              Hack-A-Thought
            </Link>

            <Link to="/" className="text-sm text-slate-700 hover:text-slate-900">
              Feed
            </Link>

            {user ? (
              <Link
                to="/dashboard"
                className="text-sm text-slate-700 hover:text-slate-900"
              >
                Dashboard
              </Link>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            {bootLoading ? (
              <Spinner label="Loading…" />
            ) : user ? (
              <>
                <span className="text-sm text-slate-600">
                  Signed in
                  {user.username ? (
                    <>
                      {" "}
                      as{" "}
                      <span className="font-medium text-slate-900">
                        {user.username}
                      </span>
                    </>
                  ) : null}
                </span>

                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
        
        {success ? (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {success}
          </div>
        ) : null}

        {/* Auth boot error (app-level) */}
        {bootError ? (
          <Card className="mb-6 p-4">
            <div className="space-y-3">
              <FormError
                error={bootError}
                fallback="Failed to load session."
              />
              <div>
                <Button variant="secondary" size="sm" onClick={refreshMe}>
                  Retry
                </Button>
              </div>
            </div>
          </Card>
        ) : null}

        {/* Page content */}
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
