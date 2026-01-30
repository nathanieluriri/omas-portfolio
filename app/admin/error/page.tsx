import { Suspense } from "react";
import ErrorClient from "./ErrorClient";

export default function AdminErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
          <div className="mx-auto flex min-h-screen w-full max-w-[520px] items-center justify-center px-6 py-10 text-center">
            <div className="w-full rounded-3xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Admin
              </p>
              <h1 className="mt-3 text-2xl font-semibold">Loading</h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Preparing your error details...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <ErrorClient />
    </Suspense>
  );
}
