"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import useAdminUser from "../hooks/useAdminUser";
import { clearTokens } from "../lib/auth";
import Button from "./Button";

const tabs = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/theme", label: "Theme" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/assets", label: "Assets" },
  { href: "/admin/settings", label: "Settings" },
];

interface AdminShellProps extends PropsWithChildren {
  title: string;
}

export default function AdminShell({ title, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAdminUser();

  const handleSignOut = () => {
    clearTokens();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="mx-auto flex w-full max-w-[1400px] gap-8 px-6 py-10 md:px-10">
        <aside className="hidden w-[260px] shrink-0 flex-col gap-6 md:flex">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Admin
            </p>
            <p className="mt-2 text-lg font-semibold">Portfolio</p>
          </div>
          <nav className="flex flex-col gap-2 text-sm">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`rounded-full px-4 py-2 transition-colors duration-200 ease-out ${
                    isActive
                      ? "bg-[var(--bg-surface)] text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-4 text-xs text-[var(--text-muted)]">
            Signed in as
            <div className="mt-1 text-sm font-medium text-[var(--text-primary)]">
              {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
            </div>
            <Button
              type="button"
              variant="secondary"
              className="mt-3 w-full"
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-8 pb-24 md:pb-0">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{title}</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Keep everything clean, calm, and production-ready.
              </p>
            </div>
            <div className="flex items-center gap-3 md:hidden">
              <Button variant="secondary" onClick={handleSignOut}>
                Sign out
              </Button>
            </div>
          </header>

          <div className="flex min-w-0 flex-1 flex-col gap-6">{children}</div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-around border-t border-[var(--bg-divider)] bg-[var(--bg-primary)]/95 px-4 py-3 backdrop-blur md:hidden">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`text-xs uppercase tracking-[0.12em] ${
                isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
