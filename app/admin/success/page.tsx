import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function AdminSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
          <div className="mx-auto flex min-h-screen w-full max-w-[500px] flex-col items-center justify-center gap-6 px-6 text-center">
            <div className="w-full rounded-3xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-8">
              <h1 className="text-2xl font-semibold">Signing you in</h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Validating your session...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}
