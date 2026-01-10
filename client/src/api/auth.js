import { api } from "./client";

/**
 * Signup
 * POST /auth
 * body: { name, username, password }
 * returns: { user }
 */
export function signup({ name, username, password }) {
    return api.post("/users", { name, username, password });
}

/**
 * Login
 * POST /auth/login
 * body: { username, password }
 * returns: { user }
 */
export function login({ username, password }) {
    return api.post("/users/login", { username, password });
}

/**
 * Logout
 * POST /auth/logout
 * returns: { logged_out: true }
 */
export function logout() {
    return api.post("/users/logout", {});
}

/**
 * Me (session check)
 * GET /auth/me
 * returns: { user }
 */
export function me() {
    return api.get("/users/me");
}
