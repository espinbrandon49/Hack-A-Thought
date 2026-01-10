import React from "react";

const cx = (...parts) => parts.filter(Boolean).join(" ");

export default function Input({ className = "", ...props }) {
    return (
        <input
            className={cx(
                "h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm",
                "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400",
                "disabled:bg-slate-50 disabled:text-slate-500",
                className
            )}
            {...props}
        />
    );
}
