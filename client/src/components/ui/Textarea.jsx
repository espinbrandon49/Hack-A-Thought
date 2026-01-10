import React from "react";

const cx = (...parts) => parts.filter(Boolean).join(" ");

export default function Textarea({ className = "", rows = 4, ...props }) {
    return (
        <textarea
            rows={rows}
            className={cx(
                "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm",
                "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400",
                "disabled:bg-slate-50 disabled:text-slate-500",
                className
            )}
            {...props}
        />
    );
}
