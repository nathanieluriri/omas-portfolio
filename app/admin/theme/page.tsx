"use client";

import AdminShell from "../components/AdminShell";
import SurfaceCard from "../components/SurfaceCard";
import usePortfolioDraft from "../hooks/usePortfolioDraft";
import type { ThemeColors } from "../../../lib/types";
import DraftBar from "../../components/admin/DraftBar";

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
      <AdminShell
        title="Theme"
        breadcrumb={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Theme" }]}
      >
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
