"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "oma-theme";
const TRANSITION_CLASS = "theme-transition";

type ThemeMode = "dark" | "light";

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [transitionId, setTransitionId] = useState<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const animatingRef = useRef(false);

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
    if (animatingRef.current) return;
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    if (prefersReducedMotion || !buttonRef.current) {
      document.documentElement.classList.add(TRANSITION_CLASS);
      applyTheme(nextTheme);
      if (transitionId) {
        window.clearTimeout(transitionId);
      }
      const id = window.setTimeout(() => {
        document.documentElement.classList.remove(TRANSITION_CLASS);
      }, 650);
      setTransitionId(id);
      return;
    }

    const oldBg = getComputedStyle(document.documentElement)
      .getPropertyValue("--bg-primary")
      .trim();

    const rect = buttonRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const maxX = Math.max(x, window.innerWidth - x);
    const maxY = Math.max(y, window.innerHeight - y);
    const radius = Math.ceil(Math.hypot(maxX, maxY));

    const ripple = document.createElement("div");
    ripple.className = "theme-ripple";
    ripple.style.background = oldBg || "var(--bg-primary)";
    ripple.style.setProperty("--ripple-x", `${x}px`);
    ripple.style.setProperty("--ripple-y", `${y}px`);
    ripple.style.setProperty("--ripple-size", `${radius}px`);
    document.body.appendChild(ripple);
    animatingRef.current = true;

    applyTheme(nextTheme);

    requestAnimationFrame(() => {
      ripple.classList.add("theme-ripple--active");
    });

    const cleanup = () => {
      ripple.remove();
      animatingRef.current = false;
    };

    ripple.addEventListener(
      "transitionend",
      () => {
        applyTheme(nextTheme);
        cleanup();
      },
      { once: true }
    );
  };

  const isDark = theme === "dark";
  const showMoon = mounted ? isDark : true;
  const showSun = mounted ? !isDark : false;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={
        "group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--bg-divider)] bg-[var(--bg-surface)] text-[var(--text-muted)] transition-colors duration-300 ease-out hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)] " +
        className
      }
      aria-label="Toggle light and dark theme"
      ref={buttonRef}
    >
      <span className="relative h-4 w-4">
        <span
          className={`absolute inset-0 transition-all duration-300 ease-out motion-reduce:transition-none ${
            showMoon ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
          }`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
            <path
              d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span
          className={`absolute inset-0 transition-all duration-300 ease-out motion-reduce:transition-none ${
            showSun ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
          } ${showSun ? "text-[var(--accent-primary)]" : ""}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
            <circle cx="12" cy="12" r="4.2" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M12 2.5v2.7" />
              <path d="M12 18.8v2.7" />
              <path d="M4.6 4.6l1.9 1.9" />
              <path d="M17.5 17.5l1.9 1.9" />
              <path d="M2.5 12h2.7" />
              <path d="M18.8 12h2.7" />
              <path d="M4.6 19.4l1.9-1.9" />
              <path d="M17.5 6.5l1.9-1.9" />
            </g>
          </svg>
        </span>
      </span>
    </button>
  );
}
