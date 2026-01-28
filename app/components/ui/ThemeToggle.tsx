"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "oma-theme";
const TRANSITION_CLASS = "theme-transition";

type ThemeMode = "dark" | "light";

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
}

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [transitionId, setTransitionId] = useState<number | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const initialTheme = stored ?? "dark";
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      if (transitionId) {
        window.clearTimeout(transitionId);
      }
    };
  }, [transitionId]);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    document.documentElement.classList.add(TRANSITION_CLASS);
    applyTheme(nextTheme);
    if (transitionId) {
      window.clearTimeout(transitionId);
    }
    const id = window.setTimeout(() => {
      document.documentElement.classList.remove(TRANSITION_CLASS);
    }, 650);
    setTransitionId(id);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="group inline-flex items-center gap-2 rounded-full border border-[var(--bg-divider)] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--accent-muted)] hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
      aria-label="Toggle light and dark theme"
    >
      <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)] transition-transform duration-200 ease-out group-hover:scale-110" />
      {mounted ? theme : "dark"}
    </button>
  );
}
