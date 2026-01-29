"use client";

import AdminShell from "../../components/AdminShell";
import SurfaceCard from "../../components/SurfaceCard";
import DraftBar from "../../../components/admin/DraftBar";
import usePortfolioDraft from "../../hooks/usePortfolioDraft";
import { emptyPortfolio } from "../utils";

export default function FooterEditorPage() {
  const { draft, setDraft, loading, saving, error, save, discard, hasChanges } =
    usePortfolioDraft();

  const data = draft ?? emptyPortfolio();

  if (loading) {
    return (
      <AdminShell
        title="Footer"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Footer" },
        ]}
      >
        <SurfaceCard>Loading portfolio...</SurfaceCard>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Footer"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Content", href: "/admin/content" },
        { label: "Footer" },
      ]}
    >
      <DraftBar visible={hasChanges} saving={saving} onSave={save} onDiscard={discard} />
      {error ? (
        <SurfaceCard className="border border-red-500/30 bg-red-500/10 text-red-100">
          {error}
        </SurfaceCard>
      ) : null}

      <SurfaceCard>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
            placeholder="Copyright"
            value={data.footer?.copyright ?? ""}
            onChange={(event) =>
              setDraft({
                ...data,
                footer: { ...data.footer, copyright: event.target.value },
              })
            }
          />
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
            placeholder="Tagline"
            value={data.footer?.tagline ?? ""}
            onChange={(event) =>
              setDraft({
                ...data,
                footer: { ...data.footer, tagline: event.target.value },
              })
            }
          />
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
