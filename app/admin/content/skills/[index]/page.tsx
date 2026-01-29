"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "../../../components/AdminShell";
import Button from "../../../components/Button";
import SurfaceCard from "../../../components/SurfaceCard";
import DraftBar from "../../../../components/admin/DraftBar";
import usePortfolioDraft from "../../../hooks/usePortfolioDraft";
import { emptyPortfolio } from "../../utils";
import ListInput from "../../components/ListInput";
import type { SkillGroup } from "../../../../../lib/types";

export default function SkillGroupEditorPage() {
  const router = useRouter();
  const params = useParams<{ index: string }>();
  const rawIndex = params.index;
  const createdRef = useRef(false);
  const {
    draft,
    setDraft,
    loading,
    saving,
    error,
    save,
    discard,
    hasChanges,
  } = usePortfolioDraft();

  const data = draft ?? emptyPortfolio();
  const isNew = rawIndex === "new";
  const index = isNew ? (data.skillGroups?.length ?? 0) : Number(rawIndex);
  const group = data.skillGroups?.[index];

  useEffect(() => {
    if (!isNew || createdRef.current || loading) return;
    createdRef.current = true;
    const next = [...(data.skillGroups ?? []), { title: "", items: [] }];
    setDraft({ ...data, skillGroups: next });
    router.replace(`/admin/content/skills/${next.length - 1}`);
  }, [data, isNew, loading, router, setDraft]);

  const updateSkillGroup = (next: Partial<SkillGroup>) => {
    const list = [...(data.skillGroups ?? [])];
    list[index] = { ...list[index], ...next };
    setDraft({ ...data, skillGroups: list });
  };

  const removeSkillGroup = () => {
    const list = [...(data.skillGroups ?? [])];
    list.splice(index, 1);
    setDraft({ ...data, skillGroups: list });
    router.push("/admin/content/skills");
  };

  if (loading) {
    return (
      <AdminShell
        title="Skills"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Skills", href: "/admin/content/skills" },
          { label: `Group ${index + 1}` },
        ]}
      >
        <SurfaceCard>Loading portfolio...</SurfaceCard>
      </AdminShell>
    );
  }

  if (!group && !isNew) {
    return (
      <AdminShell
        title="Skills"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Skills", href: "/admin/content/skills" },
          { label: `Group ${index + 1}` },
        ]}
      >
        <SurfaceCard>Skill group not found.</SurfaceCard>
      </AdminShell>
    );
  }

  if (!group && isNew) {
    return (
      <AdminShell
        title="Skills"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Skills", href: "/admin/content/skills" },
          { label: "New group" },
        ]}
      >
        <SurfaceCard>Preparing a new skill group...</SurfaceCard>
      </AdminShell>
    );
  }

  const current = group as SkillGroup;

  return (
    <AdminShell
      title="Skills"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Content", href: "/admin/content" },
        { label: "Skills", href: "/admin/content/skills" },
        { label: `Group ${index + 1}` },
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
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Group {index + 1}
          </p>
          <Button variant="secondary" onClick={removeSkillGroup}>
            Remove
          </Button>
        </div>
        <input
          className="mt-3 w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
          placeholder="Group title"
          value={current.title}
          onChange={(event) => updateSkillGroup({ title: event.target.value })}
        />
        <div className="mt-3 flex flex-col gap-2">
          <ListInput
            value={current.items}
            placeholder="Items (comma or line separated)"
            onCommit={(next) => updateSkillGroup({ items: next })}
          />
          <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Use commas or new lines to separate items.
          </p>
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
