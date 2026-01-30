"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AdminShell from "../components/AdminShell";
import usePortfolioDraft from "../hooks/usePortfolioDraft";
import type { ThemeColors } from "../../../lib/types";
import { themeToStyle } from "../../../lib/theme";

const themeFields: Array<keyof ThemeColors> = [
  "text_primary",
  "text_secondary",
  "text_muted",
  "bg_primary",
  "bg_surface",
  "bg_surface_hover",
  "bg_divider",
  "accent_primary",
  "accent_muted",
];

const baseTheme: ThemeColors = {
  text_primary: "#0f1115",
  text_secondary: "#4b5160",
  text_muted: "#6b7280",
  bg_primary: "#f7f7f8",
  bg_surface: "#ffffff",
  bg_surface_hover: "#f1f3f6",
  bg_divider: "#d7dbe3",
  accent_primary: "#ff6a00",
  accent_muted: "#f2b28e",
};

const themePresets: Array<{
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
}> = [
  {
    id: "linear-light",
    name: "Linear Light",
    description: "Clean whites with a focused indigo accent.",
    colors: {
      text_primary: "#0b0f18",
      text_secondary: "#465166",
      text_muted: "#6d7687",
      bg_primary: "#ffffff",
      bg_surface: "#f7f8fb",
      bg_surface_hover: "#eef1f6",
      bg_divider: "#e3e7ef",
      accent_primary: "#4f46e5",
      accent_muted: "#c7c9f7",
    },
  },
  {
    id: "linear-dark",
    name: "Linear Dark",
    description: "Deep graphite with a vivid purple accent.",
    colors: {
      text_primary: "#e5e7eb",
      text_secondary: "#a4adbb",
      text_muted: "#7f8896",
      bg_primary: "#0e1015",
      bg_surface: "#151824",
      bg_surface_hover: "#1b1f2d",
      bg_divider: "#202634",
      accent_primary: "#8b5cf6",
      accent_muted: "#c9a6ff",
    },
  },
  {
    id: "notion-cream",
    name: "Notion Cream",
    description: "Warm paper tone with coral accents.",
    colors: {
      text_primary: "#3b2f25",
      text_secondary: "#6f5b4a",
      text_muted: "#9b8574",
      bg_primary: "#fffefc",
      bg_surface: "#f7f2ea",
      bg_surface_hover: "#efe6db",
      bg_divider: "#e6d7c7",
      accent_primary: "#e07a5f",
      accent_muted: "#f0b8a4",
    },
  },
  {
    id: "terminal",
    name: "Terminal",
    description: "Pure black with neon green highlights.",
    colors: {
      text_primary: "#c8ffcd",
      text_secondary: "#7be889",
      text_muted: "#4bbd62",
      bg_primary: "#000000",
      bg_surface: "#0b0b0b",
      bg_surface_hover: "#121212",
      bg_divider: "#1a1a1a",
      accent_primary: "#00ff66",
      accent_muted: "#6dff9c",
    },
  },
  {
    id: "nordic",
    name: "Nordic",
    description: "Cool blue-grays with frozen blue accents.",
    colors: {
      text_primary: "#1a2433",
      text_secondary: "#4e5c6f",
      text_muted: "#6d7b8c",
      bg_primary: "#eceff4",
      bg_surface: "#ffffff",
      bg_surface_hover: "#e3e8ef",
      bg_divider: "#cdd5df",
      accent_primary: "#5e81ac",
      accent_muted: "#b9c8da",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Dark plum base with warm pink accents.",
    colors: {
      text_primary: "#f4f1f8",
      text_secondary: "#cfc7e4",
      text_muted: "#a99ebf",
      bg_primary: "#1f1d2b",
      bg_surface: "#26233a",
      bg_surface_hover: "#2f2b48",
      bg_divider: "#3a3454",
      accent_primary: "#ff7a59",
      accent_muted: "#ffc2b1",
    },
  },
  {
    id: "draftsman",
    name: "Draftsman",
    description: "Blueprint blues with yellow accents.",
    colors: {
      text_primary: "#eef3ff",
      text_secondary: "#b9c8f0",
      text_muted: "#8ea3d6",
      bg_primary: "#0b2a4a",
      bg_surface: "#12365c",
      bg_surface_hover: "#18406b",
      bg_divider: "#1c4a7a",
      accent_primary: "#ffd166",
      accent_muted: "#ffe29b",
    },
  },
];

const isThemeMatch = (a: ThemeColors, b: ThemeColors) =>
  themeFields.every((field) => a[field] === b[field]);

export default function ThemeEditorPage() {
  const { draft, setDraft, loading, save, saving, hasChanges } = usePortfolioDraft();
  const [previewMode, setPreviewMode] = useState<"auto" | "light" | "dark">("auto");
  const [systemMode, setSystemMode] = useState<"light" | "dark">("light");
  const saveTimeoutRef = useRef<number | null>(null);

  const preview = useMemo(() => {
    const hero = draft?.hero;
    const name = hero?.name ?? "Your Name";
    const title = hero?.title ?? "Your Role or Specialty";
    const bio = hero?.bio?.[0] ?? "Describe your focus, strengths, and the kind of work you love.";
    const availability = hero?.availability?.label ?? "Open to work";
    const projects = (draft?.projects ?? []).slice(0, 2);
    const skills = (draft?.skillGroups ?? []).slice(0, 2);
    const contacts = (draft?.contacts ?? []).slice(0, 3);

    return { name, title, bio, availability, projects, skills, contacts };
  }, [draft?.contacts, draft?.hero, draft?.projects, draft?.skillGroups]);

  const currentTheme: ThemeColors = useMemo(
    () => ({
      ...baseTheme,
      ...(draft?.theme ?? {}),
    }),
    [draft?.theme]
  );

  const updateTheme = (key: keyof ThemeColors, value: string) => {
    if (!draft) return;
    setDraft({
      ...draft,
      theme: {
        ...currentTheme,
        [key]: value,
      },
    });
  };

  useEffect(() => {
    if (previewMode !== "auto") return;
    if (typeof window === "undefined") return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setSystemMode(query.matches ? "dark" : "light");
    handleChange();
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, [previewMode]);

  useEffect(() => {
    if (!hasChanges || !draft) return;
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = window.setTimeout(() => {
      save();
    }, 800);
    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hasChanges, save]);

  const activePreviewMode = previewMode === "auto" ? systemMode : previewMode;
  const accentPalette = ["#ff6a00", "#4f46e5", "#2f8f4e", "#f97316", "#0ea5e9", "#ffd166"];

  if (loading || !draft) {
    return (
      <AdminShell
        title="Theme"
        breadcrumb={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Theme" }]}
      >
        <div className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-6 text-sm text-[var(--text-muted)]">
          Loading theme...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Theme"
      breadcrumb={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Theme" }]}
    >
      <div className="flex h-[calc(100vh-220px)] min-h-[560px] overflow-hidden rounded-3xl border border-[var(--bg-divider)]/30 bg-[var(--bg-primary)]">
        <section className="flex w-full max-w-[420px] flex-col border-r border-[var(--bg-divider)]/40">
          <div className="sticky top-0 z-10 border-b border-[var(--bg-divider)]/40 bg-[color-mix(in_oklab,var(--bg-primary)_90%,transparent)] px-6 py-5 backdrop-blur">
            <p className="text-[13px] text-[var(--text-muted)]">Settings / Appearance</p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight text-[var(--text-primary)]">
              Interface Theme
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Select a theme to override the system default.
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
              {saving ? "Saving…" : hasChanges ? "Syncing changes" : "Saved"}
            </p>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Themes
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {themePresets.map((preset) => {
                  const active = isThemeMatch(currentTheme, preset.colors);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          theme: { ...preset.colors },
                        })
                      }
                      className={`flex flex-col gap-2 text-left ${
                        active ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                      }`}
                    >
                      <div
                        data-theme="light"
                        style={themeToStyle(preset.colors)}
                        className={`h-20 w-full overflow-hidden rounded-lg border ${
                          active
                            ? "border-2 border-[var(--accent-primary)]"
                            : "border border-[var(--bg-divider)]/40"
                        }`}
                      >
                        <div className="flex h-full w-full">
                          <div className="w-[20%] bg-[var(--bg-surface)]" />
                          <div className="relative flex-1 bg-[var(--bg-primary)]">
                            <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
                          </div>
                        </div>
                      </div>
                      <span className="text-[12px] text-[var(--text-muted)]">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Mode
              </p>
              <div className="mt-3 inline-flex rounded-full border border-[var(--bg-divider)]/40 bg-[var(--bg-surface)] p-1 text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {(["auto", "light", "dark"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPreviewMode(mode)}
                    className={`rounded-full px-4 py-1.5 transition-colors duration-200 ease-out ${
                      previewMode === mode
                        ? "bg-[var(--accent-primary)] text-white"
                        : "hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <details className="group">
              <summary className="cursor-pointer text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Custom Accent Color
              </summary>
              <div className="mt-4 flex flex-wrap gap-3">
                {accentPalette.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => updateTheme("accent_primary", color)}
                    className="h-6 w-6 rounded-full border border-[var(--bg-divider)]/40"
                    style={{ background: color }}
                    aria-label={`Set accent ${color}`}
                  />
                ))}
              </div>
            </details>

            <details className="group">
              <summary className="cursor-pointer text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Advanced tokens
              </summary>
              <div className="mt-4 grid gap-4">
                {themeFields.map((field) => (
                  <label
                    key={field}
                    className="flex flex-col gap-2 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]"
                  >
                    {field.replace(/_/g, " ")}
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={currentTheme[field] ?? "#000000"}
                        onChange={(event) => updateTheme(field, event.target.value)}
                        className="h-10 w-12 rounded-lg border border-[var(--bg-divider)]/40 bg-[var(--bg-surface)]"
                      />
                      <input
                        value={currentTheme[field] ?? ""}
                        onChange={(event) => updateTheme(field, event.target.value)}
                        className="flex-1 rounded-lg border border-[var(--bg-divider)]/40 bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)]"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </details>
          </div>
        </section>

        <section className="hidden flex-1 md:flex">
          <div className="relative flex flex-1 items-center justify-center p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(148,163,184,0.16)_1px,transparent_1px)] [background-size:22px_22px] opacity-40" />
            <div className="relative w-full max-w-[820px]">
              <div
                data-theme={activePreviewMode}
                style={themeToStyle(currentTheme)}
                className="aspect-video w-full overflow-hidden rounded-3xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] transition-colors duration-200"
              >
                <div className="flex items-center justify-between border-b border-[var(--bg-divider)] px-6 py-4">
                  <span className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    {preview.name}
                  </span>
                  <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                    <span>About</span>
                    <span>Work</span>
                    <span>Contact</span>
                  </div>
                </div>

                <div className="px-6 py-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-[var(--text-primary)]">
                        {preview.name}
                      </h3>
                      <p className="mt-2 text-sm font-medium text-[var(--accent-primary)]">
                        {preview.title}
                      </p>
                    </div>
                    <span className="rounded-full border border-[var(--bg-divider)] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                      {preview.availability}
                    </span>
                  </div>
                  <p className="mt-4 max-w-[520px] text-sm text-[var(--text-secondary)]">
                    {preview.bio}
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      className="rounded-full bg-[var(--accent-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white"
                    >
                      Start Project
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-[var(--bg-divider)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)]"
                    >
                      Learn more
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 border-t border-[var(--bg-divider)] px-6 py-6 md:grid-cols-3">
                  {["Card One", "Card Two", "Card Three"].map((label) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-4"
                    >
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {label}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">
                        Surface, border, and text interplay.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
