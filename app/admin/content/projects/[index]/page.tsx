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
import type { ProjectEntry } from "../../../../../lib/types";

export default function ProjectEditorPage() {
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
  const index = isNew ? (data.projects?.length ?? 0) : Number(rawIndex);
  const entry = data.projects?.[index];

  useEffect(() => {
    if (!isNew || createdRef.current) return;
    createdRef.current = true;
    const next = [
      ...(data.projects ?? []),
      { title: "", description: "", link: "", tags: [], caseStudy: undefined },
    ];
    setDraft({ ...data, projects: next });
    router.replace(`/admin/content/projects/${next.length - 1}`);
  }, [data, isNew, router, setDraft]);

  const updateProject = (next: Partial<ProjectEntry>) => {
    const list = [...(data.projects ?? [])];
    list[index] = { ...list[index], ...next };
    setDraft({ ...data, projects: list });
  };

  const removeProject = () => {
    const list = [...(data.projects ?? [])];
    list.splice(index, 1);
    setDraft({ ...data, projects: list });
    router.push("/admin/content/projects");
  };

  if (loading) {
    return (
      <AdminShell
        title="Projects"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Projects", href: "/admin/content/projects" },
          { label: `Project ${index + 1}` },
        ]}
      >
        <SurfaceCard>Loading portfolio...</SurfaceCard>
      </AdminShell>
    );
  }

  if (!entry && !isNew) {
    return (
      <AdminShell
        title="Projects"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Projects", href: "/admin/content/projects" },
          { label: `Project ${index + 1}` },
        ]}
      >
        <SurfaceCard>Project not found.</SurfaceCard>
      </AdminShell>
    );
  }

  if (!entry && isNew) {
    return (
      <AdminShell
        title="Projects"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Projects", href: "/admin/content/projects" },
          { label: "New project" },
        ]}
      >
        <SurfaceCard>Preparing a new project...</SurfaceCard>
      </AdminShell>
    );
  }

  const current = entry as ProjectEntry;

  return (
    <AdminShell
      title="Projects"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Content", href: "/admin/content" },
        { label: "Projects", href: "/admin/content/projects" },
        { label: `Project ${index + 1}` },
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
            Project {index + 1}
          </p>
          <Button variant="secondary" onClick={removeProject}>
            Remove
          </Button>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
            placeholder="Title"
            value={current.title}
            onChange={(event) => updateProject({ title: event.target.value })}
          />
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
            placeholder="Link"
            value={current.link}
            onChange={(event) => updateProject({ link: event.target.value })}
          />
        </div>
        <textarea
          className="mt-3 min-h-[80px] w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
          placeholder="Description"
          value={current.description}
          onChange={(event) => updateProject({ description: event.target.value })}
        />
        <div className="mt-3 flex flex-col gap-2">
          <ListInput
            value={current.tags}
            placeholder="Tags (comma or line separated)"
            onCommit={(next) => updateProject({ tags: next })}
          />
          <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Use commas or new lines to separate tags.
          </p>
        </div>
        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={() => router.push(`/admin/content/projects/${index}/case-study`)}
          >
            Edit case study
          </Button>
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
