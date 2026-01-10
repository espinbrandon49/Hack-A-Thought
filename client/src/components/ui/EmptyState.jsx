import React from "react";

export default function EmptyState({ title = "Nothing here yet.", children }) {
    return (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <div className="text-sm font-medium text-slate-900">{title}</div>
            {children ? (
                <div className="mt-2 text-sm text-slate-600">{children}</div>
            ) : null}
        </div>
    );
}
