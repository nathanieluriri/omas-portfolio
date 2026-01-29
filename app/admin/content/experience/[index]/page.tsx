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

export default function ExperienceEditorPage() {
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
  const index = isNew ? (data.experience?.length ?? 0) : Number(rawIndex);
  const entry = data.experience?.[index];

  useEffect(() => {
    if (!isNew || createdRef.current) return;
    createdRef.current = true;
    const next = [
      ...(data.experience ?? []),
      { date: "", role: "", company: "", description: "", highlights: [] },
    ];
    setDraft({ ...data, experience: next });
    router.replace(`/admin/content/experience/${next.length - 1}`);
  }, [data, isNew, router, setDraft]);

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

  if (!entry && !isNew) {
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

  if (!entry && isNew) {
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
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
            placeholder="Role"
            value={current.role}
            onChange={(event) => updateExperience({ role: event.target.value })}
          />
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
            placeholder="Company"
            value={current.company}
            onChange={(event) => updateExperience({ company: event.target.value })}
          />
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
            placeholder="Date"
            value={current.date}
            onChange={(event) => updateExperience({ date: event.target.value })}
          />
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
            placeholder="Company link"
            value={current.link ?? ""}
            onChange={(event) => updateExperience({ link: event.target.value })}
          />
        </div>
        <textarea
          className="mt-3 min-h-[80px] w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
          placeholder="Description"
          value={current.description ?? ""}
          onChange={(event) => updateExperience({ description: event.target.value })}
        />
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
