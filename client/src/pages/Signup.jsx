import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import { useAuth } from "../auth/AuthProvider";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import FormError from "../components/ui/FormError";
import Spinner from "../components/ui/Spinner";

export default function Signup() {
    const navigate = useNavigate();
    const { refreshMe } = useAuth();

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await signup({ name, username, password });
            await refreshMe();
            navigate("/");
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="mx-auto max-w-md p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">Sign up</h2>

                <Input
                    name="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <Input
                    name="username"
                    placeholder="Username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <FormError error={error} />

                <div className="flex items-center gap-3">
                    <Button type="submit" disabled={loading}>
                        {loading ? <Spinner label="Creating account…" /> : "Create account"}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
