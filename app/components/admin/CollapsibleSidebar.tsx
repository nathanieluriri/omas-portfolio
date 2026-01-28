"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItem {
  href: string;
  label: string;
}

interface CollapsibleSidebarProps {
  items: SidebarItem[];
  userLabel?: string;
  onSignOut: () => void;
}

const STORAGE_KEY = "admin-sidebar-collapsed";

export default function CollapsibleSidebar({
  items,
  userLabel,
  onSignOut,
}: CollapsibleSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCollapsed(stored === "true");
      return;
    }
    const prefersCollapsed = window.innerWidth < 900;
    setCollapsed(prefersCollapsed);
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    window.localStorage.setItem(STORAGE_KEY, String(next));
  };

  return (
    <aside
      className={`hidden shrink-0 flex-col gap-6 md:flex ${
        collapsed ? "w-[86px]" : "w-[260px]"
      } transition-[width] duration-300 ease-out`}
    >
      <div className="flex items-center justify-between">
        <div className={collapsed ? "hidden" : ""}>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Admin
          </p>
          <p className="mt-2 text-lg font-semibold">Portfolio</p>
        </div>
        <button
          type="button"
          onClick={toggle}
          className="rounded-full border border-[var(--bg-divider)] p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          aria-label="Toggle sidebar"
        >
          <span className="text-xs">☰</span>
        </button>
      </div>

      <nav className="flex flex-col gap-2 text-sm">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-full px-3 py-2 transition-colors duration-200 ease-out ${
                isActive
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--bg-divider)] text-xs uppercase tracking-[0.2em]">
                {item.label.slice(0, 1)}
              </span>
              <span className={collapsed ? "hidden" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-4 text-xs text-[var(--text-muted)]">
        <div className={collapsed ? "hidden" : ""}>
          Signed in as
          <div className="mt-1 text-sm font-medium text-[var(--text-primary)]">
            {userLabel ?? "Loading..."}
          </div>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className={`mt-3 w-full rounded-full border border-[var(--bg-divider)] px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] ${
            collapsed ? "mt-0" : ""
          }`}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
