"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getMe } from "../lib/apiClient";
import { setAccessToken, setRefreshToken } from "../lib/auth";

export default function AdminSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (!accessToken || !refreshToken) {
      setError("Missing auth tokens.");
      return;
    }

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    const validate = async () => {
      const user = await getMe();
      if (!user) {
        setError("Sign-in failed. Please try again.");
        return;
      }
      window.history.replaceState(null, "", "/admin/success");
      router.replace("/admin/dashboard");
    };

    validate();
  }, [params, router]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[500px] flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="w-full rounded-3xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-8">
          <h1 className="text-2xl font-semibold">
            {error ? "Sign-in failed" : "Signing you in"}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {error ?? "Validating your session..."}
          </p>
          {error ? (
            <Link
              href="/admin/login"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--bg-divider)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]"
            >
              Try again
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
