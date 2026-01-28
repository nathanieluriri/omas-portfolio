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
    <header className="sticky top-0 z-20 border-b border-transparent bg-transparent">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-6 md:px-10">
        <ThemeToggle />
        <nav className="flex items-center gap-6 text-sm italic text-[var(--text-muted)]">
          {navItems.map((item) => {
            const isActive = item.href.startsWith("/")
              ? pathname === item.href
              : false;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative transition-colors duration-200 ease-out hover:text-[var(--text-primary)] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[var(--accent-primary)] after:transition-transform after:duration-200 after:ease-out hover:after:scale-x-100 ${
                  isActive ? "text-[var(--text-primary)] after:scale-x-100" : ""
                }`}
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
