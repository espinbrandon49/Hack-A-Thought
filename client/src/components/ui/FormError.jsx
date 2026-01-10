import React from "react";

export default function FormError({ error, fallback = "Something went wrong." }) {
    if (!error) return null;

    const message =
        typeof error === "string" ? error : error?.message || fallback;

    return (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {message}
        </div>
    );
}
