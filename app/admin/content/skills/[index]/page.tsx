"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "../../../components/AdminShell";
import Button from "../../../components/Button";
import SurfaceCard from "../../../components/SurfaceCard";
import DraftBar from "../../../../components/admin/DraftBar";
import usePortfolioDraft from "../../../hooks/usePortfolioDraft";
import { emptyPortfolio, parseList } from "../../utils";
import ListInput from "../../components/ListInput";
import type { SkillGroup } from "../../../../../lib/types";
import AiFieldSuggestion from "../../../../components/admin/ai-suggestions/AiFieldSuggestion";

export default function SkillGroupEditorPage() {
  const router = useRouter();
  const params = useParams<{ index: string }>();
  const rawIndex = params.index;
  const createdRef = useRef(false);
  const newIndexRef = useRef<number | null>(null);
  const {
    draft,
    setDraft,
    loading,
    saving,
    error,
    save,
    saveDraft,
    discard,
    hasChanges,
  } = usePortfolioDraft();

  const data = draft ?? emptyPortfolio();
  const isNew = rawIndex === "new";
  const list = data.skillGroups ?? [];
  const parsedIndex = Number(rawIndex);
  useEffect(() => {
    if (!isNew || loading) return;
    if (newIndexRef.current === null) {
      newIndexRef.current = list.length;
    }
  }, [isNew, list.length, loading]);

  const index = isNew ? (newIndexRef.current ?? list.length) : parsedIndex;
  const group = list[index];
  const invalidIndex = Number.isNaN(index) || index < 0;
  const shouldCreate =
    !loading && !createdRef.current && !invalidIndex && (isNew || (!group && index === list.length));
  const awaitingCreation =
    !loading && !invalidIndex && !group && (isNew || index === list.length);

  useEffect(() => {
    if (!shouldCreate) return;
    createdRef.current = true;
    const next = [...list, { title: "", items: [] }];
    setDraft({ ...data, skillGroups: next });
  }, [data, list, setDraft, shouldCreate]);

  useEffect(() => {
    if (loading || !invalidIndex) return;
    router.push("/admin/content/skills");
  }, [invalidIndex, loading, router]);

  const updateSkillGroup = (next: Partial<SkillGroup>) => {
    const list = [...(data.skillGroups ?? [])];
    list[index] = { ...list[index], ...next };
    setDraft({ ...data, skillGroups: list });
  };

  const removeSkillGroup = async () => {
    const list = [...(data.skillGroups ?? [])];
    list.splice(index, 1);
    const next = { ...data, skillGroups: list };
    setDraft(next);
    const saved = await saveDraft(next);
    if (saved) {
      router.push("/admin/content/skills");
    }
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

  if (invalidIndex) {
    return (
      <AdminShell
        title="Skills"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Skills", href: "/admin/content/skills" },
          { label: "Invalid group" },
        ]}
      >
        <SurfaceCard>Invalid skill group.</SurfaceCard>
      </AdminShell>
    );
  }

  if (!group && !awaitingCreation) {
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

  if (!group && awaitingCreation) {
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
  const coerceItems = (value: unknown) => {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string");
    }
    if (typeof value === "string") {
      return parseList(value);
    }
    return null;
  };

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
        <div className="mt-3 flex items-center gap-3">
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
            placeholder="Group title"
            value={current.title}
            onChange={(event) => updateSkillGroup({ title: event.target.value })}
          />
          <AiFieldSuggestion
            targetPath={`skillGroups[${index}].title`}
            currentValue={current.title}
            onApply={(value) => updateSkillGroup({ title: value })}
            label="Group title"
          />
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <ListInput
              value={current.items}
              placeholder="Items (comma or line separated)"
              onCommit={(next) => updateSkillGroup({ items: next })}
            />
            <AiFieldSuggestion
              targetPath={`skillGroups[${index}].items`}
              currentValue={current.items ?? []}
              onApply={(value) => updateSkillGroup({ items: value })}
              coerceValue={coerceItems}
              label="Items"
            />
          </div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Use commas or new lines to separate items.
          </p>
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
