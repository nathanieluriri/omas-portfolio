"use client";

import { useMemo, useState } from "react";
import AdminShell from "../components/AdminShell";
import SurfaceCard from "../components/SurfaceCard";
import usePortfolioDraft from "../hooks/usePortfolioDraft";
import type { ThemeColors } from "../../../lib/types";
import DraftBar from "../../components/admin/DraftBar";
import Button from "../components/Button";
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
    id: "studio",
    name: "Studio",
    description: "Clean, neutral, and high contrast.",
    colors: baseTheme,
  },
  {
    id: "slate",
    name: "Slate",
    description: "Cool grays with a crisp cyan accent.",
    colors: {
      text_primary: "#0c1117",
      text_secondary: "#505a67",
      text_muted: "#768091",
      bg_primary: "#f3f5f8",
      bg_surface: "#ffffff",
      bg_surface_hover: "#e9eef4",
      bg_divider: "#d3dae3",
      accent_primary: "#1ea5d6",
      accent_muted: "#9fd9ec",
    },
  },
  {
    id: "ember",
    name: "Ember",
    description: "Warm neutrals with a bold coral pop.",
    colors: {
      text_primary: "#1a1411",
      text_secondary: "#6c5a52",
      text_muted: "#8e7a72",
      bg_primary: "#fbf5f1",
      bg_surface: "#ffffff",
      bg_surface_hover: "#f4e9e3",
      bg_divider: "#e0d2ca",
      accent_primary: "#d6522c",
      accent_muted: "#f0b39c",
    },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Earthy greens with calm, muted surfaces.",
    colors: {
      text_primary: "#0f1612",
      text_secondary: "#4c5b52",
      text_muted: "#6b7a71",
      bg_primary: "#f2f5f2",
      bg_surface: "#ffffff",
      bg_surface_hover: "#e7eee9",
      bg_divider: "#cfdad3",
      accent_primary: "#2f8f4e",
      accent_muted: "#a5d6b6",
    },
  },
];

const isThemeMatch = (a: ThemeColors, b: ThemeColors) =>
  themeFields.every((field) => a[field] === b[field]);

