"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { PropsWithChildren } from "react";
import AdminSearchBar from "../../components/admin/AdminSearchBar";
import Breadcrumb from "../../components/admin/Breadcrumb";
import CollapsibleSidebar from "../../components/admin/CollapsibleSidebar";
import useAdminUser from "../hooks/useAdminUser";
import { clearTokens } from "../lib/auth";
import Button from "./Button";
import SessionLoader from "./SessionLoader";

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
  breadcrumb?: Array<{ label: string; href?: string }>;
}

export default function AdminShell({
  title,
  breadcrumb = [],
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAdminUser();

  const handleSignOut = () => {
    clearTokens();
    router.push("/admin/login");
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      clearTokens();
      router.replace("/admin/login");
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="mx-auto flex min-h-screen w-full max-w-[640px] items-center justify-center px-6 text-sm text-[var(--text-muted)]">
          <SessionLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="mx-auto flex w-full max-w-[1400px] gap-8 px-6 py-10 md:px-10">
        <CollapsibleSidebar
          items={tabs}
          userLabel={user ? `${user.firstName} ${user.lastName}` : undefined}
          onSignOut={handleSignOut}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-8 pb-24 md:pb-0">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-3">
              <Breadcrumb items={breadcrumb} />
              <div>
                <h1 className="text-2xl font-semibold">{title}</h1>
                <p className="text-sm text-[var(--text-muted)]">
                  Keep everything clean, calm, and production-ready.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AdminSearchBar />
              <div className="md:hidden">
                <Button variant="secondary" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
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
