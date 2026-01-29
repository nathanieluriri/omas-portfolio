"use client";

import Link from "next/link";
import AdminShell from "../components/AdminShell";
import SurfaceCard from "../components/SurfaceCard";
import usePortfolioDraft from "../hooks/usePortfolioDraft";
import { emptyPortfolio } from "./utils";

const sections = [
  {
    key: "hero",
    title: "Hero",
    description: "Name, title, bio, availability.",
    href: "/admin/content/hero",
  },
  {
    key: "experience",
    title: "Experience",
    description: "Roles, dates, highlights.",
    href: "/admin/content/experience",
  },
  {
    key: "projects",
    title: "Projects",
    description: "Projects, tags, case studies.",
    href: "/admin/content/projects",
  },
  {
    key: "skills",
    title: "Skills",
    description: "Skill group headings and items.",
    href: "/admin/content/skills",
  },
  {
    key: "contacts",
    title: "Contacts",
    description: "Contact methods and links.",
    href: "/admin/content/contacts",
  },
  {
    key: "navigation",
    title: "Navigation",
    description: "Top-level navigation links.",
    href: "/admin/content/navigation",
  },
  {
    key: "footer",
    title: "Footer",
    description: "Copyright and tagline.",
    href: "/admin/content/footer",
  },
];

export default function ContentOverviewPage() {
  const { draft, loading, error } = usePortfolioDraft();
  const data = draft ?? emptyPortfolio();

  if (loading) {
    return (
      <AdminShell
        title="Content"
        breadcrumb={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Content" }]}
      >
        <SurfaceCard>Loading portfolio...</SurfaceCard>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Content"
      breadcrumb={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Content" }]}
    >
      {error ? (
        <SurfaceCard className="border border-red-500/30 bg-red-500/10 text-red-100">
          {error}
        </SurfaceCard>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <SurfaceCard key={section.key}>
            <div className="flex h-full flex-col justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {section.title}
                </p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  {section.description}
                </p>
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {section.key === "experience" && `${data.experience?.length ?? 0} roles`}
                {section.key === "projects" && `${data.projects?.length ?? 0} projects`}
                {section.key === "skills" && `${data.skillGroups?.length ?? 0} groups`}
                {section.key === "contacts" && `${data.contacts?.length ?? 0} contacts`}
                {section.key === "navigation" && `${data.navItems?.length ?? 0} items`}
              </div>
              <Link
                href={section.href}
                className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)]"
              >
                Edit {section.title}
              </Link>
            </div>
          </SurfaceCard>
        ))}
      </div>
    </AdminShell>
  );
}
