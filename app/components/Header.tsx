"use client";

import { usePathname } from "next/navigation";
import type { NavItem } from "../../lib/types";
import ThemeToggle from "./ui/ThemeToggle";

const fallbackNav: NavItem[] = [
  { href: "/", label: "about" },
  { href: "/work", label: "work" },
  { href: "/experience", label: "experience" },
];

interface HeaderProps {
  navItems?: NavItem[];
}

export default function Header({ navItems = fallbackNav }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--bg-divider)]/60 bg-[color-mix(in_oklab,var(--bg-primary)_82%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[960px] items-center justify-between px-6 py-4 md:px-10">
        <ThemeToggle />
        <nav className="flex w-full max-w-[720px] items-center justify-end gap-6 text-sm">
          {navItems.map((item) => {
            const isActive = item.href.startsWith("/")
              ? pathname === item.href
              : false;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? "nav-link--active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
