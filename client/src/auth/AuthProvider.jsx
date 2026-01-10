import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { me } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // L/E/E for bootstrapping session
    const [bootLoading, setBootLoading] = useState(true);
    const [bootError, setBootError] = useState(null);

    const refreshMe = async () => {
        setBootLoading(true);
        setBootError(null);

        try {
            const res = await me(); // expected to return { user } (from data)
            setUser(res?.user ?? null);
        } catch (err) {
            // 401 = not logged in (normal state)
            if (err.status === 401) {
                setUser(null);
            } else {
                setBootError(err);
            }
        } finally {
            setBootLoading(false);
        }
    };

    useEffect(() => {
        refreshMe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = useMemo(
        () => ({
            user,
            setUser,
            bootLoading,
            bootError,
            refreshMe,
            isAuthed: !!user,
        }),
        [user, bootLoading, bootError]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}
