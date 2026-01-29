"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const entries = [
  {
    id: "ai-suggestions",
    label: "AI Suggestions",
    group: "AI",
    href: "/admin/ai-suggestions",
  },
  { label: "Dashboard", href: "/admin/dashboard", group: "Pages" },
  { label: "Content", href: "/admin/content", group: "Pages" },
  { label: "Theme", href: "/admin/theme", group: "Pages" },
  { label: "SEO", href: "/admin/seo", group: "Pages" },
  { label: "Assets", href: "/admin/assets", group: "Pages" },
  { label: "Settings", href: "/admin/settings", group: "Pages" },
  { label: "Hero", href: "/admin/content/hero", group: "Content" },
  { label: "Experience", href: "/admin/content/experience", group: "Content" },
  { label: "Projects", href: "/admin/content/projects", group: "Content" },
  { label: "Skills", href: "/admin/content/skills", group: "Content" },
  { label: "Contacts", href: "/admin/content/contacts", group: "Content" },
  { label: "Navigation", href: "/admin/content/navigation", group: "Content" },
  { label: "Footer", href: "/admin/content/footer", group: "Content" },
];

type Entry = (typeof entries)[number] & {
  href?: string;
  id?: string;
};

export default function AdminSearchBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightAi, setHighlightAi] = useState(false);
  const [openedViaShortcut, setOpenedViaShortcut] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        setOpenedViaShortcut(true);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    if (openedViaShortcut) {
      setHighlightAi(true);
      const timer = window.setTimeout(() => setHighlightAi(false), 2000);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [open, openedViaShortcut]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return entries;
    return entries.filter((entry) => entry.label.toLowerCase().includes(normalized));
  }, [query]);

  const grouped = useMemo(() => {
    return results.reduce<Record<string, Entry[]>>((acc, entry) => {
      acc[entry.group] = acc[entry.group] ?? [];
      acc[entry.group].push(entry as Entry);
      return acc;
    }, {});
  }, [results]);

  const orderedGroups = useMemo(() => {
    const order = ["AI", "Pages", "Content"];
    const rest = Object.keys(grouped).filter((group) => !order.includes(group));
    return [...order.filter((group) => grouped[group]), ...rest];
  }, [grouped]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpenedViaShortcut(false);
          setOpen(true);
        }}
        className="inline-flex items-center gap-2 rounded-full border border-[var(--bg-divider)] px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
      >
        Search
        <span className="text-[10px] text-[var(--text-muted)]">⌘K</span>
      </button>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 grid place-items-center bg-black/60 p-6"
        onClick={() => setOpen(false)}
      >
        <div
          className="flex w-full max-w-[560px] flex-col rounded-3xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] max-h-[80vh]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search admin..."
              className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm text-[var(--text-primary)]"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-3 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]"
            >
              Close
            </button>
          </div>
          <div className="mt-4 flex flex-1 flex-col gap-4 overflow-y-auto pr-1">
            {orderedGroups.map((group) => (
              <div key={group}>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {group}
                </p>
                <div className="mt-2 flex flex-col gap-2">
                  {grouped[group].map((item) => {
                    const isAi = item.id === "ai-suggestions";
                    return (
                      <button
                        key={item.href ?? item.id}
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          if (item.href) router.push(item.href);
                        }}
                        className={`relative flex items-center justify-between overflow-hidden rounded-2xl border border-transparent bg-[var(--bg-primary)] px-4 py-2 text-left text-sm text-[var(--text-secondary)] hover:border-[var(--accent-muted)] hover:text-[var(--text-primary)] ${
                          isAi ? "font-medium text-[var(--text-primary)]" : ""
                        }`}
                      >
                        {isAi && highlightAi ? (
                          <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[var(--accent-primary)]/10 blur-sm motion-safe:animate-pulse" />
                        ) : null}
                        <span className="relative">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
