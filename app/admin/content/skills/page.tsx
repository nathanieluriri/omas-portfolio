"use client";

import { useRouter } from "next/navigation";
import AdminShell from "../../components/AdminShell";
import Button from "../../components/Button";
import SurfaceCard from "../../components/SurfaceCard";
import DraftBar from "../../../components/admin/DraftBar";
import usePortfolioDraft from "../../hooks/usePortfolioDraft";
import { emptyPortfolio } from "../utils";

export default function SkillsListPage() {
  const router = useRouter();
  const { draft, loading, saving, error, save, discard, hasChanges } =
    usePortfolioDraft();

  const data = draft ?? emptyPortfolio();

  const addSkillGroup = () => {
    router.push("/admin/content/skills/new");
  };

  if (loading) {
    return (
      <AdminShell
        title="Skills"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Skills" },
        ]}
      >
        <SurfaceCard>Loading portfolio...</SurfaceCard>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Skills"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Content", href: "/admin/content" },
        { label: "Skills" },
      ]}
    >
      <DraftBar visible={hasChanges} saving={saving} onSave={save} onDiscard={discard} />
      {error ? (
        <SurfaceCard className="border border-red-500/30 bg-red-500/10 text-red-100">
          {error}
        </SurfaceCard>
      ) : null}

      <SurfaceCard>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-[var(--text-secondary)]">
            {data.skillGroups?.length ?? 0} groups
          </p>
          <Button variant="secondary" onClick={addSkillGroup}>
            Add skill group
          </Button>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {(data.skillGroups ?? []).map((group, index) => (
            <button
              key={`${group.title}-${index}`}
              type="button"
              onClick={() => router.push(`/admin/content/skills/${index}`)}
              className="flex items-center justify-between rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-3 text-left text-sm text-[var(--text-primary)]"
            >
              <span>{group.title || "Untitled group"}</span>
              <span className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Edit
              </span>
            </button>
          ))}
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