export default function ThemeEditorPage() {
  const { draft, setDraft, loading, save, saving, discard, hasChanges } =
    usePortfolioDraft();
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");

  if (loading || !draft) {
    return (
      <AdminShell
        title="Theme"
        breadcrumb={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Theme" }]}
      >
        <SurfaceCard>Loading theme...</SurfaceCard>
      </AdminShell>
    );
  }

  const currentTheme: ThemeColors = {
    ...baseTheme,
    ...(draft.theme ?? {}),
  };

  const preview = useMemo(() => {
    const hero = draft.hero;
    const name = hero?.name ?? "Your Name";
    const title = hero?.title ?? "Your Role or Specialty";
    const bio = hero?.bio?.[0] ?? "Describe your focus, strengths, and the kind of work you love.";
    const availability = hero?.availability?.label ?? "Open to work";
    const projects = (draft.projects ?? []).slice(0, 2);
    const skills = (draft.skillGroups ?? []).slice(0, 2);
    const contacts = (draft.contacts ?? []).slice(0, 3);

    return { name, title, bio, availability, projects, skills, contacts };
  }, [draft.contacts, draft.hero, draft.projects, draft.skillGroups]);

  const updateTheme = (key: keyof ThemeColors, value: string) => {
    setDraft({
      ...draft,
      theme: {
        ...currentTheme,
        [key]: value,
      },
    });
  };

  return (
    <AdminShell
      title="Theme"
      breadcrumb={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Theme" }]}
    >
      <DraftBar
        visible={hasChanges}
        saving={saving}
        onSave={save}
        onDiscard={discard}
      />

      <SurfaceCard>
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold">Theme options</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Pick a preset and preview it in light and dark mode.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {themePresets.map((preset) => {
              const active = isThemeMatch(currentTheme, preset.colors);
              return (
                <div
                  key={preset.id}
                  className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {preset.name}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">
                        {preset.description}
                      </p>
                    </div>
                    <Button
                      variant={active ? "primary" : "secondary"}
                      onClick={() =>
                        setDraft({
                          ...draft,
                          theme: { ...preset.colors },
                        })
                      }
                    >
                      {active ? "Selected" : "Use theme"}
                    </Button>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {(["light", "dark"] as const).map((mode) => (
                      <div
                        key={mode}
                        data-theme={mode}
                        style={themeToStyle(preset.colors)}
                        className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                            {mode} preview
                          </span>
                          <span className="rounded-full bg-[var(--accent-muted)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)]">
                            Accent
                          </span>
                        </div>
                        <div className="mt-3 rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-3">
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            Sample card
                          </p>
                          <p className="mt-1 text-xs text-[var(--text-secondary)]">
                            Body text and muted details.
                          </p>
                          <div className="mt-3 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)]" />
                            <span className="text-xs text-[var(--text-muted)]">
                              Hover state
                            </span>
                          </div>
                          <button
                            type="button"
                            className="mt-3 w-full rounded-full bg-[var(--accent-primary)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white"
                          >
                            Primary action
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold">Homepage preview</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Preview how the portfolio homepage looks with your current theme.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Preview mode
            </div>
            <div className="flex items-center gap-2">
              {(["light", "dark"] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={previewMode === mode ? "primary" : "secondary"}
                  onClick={() => setPreviewMode(mode)}
                >
                  {mode}
                </Button>
              ))}
            </div>
          </div>

          <div
            data-theme={previewMode}
            style={themeToStyle(currentTheme)}
            className="rounded-3xl border border-[var(--bg-divider)] bg-[var(--bg-primary)]"
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
                  <p className="mt-2 text-sm font-semibold italic text-[var(--accent-primary)]">
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
              <button
                type="button"
                className="mt-5 rounded-full bg-[var(--accent-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white"
              >
                View resume
              </button>
            </div>

            <div className="grid gap-6 border-t border-[var(--bg-divider)] px-6 py-8 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Work highlights
                </p>
                <div className="mt-3 flex flex-col gap-3">
                  {(preview.projects.length > 0 ? preview.projects : [{ title: "Project Title", description: "Short project description." }]).map(
                    (project, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-4"
                      >
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                          {project.title || "Project Title"}
                        </p>
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">
                          {project.description || "Short project description."}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Skills
                </p>
                <div className="mt-3 flex flex-col gap-3">
                  {(preview.skills.length > 0 ? preview.skills : [{ title: "Skills", items: ["Systems", "Product", "Architecture"] }]).map(
                    (group, index) => (
                      <div key={index} className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
                          {group.title || "Skills"}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(group.items ?? ["Systems", "Product"]).map((item, itemIndex) => (
                            <span
                              key={itemIndex}
                              className="rounded-full bg-[var(--bg-primary)] px-3 py-1 text-[11px] text-[var(--text-secondary)]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--bg-divider)] px-6 py-6">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Contact
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {(preview.contacts.length > 0
                  ? preview.contacts
                  : [
                      { label: "Email", value: "hello@email.com" },
                      { label: "LinkedIn", value: "linkedin.com/in/you" },
                    ]
                ).map((contact, index) => (
                  <div
                    key={index}
                    className="rounded-full border border-[var(--bg-divider)] px-3 py-1 text-[11px] text-[var(--text-secondary)]"
                  >
                    {contact.label}: {contact.value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <details>
          <summary className="cursor-pointer text-sm font-semibold text-[var(--text-primary)]">
            Advanced settings
          </summary>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Create your own theme by editing text, background, and accent colors.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
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
                    className="h-10 w-12 rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-surface)]"
                  />
                  <input
                    value={currentTheme[field] ?? ""}
                    onChange={(event) => updateTheme(field, event.target.value)}
                    className="flex-1 rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm text-[var(--text-primary)]"
                  />
                </div>
              </label>
            ))}
          </div>
        </details>
      </SurfaceCard>
    </AdminShell>
  );
}
