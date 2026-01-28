import Link from "next/link";
import { API_BASE_URL } from "../../../lib/config";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[500px] flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="w-full rounded-3xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Admin
          </p>
          <h1 className="mt-3 text-2xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Sign in to manage your portfolio.
          </p>
          <Link
            href={`${API_BASE_URL}/v1/users/google/auth`}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent-primary)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-transform duration-200 ease-out hover:-translate-y-0.5"
          >
            Continue with Google
          </Link>
          <p className="mt-4 text-xs text-[var(--text-muted)]">
            Secure sign-in via Google.
          </p>
        </div>
      </div>
    </div>
  );
}
