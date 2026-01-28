"use client";

import AdminShell from "../components/AdminShell";
import Button from "../components/Button";
import SurfaceCard from "../components/SurfaceCard";
import usePortfolioDraft from "../hooks/usePortfolioDraft";

export default function SeoEditorPage() {
  const { draft, setDraft, loading, save, saving, discard, hasChanges } =
    usePortfolioDraft();

  if (loading || !draft) {
    return (
      <AdminShell title="SEO">
        <SurfaceCard>Loading metadata...</SurfaceCard>
      </AdminShell>
    );
  }

  const metadata = draft.metadata ?? {};

  return (
    <AdminShell title="SEO">
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
        <h2 className="text-lg font-semibold">Metadata</h2>
        <div className="mt-4 flex flex-col gap-4">
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
            placeholder="Title"
            value={metadata.title ?? ""}
            onChange={(event) =>
              setDraft({
                ...draft,
                metadata: { ...metadata, title: event.target.value },
              })
            }
          />
          <textarea
            className="min-h-[100px] w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
            placeholder="Description"
            value={metadata.description ?? ""}
            onChange={(event) =>
              setDraft({
                ...draft,
                metadata: { ...metadata, description: event.target.value },
              })
            }
          />
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
            placeholder="Author"
            value={metadata.author ?? ""}
            onChange={(event) =>
              setDraft({
                ...draft,
                metadata: { ...metadata, author: event.target.value },
              })
            }
          />
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
