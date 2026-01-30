"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "../../../components/AdminShell";
import Button from "../../../components/Button";
import SurfaceCard from "../../../components/SurfaceCard";
import DraftBar from "../../../../components/admin/DraftBar";
import usePortfolioDraft from "../../../hooks/usePortfolioDraft";
import { emptyPortfolio } from "../../utils";
import type { ExperienceEntry } from "../../../../../lib/types";
import AiFieldSuggestion from "../../../../components/admin/ai-suggestions/AiFieldSuggestion";

export default function ExperienceEditorPage() {
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
    discard,
    hasChanges,
  } = usePortfolioDraft();

  const data = draft ?? emptyPortfolio();
  const isNew = rawIndex === "new";
  const list = data.experience ?? [];
  const parsedIndex = Number(rawIndex);
  useEffect(() => {
    if (!isNew || loading) return;
    if (newIndexRef.current === null) {
      newIndexRef.current = list.length;
    }
  }, [isNew, list.length, loading]);

  const index = isNew ? (newIndexRef.current ?? list.length) : parsedIndex;
  const entry = list[index];
  const invalidIndex = Number.isNaN(index) || index < 0;
  const shouldCreate =
    !loading && !createdRef.current && !invalidIndex && (isNew || (!entry && index === list.length));
  const awaitingCreation =
    !loading && !invalidIndex && !entry && (isNew || index === list.length);

  useEffect(() => {
    if (!shouldCreate) return;
    createdRef.current = true;
    const next = [
      ...list,
      { date: "", role: "", company: "", description: "", highlights: [] },
    ];
    setDraft({ ...data, experience: next });
  }, [data, list, setDraft, shouldCreate]);

  useEffect(() => {
    if (loading || !invalidIndex) return;
    router.push("/admin/content/experience");
  }, [invalidIndex, loading, router]);

  const updateExperience = (next: Partial<ExperienceEntry>) => {
    const list = [...(data.experience ?? [])];
    list[index] = { ...list[index], ...next };
    setDraft({ ...data, experience: list });
  };

  const removeExperience = () => {
    const list = [...(data.experience ?? [])];
    list.splice(index, 1);
    setDraft({ ...data, experience: list });
    router.push("/admin/content/experience");
  };

  if (loading) {
    return (
      <AdminShell
        title="Experience"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Experience", href: "/admin/content/experience" },
          { label: `Role ${index + 1}` },
        ]}
      >
        <SurfaceCard>Loading portfolio...</SurfaceCard>
      </AdminShell>
    );
  }

  if (invalidIndex) {
    return (
      <AdminShell
        title="Experience"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Experience", href: "/admin/content/experience" },
          { label: "Invalid role" },
        ]}
      >
        <SurfaceCard>Invalid role.</SurfaceCard>
      </AdminShell>
    );
  }

  if (!entry && !awaitingCreation) {
    return (
      <AdminShell
        title="Experience"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Experience", href: "/admin/content/experience" },
          { label: `Role ${index + 1}` },
        ]}
      >
        <SurfaceCard>Role not found.</SurfaceCard>
      </AdminShell>
    );
  }

  if (!entry && awaitingCreation) {
    return (
      <AdminShell
        title="Experience"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Experience", href: "/admin/content/experience" },
          { label: "New role" },
        ]}
      >
        <SurfaceCard>Preparing a new role...</SurfaceCard>
      </AdminShell>
    );
  }

  const current = entry as ExperienceEntry;

  return (
    <AdminShell
      title="Experience"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Content", href: "/admin/content" },
        { label: "Experience", href: "/admin/content/experience" },
        { label: `Role ${index + 1}` },
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
            Role {index + 1}
          </p>
          <Button variant="secondary" onClick={removeExperience}>
            Remove
          </Button>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <input
              className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
              placeholder="Role"
              value={current.role}
              onChange={(event) => updateExperience({ role: event.target.value })}
            />
            <AiFieldSuggestion
              targetPath={`experience[${index}].role`}
              currentValue={current.role}
              onApply={(value) => updateExperience({ role: value })}
              label="Role"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
              placeholder="Company"
              value={current.company}
              onChange={(event) => updateExperience({ company: event.target.value })}
            />
            <AiFieldSuggestion
              targetPath={`experience[${index}].company`}
              currentValue={current.company}
              onApply={(value) => updateExperience({ company: value })}
              label="Company"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
              placeholder="Date"
              value={current.date}
              onChange={(event) => updateExperience({ date: event.target.value })}
            />
            <AiFieldSuggestion
              targetPath={`experience[${index}].date`}
              currentValue={current.date}
              onApply={(value) => updateExperience({ date: value })}
              label="Date"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
              placeholder="Company link"
              value={current.link ?? ""}
              onChange={(event) => updateExperience({ link: event.target.value })}
            />
            <AiFieldSuggestion
              targetPath={`experience[${index}].link`}
              currentValue={current.link ?? ""}
              onApply={(value) => updateExperience({ link: value })}
              label="Company link"
            />
          </div>
        </div>
        <div className="mt-3 flex gap-3">
          <textarea
            className="min-h-[80px] w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
            placeholder="Description"
            value={current.description ?? ""}
            onChange={(event) => updateExperience({ description: event.target.value })}
          />
          <AiFieldSuggestion
            targetPath={`experience[${index}].description`}
            currentValue={current.description ?? ""}
            onApply={(value) => updateExperience({ description: value })}
            label="Description"
          />
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {(current.highlights ?? []).map((highlight, highlightIndex) => (
            <div key={highlightIndex} className="flex flex-wrap items-center gap-2">
              <input
                className="flex-1 rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                placeholder={`Highlight ${highlightIndex + 1}`}
                value={highlight}
                onChange={(event) => {
                  const next = [...(current.highlights ?? [])];
                  next[highlightIndex] = event.target.value;
                  updateExperience({ highlights: next });
                }}
              />
              <AiFieldSuggestion
                targetPath={`experience[${index}].highlights[${highlightIndex}]`}
                currentValue={highlight}
                onApply={(value) => {
                  const next = [...(current.highlights ?? [])];
                  next[highlightIndex] = value;
                  updateExperience({ highlights: next });
                }}
                label={`Highlight ${highlightIndex + 1}`}
              />
              <Button
                variant="secondary"
                onClick={() => {
                  const next = [...(current.highlights ?? [])];
                  next.splice(highlightIndex, 1);
                  updateExperience({ highlights: next });
                }}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={() =>
              updateExperience({
                highlights: [...(current.highlights ?? []), ""],
              })
            }
          >
            Add highlight
          </Button>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-muted)]">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={current.current ?? false}
              onChange={(event) => updateExperience({ current: event.target.checked })}
            />
            Current role
          </label>
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
