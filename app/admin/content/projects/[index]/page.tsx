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
import type { ProjectEntry } from "../../../../../lib/types";
import AiFieldSuggestion from "../../../../components/admin/ai-suggestions/AiFieldSuggestion";

export default function ProjectEditorPage() {
  const router = useRouter();
  const params = useParams<{ index: string }>();
  const rawIndex = params.index;
  const createdRef = useRef(false);
  const lastDraftRef = useRef<typeof draft>(null);
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
  const list = data.projects ?? [];
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
    if (draft !== lastDraftRef.current) {
      lastDraftRef.current = draft;
      createdRef.current = false;
    }
  }, [draft]);

  useEffect(() => {
    if (!shouldCreate) return;
    createdRef.current = true;
    const next = [
      ...list,
      { title: "", description: "", link: "", tags: [], caseStudy: undefined },
    ];
    setDraft({ ...data, projects: next });
  }, [data, list, setDraft, shouldCreate]);

  useEffect(() => {
    if (loading || !invalidIndex) return;
    router.push("/admin/content/projects");
  }, [invalidIndex, loading, router]);

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

  if (invalidIndex) {
    return (
      <AdminShell
        title="Projects"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Projects", href: "/admin/content/projects" },
          { label: "Invalid project" },
        ]}
      >
        <SurfaceCard>Invalid project.</SurfaceCard>
      </AdminShell>
    );
  }

  if (!entry && !awaitingCreation) {
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

  if (!entry && awaitingCreation) {
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
  const coerceTags = (value: unknown) => {
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
          <div className="flex items-center gap-3">
            <input
              className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
              placeholder="Title"
              value={current.title}
              onChange={(event) => updateProject({ title: event.target.value })}
            />
            <AiFieldSuggestion
              targetPath={`projects[${index}].title`}
              currentValue={current.title}
              onApply={(value) => updateProject({ title: value })}
              label="Title"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
              placeholder="Link"
              value={current.link}
              onChange={(event) => updateProject({ link: event.target.value })}
            />
            <AiFieldSuggestion
              targetPath={`projects[${index}].link`}
              currentValue={current.link}
              onApply={(value) => updateProject({ link: value })}
              label="Link"
            />
          </div>
        </div>
        <div className="mt-3 flex gap-3">
          <textarea
            className="min-h-[80px] w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
            placeholder="Description"
            value={current.description}
            onChange={(event) => updateProject({ description: event.target.value })}
          />
          <AiFieldSuggestion
            targetPath={`projects[${index}].description`}
            currentValue={current.description}
            onApply={(value) => updateProject({ description: value })}
            label="Description"
          />
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <ListInput
              value={current.tags}
              placeholder="Tags (comma or line separated)"
              onCommit={(next) => updateProject({ tags: next })}
            />
            <AiFieldSuggestion
              targetPath={`projects[${index}].tags`}
              currentValue={current.tags ?? []}
              onApply={(value) => updateProject({ tags: value })}
              coerceValue={coerceTags}
              label="Tags"
            />
          </div>
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
