"use client";

import AdminShell from "../components/AdminShell";
import SurfaceCard from "../components/SurfaceCard";
import usePortfolioDraft from "../hooks/usePortfolioDraft";
import DraftBar from "../../components/admin/DraftBar";

export default function SeoEditorPage() {
  const { draft, setDraft, loading, save, saving, discard, hasChanges } =
    usePortfolioDraft();

  if (loading || !draft) {
    return (
      <AdminShell
        title="SEO"
        breadcrumb={[{ label: "Admin", href: "/admin/dashboard" }, { label: "SEO" }]}
      >
        <SurfaceCard>Loading metadata...</SurfaceCard>
      </AdminShell>
    );
  }

  const metadata = draft.metadata ?? {};

  return (
    <AdminShell
      title="SEO"
      breadcrumb={[{ label: "Admin", href: "/admin/dashboard" }, { label: "SEO" }]}
    >
      <DraftBar
        visible={hasChanges}
        saving={saving}
        onSave={save}
        onDiscard={discard}
      />

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
