"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const reasonCopy: Record<string, { title: string; message: string }> = {
  auth_failed: {
    title: "Sign-in failed",
    message: "We couldn’t verify your Google sign-in. Please try again.",
  },
  not_allowed_email: {
    title: "Access not granted",
    message: "This Google account isn’t approved for admin access.",
  },
  default: {
    title: "Something went wrong",
    message: "We ran into an issue while signing you in. Please try again.",
  },
};

export default function ErrorClient() {
  const params = useSearchParams();
  const [ready, setReady] = useState(false);

  const reason = useMemo(() => params.get("reason") ?? "default", [params]);
  const copy = reasonCopy[reason] ?? reasonCopy.default;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.replaceState(null, "", "/admin/error");
    setReady(true);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[520px] items-center justify-center px-6 py-10 text-center">
        <div className="w-full rounded-3xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-8 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.6)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Admin
          </p>
          <h1 className="mt-3 text-2xl font-semibold">{copy.title}</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {ready ? copy.message : "Loading..."}
          </p>
          <Link
            href="/admin/login"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent-primary)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-transform duration-200 ease-out hover:-translate-y-0.5"
          >
            Go back to login
          </Link>
          <p className="mt-4 text-xs text-[var(--text-muted)]">
            If this keeps happening, contact the site owner.
          </p>
        </div>
      </div>
    </div>
  );
}
