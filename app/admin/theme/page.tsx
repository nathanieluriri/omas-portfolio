"use client";

import AdminShell from "../components/AdminShell";
import Button from "../components/Button";
import SurfaceCard from "../components/SurfaceCard";
import usePortfolioDraft from "../hooks/usePortfolioDraft";
import type { ThemeColors } from "../../../lib/types";

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

export default function ThemeEditorPage() {
  const { draft, setDraft, loading, save, saving, discard, hasChanges } =
    usePortfolioDraft();

  if (loading || !draft) {
    return (
      <AdminShell title="Theme">
        <SurfaceCard>Loading theme...</SurfaceCard>
      </AdminShell>
    );
  }

  const theme = draft.theme ?? {};

  const updateTheme = (key: keyof ThemeColors, value: string) => {
    setDraft({
      ...draft,
      theme: {
        ...theme,
        [key]: value,
      },
    });
  };

  return (
    <AdminShell title="Theme">
      <SurfaceCard className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Draft status
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {hasChanges ? "Unsaved changes" : "All changes saved"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={discard} disabled={saving}>
            Discard changes
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <h2 className="text-lg font-semibold">Theme colors</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {themeFields.map((field) => (
            <label key={field} className="flex flex-col gap-2 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
              {field.replace(/_/g, " ")}
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme[field] ?? "#000000"}
                  onChange={(event) => updateTheme(field, event.target.value)}
                  className="h-10 w-12 rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-surface)]"
                />
                <input
                  value={theme[field] ?? ""}
                  onChange={(event) => updateTheme(field, event.target.value)}
                  className="flex-1 rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm text-[var(--text-primary)]"
                />
              </div>
            </label>
          ))}
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
