"use client";

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
            <h2 className="text-lg font-semibold">Live preview</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              This preview uses your current theme settings.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {(["light", "dark"] as const).map((mode) => (
              <div
                key={mode}
                data-theme={mode}
                style={themeToStyle(currentTheme)}
                className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    {mode} mode
                  </span>
                  <span className="rounded-full bg-[var(--accent-muted)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)]">
                    Accent
                  </span>
                </div>
                <div className="mt-4 rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-4">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Theme preview
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Primary, secondary, and muted text styles.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)]" />
                    <span className="text-xs text-[var(--text-muted)]">
                      Accent indicator
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
