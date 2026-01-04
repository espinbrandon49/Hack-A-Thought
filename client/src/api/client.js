// Single HTTP transport layer for the entire React app.
// Rule: NO axios/fetch anywhere outside src/api/client.js.

import axios from "axios";
/**
 * App-level API error that screens can catch and render consistently.
 */
export class ApiError extends Error {
    /**
     * @param {string} message
     * @param {{ status?: number, code?: string, details?: any }} [opts]
     */
    constructor(message, opts = {}) {
        super(message);
        this.name = "ApiError";
        this.status = opts.status ?? 0;
        this.code = opts.code ?? "UNKNOWN";
        this.details = opts.details ?? null;
    }
}

function getBaseUrl() {
    const raw = import.meta?.env?.VITE_API_BASE_URL;

    if (!raw) {
        throw new Error(
            "VITE_API_BASE_URL is not defined. Did you forget to create client/.env?"
        );
    }

    return String(raw).replace(/\/+$/, "");
}


export const http = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true, // cookie-session auth
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

/**
 * Normalize our backend response contract:
 * success: { ok:true, data, error:null } -> return data
 * fail:    { ok:false, data:null, error:{message, code} } -> throw ApiError
 */
function unwrapResponse(res) {
    const payload = res?.data;

    // Expected contract from our server:
    if (payload && typeof payload === "object" && "ok" in payload) {
        if (payload.ok) return payload.data;

        const message = payload?.error?.message || "Request failed";
        const code = payload?.error?.code || "BAD_REQUEST";
        throw new ApiError(message, {
            status: res?.status ?? 0,
            code,
            details: payload,
        });
    }

    // Fallback: unexpected response shape
    return payload;
}

/**
 * Normalize axios errors into ApiError.
 */
function toApiError(err) {
    // axios error with response
    const res = err?.response;
    if (res) {
        try {
            // Try to use the same contract unwrapping if present
            unwrapResponse(res);
            // If unwrapResponse didn't throw but we are here, treat as error anyway
            return new ApiError(res.statusText || "Request failed", {
                status: res.status,
                code: "HTTP_ERROR",
                details: res.data,
            });
        } catch (e) {
            if (e instanceof ApiError) return e;
            return new ApiError("Request failed", {
                status: res.status,
                code: "HTTP_ERROR",
                details: res.data,
            });
        }
    }

    // network / timeout / CORS / server down
    if (err?.code === "ECONNABORTED") {
        return new ApiError("Request timed out", { status: 0, code: "TIMEOUT", details: err?.message });
    }

    return new ApiError("Network error (failed to reach server)", {
        status: 0,
        code: "NETWORK_ERROR",
        details: err?.message || err,
    });
}

/**
 * Core request helper. Use this from auth.js / blogs.js / comments.js only.
 *
 * @param {string} method - GET/POST/PUT/DELETE
 * @param {string} url - e.g. "/auth/login"
 * @param {any} [data] - request body
 * @param {import("axios").AxiosRequestConfig} [config] - axios config overrides
 */
export async function request(method, url, data, config = {}) {
    try {
        const res = await http.request({
            method,
            url,
            data,
            ...config,
        });
        return unwrapResponse(res);
    } catch (err) {
        throw toApiError(err);
    }
}

// Convenience helpers
export const api = {
    get: (url, config) => request("GET", url, undefined, config),
    post: (url, data, config) => request("POST", url, data, config),
    put: (url, data, config) => request("PUT", url, data, config),
    del: (url, config) => request("DELETE", url, undefined, config),
};
