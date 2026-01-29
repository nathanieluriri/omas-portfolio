"use client";

import { useParams } from "next/navigation";
import AdminShell from "../../../../components/AdminShell";
import SurfaceCard from "../../../../components/SurfaceCard";
import DraftBar from "../../../../../components/admin/DraftBar";
import usePortfolioDraft from "../../../../hooks/usePortfolioDraft";
import { emptyPortfolio } from "../../../utils";
import type { CaseStudy } from "../../../../../../lib/types";
import CaseStudyEditor from "../../../../../components/admin/CaseStudyEditor";

export default function ProjectCaseStudyPage() {
  const params = useParams<{ index: string }>();
  const index = Number(params.index);
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
  const entry = data.projects?.[index];
  const current = entry;

  const updateCaseStudy = (next: CaseStudy | undefined) => {
    const list = [...(data.projects ?? [])];
    list[index] = { ...list[index], caseStudy: next };
    setDraft({ ...data, projects: list });
  };

  if (loading) {
    return (
      <AdminShell
        title="Case Study"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Projects", href: "/admin/content/projects" },
          { label: `Project ${index + 1}`, href: `/admin/content/projects/${index}` },
          { label: "Case Study" },
        ]}
      >
        <SurfaceCard>Loading portfolio...</SurfaceCard>
      </AdminShell>
    );
  }

  if (!entry) {
    return (
      <AdminShell
        title="Case Study"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Projects", href: "/admin/content/projects" },
          { label: `Project ${index + 1}`, href: `/admin/content/projects/${index}` },
          { label: "Case Study" },
        ]}
      >
        <SurfaceCard>Project not found.</SurfaceCard>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Case Study"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Content", href: "/admin/content" },
        { label: "Projects", href: "/admin/content/projects" },
        { label: `Project ${index + 1}`, href: `/admin/content/projects/${index}` },
        { label: "Case Study" },
      ]}
    >
      <DraftBar visible={hasChanges} saving={saving} onSave={save} onDiscard={discard} />
      {error ? (
        <SurfaceCard className="border border-red-500/30 bg-red-500/10 text-red-100">
          {error}
        </SurfaceCard>
      ) : null}

      <SurfaceCard>
        <CaseStudyEditor caseStudy={entry.caseStudy} onUpdate={updateCaseStudy} />
      </SurfaceCard>
    </AdminShell>
  );
}
