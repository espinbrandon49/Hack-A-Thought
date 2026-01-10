import React from "react";

const cx = (...parts) => parts.filter(Boolean).join(" ");

export default function Button({
    variant = "primary", // primary | secondary | danger | ghost
    size = "md", // sm | md
    className = "",
    disabled,
    type = "button",
    ...props
}) {
    const base =
        "inline-flex items-center justify-center rounded-lg font-medium transition " +
        "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const sizes = {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-sm",
    };

    const variants = {
        primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-400",
        secondary:
            "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-300",
        danger: "bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-300",
        ghost: "bg-transparent text-slate-900 hover:bg-slate-100 focus:ring-slate-300",
    };

    return (
        <button
            type={type}
            disabled={disabled}
            className={cx(base, sizes[size], variants[variant], className)}
            {...props}
        />
    );
}
