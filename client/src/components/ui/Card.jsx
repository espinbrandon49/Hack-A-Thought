import React from "react";

const cx = (...parts) => parts.filter(Boolean).join(" ");

export default function Card({ className = "", ...props }) {
    return (
        <div
            className={cx("rounded-xl border border-slate-200 bg-white shadow-sm", className)}
            {...props}
        />
    );
}
