"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import AdminShell from "../components/AdminShell";
import Button from "../components/Button";
import SurfaceCard from "../components/SurfaceCard";
import usePortfolioDraft from "../hooks/usePortfolioDraft";
import type {
  ContactEntry,
  ExperienceEntry,
  PortfolioOut,
  ProjectEntry,
  SkillGroup,
} from "../../../lib/types";
import DraftBar from "../../components/admin/DraftBar";
import CaseStudyEditor from "../../components/admin/CaseStudyEditor";

function emptyPortfolio(): PortfolioOut {
  return {
    navItems: [],
    hero: { name: "", title: "", bio: [], availability: { label: "", status: "" } },
    experience: [],
    projects: [],
    skillGroups: [],
    contacts: [],
    footer: { copyright: "", tagline: "" },
    resumeUrl: "/resume.pdf",
  };
}

function parseList(value: string) {
  return value
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function ListInput({
  value,
  placeholder,
  onCommit,
}: {
  value?: string[];
  placeholder: string;
  onCommit: (next: string[]) => void;
}) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText((value ?? []).join(", "));
  }, [value]);

  return (
    <input
      className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
      placeholder={placeholder}
      value={text}
      onChange={(event) => setText(event.target.value)}
      onBlur={() => onCommit(parseList(text))}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onCommit(parseList(text));
        }
      }}
    />
  );
}

function SectionCard({
  id,
  title,
  expanded,
  onToggle,
  changed,
  actions,
  children,
}: {
  id: string;
  title: string;
  expanded: boolean;
  onToggle: () => void;
  changed: boolean;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div id={id}>
      <SurfaceCard>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          id={id}
          type="button"
          onClick={onToggle}
          className="flex items-center gap-3 text-left"
          aria-expanded={expanded}
        >
          <span
            className={`text-lg font-semibold transition-transform duration-200 ${
              expanded ? "rotate-0" : "-rotate-90"
            }`}
          >
            ▾
          </span>
          <span className="text-lg font-semibold">{title}</span>
          {changed ? (
            <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)]" />
          ) : null}
        </button>
        {expanded ? actions : null}
      </div>
      {expanded ? <div className="mt-4">{children}</div> : null}
      </SurfaceCard>
    </div>
  );
}

export default function ContentEditorPage() {
  const {
    draft,
    portfolio,
    setDraft,
    loading,
    saving,
    error,
    save,
    discard,
    hasChanges,
  } = usePortfolioDraft();

  const data = useMemo(() => draft ?? emptyPortfolio(), [draft]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    hero: true,
    experience: false,
    projects: false,
    skills: false,
    contacts: false,
    navigation: false,
    footer: false,
  });

  useEffect(() => {
    const stored = window.localStorage.getItem("admin-content-sections");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Record<string, boolean>;
        setExpanded((prev) => ({ ...prev, ...parsed }));
      } catch {
        // ignore invalid storage
      }
    }
  }, []);

  const toggleSection = (key: string) => {
    setExpanded((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      window.localStorage.setItem("admin-content-sections", JSON.stringify(next));
      return next;
    });
  };

  const sectionChanged = (key: keyof PortfolioOut) => {
    if (!portfolio) return !!draft;
    return JSON.stringify(draft?.[key]) !== JSON.stringify(portfolio?.[key]);
  };

  const updateHero = (field: string, value: string | string[]) => {
    setDraft({
      ...data,
      hero: {
        ...data.hero,
        [field]: value,
      },
    });
  };

  const updateAvailability = (field: string, value: string) => {
    setDraft({
      ...data,
      hero: {
        ...data.hero,
        availability: {
          ...data.hero?.availability,
          [field]: value,
        },
      },
    });
  };

  const updateExperience = (index: number, next: Partial<ExperienceEntry>) => {
    const list = [...(data.experience ?? [])];
    list[index] = { ...list[index], ...next };
    setDraft({ ...data, experience: list });
  };

  const updateProjects = (index: number, next: Partial<ProjectEntry>) => {
    const list = [...(data.projects ?? [])];
    list[index] = { ...list[index], ...next };
    setDraft({ ...data, projects: list });
  };

  const updateSkillGroup = (index: number, next: Partial<SkillGroup>) => {
    const list = [...(data.skillGroups ?? [])];
    list[index] = { ...list[index], ...next };
    setDraft({ ...data, skillGroups: list });
  };

  const updateContact = (index: number, next: Partial<ContactEntry>) => {
    const list = [...(data.contacts ?? [])];
    list[index] = { ...list[index], ...next };
    setDraft({ ...data, contacts: list });
  };

  const updateNavItem = (index: number, key: "label" | "href", value: string) => {
    const list = [...(data.navItems ?? [])];
    list[index] = { ...list[index], [key]: value };
    setDraft({ ...data, navItems: list });
  };

  const addExperience = () => {
    setDraft({
      ...data,
      experience: [
        ...(data.experience ?? []),
        { date: "", role: "", company: "", description: "", highlights: [] },
      ],
    });
  };

  const addProject = () => {
    setDraft({
      ...data,
      projects: [
        ...(data.projects ?? []),
        { title: "", description: "", link: "", tags: [], caseStudy: undefined },
      ],
    });
  };

  const addSkillGroup = () => {
    setDraft({
      ...data,
      skillGroups: [...(data.skillGroups ?? []), { title: "", items: [] }],
    });
  };

  const addContact = () => {
    setDraft({
      ...data,
      contacts: [
        ...(data.contacts ?? []),
        { label: "", value: "", href: "", icon: "" },
      ],
    });
  };

  const addNavItem = () => {
    setDraft({
      ...data,
      navItems: [...(data.navItems ?? []), { label: "", href: "" }],
    });
  };

  const removeExperience = (index: number) => {
    const list = [...(data.experience ?? [])];
    list.splice(index, 1);
    setDraft({ ...data, experience: list });
  };

  const removeProject = (index: number) => {
    const list = [...(data.projects ?? [])];
    list.splice(index, 1);
    setDraft({ ...data, projects: list });
  };

  const removeSkillGroup = (index: number) => {
    const list = [...(data.skillGroups ?? [])];
    list.splice(index, 1);
    setDraft({ ...data, skillGroups: list });
  };

  const removeContact = (index: number) => {
    const list = [...(data.contacts ?? [])];
    list.splice(index, 1);
    setDraft({ ...data, contacts: list });
  };

  const removeNavItem = (index: number) => {
    const list = [...(data.navItems ?? [])];
    list.splice(index, 1);
    setDraft({ ...data, navItems: list });
  };

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
      <DraftBar
        visible={hasChanges}
        saving={saving}
        onSave={save}
        onDiscard={discard}
      />
      {error ? (
        <SurfaceCard className="border border-red-500/30 bg-red-500/10 text-red-100">
          {error}
        </SurfaceCard>
      ) : null}

      <SectionCard
        id="hero"
        title="Hero"
        expanded={expanded.hero}
        onToggle={() => toggleSection("hero")}
        changed={sectionChanged("hero")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
            placeholder="Name"
            value={data.hero?.name ?? ""}
            onChange={(event) => updateHero("name", event.target.value)}
          />
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
            placeholder="Title"
            value={data.hero?.title ?? ""}
            onChange={(event) => updateHero("title", event.target.value)}
          />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
            placeholder="Availability label"
            value={data.hero?.availability?.label ?? ""}
            onChange={(event) => updateAvailability("label", event.target.value)}
          />
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
            placeholder="Availability status"
            value={data.hero?.availability?.status ?? ""}
            onChange={(event) => updateAvailability("status", event.target.value)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {(data.hero?.bio ?? []).map((paragraph, index) => (
            <div key={index} className="flex flex-col gap-2">
              <textarea
                className="min-h-[80px] w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
                placeholder={`Bio paragraph ${index + 1}`}
                value={paragraph}
                onChange={(event) => {
                  const next = [...(data.hero?.bio ?? [])];
                  next[index] = event.target.value;
                  updateHero("bio", next);
                }}
              />
              <div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const next = [...(data.hero?.bio ?? [])];
                    next.splice(index, 1);
                    updateHero("bio", next);
                  }}
                >
                  Remove paragraph
                </Button>
              </div>
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={() => updateHero("bio", [...(data.hero?.bio ?? []), ""])}
          >
            Add paragraph
          </Button>
        </div>
      </SectionCard>

      <SectionCard
        id="experience"
        title="Experience"
        expanded={expanded.experience}
        onToggle={() => toggleSection("experience")}
        changed={sectionChanged("experience")}
        actions={
          <Button variant="secondary" onClick={addExperience}>
            Add role
          </Button>
        }
      >
        <div className="flex flex-col gap-6">
          {(data.experience ?? []).map((entry, index) => (
            <div
              key={`${entry.role}-${index}`}
              className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Role {index + 1}
                </p>
                <Button variant="secondary" onClick={() => removeExperience(index)}>
                  Remove
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                  placeholder="Role"
                  value={entry.role}
                  onChange={(event) =>
                    updateExperience(index, { role: event.target.value })
                  }
                />
                <input
                  className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                  placeholder="Company"
                  value={entry.company}
                  onChange={(event) =>
                    updateExperience(index, { company: event.target.value })
                  }
                />
                <input
                  className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                  placeholder="Date"
                  value={entry.date}
                  onChange={(event) =>
                    updateExperience(index, { date: event.target.value })
                  }
                />
                <input
                  className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                  placeholder="Company link"
                  value={entry.link ?? ""}
                  onChange={(event) =>
                    updateExperience(index, { link: event.target.value })
                  }
                />
              </div>
              <textarea
                className="mt-3 min-h-[80px] w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                placeholder="Description"
                value={entry.description ?? ""}
                onChange={(event) =>
                  updateExperience(index, { description: event.target.value })
                }
              />
              <div className="mt-3 flex flex-col gap-2">
                {(entry.highlights ?? []).map((highlight, highlightIndex) => (
                  <div key={highlightIndex} className="flex flex-wrap items-center gap-2">
                    <input
                      className="flex-1 rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                      placeholder={`Highlight ${highlightIndex + 1}`}
                      value={highlight}
                      onChange={(event) => {
                        const next = [...(entry.highlights ?? [])];
                        next[highlightIndex] = event.target.value;
                        updateExperience(index, { highlights: next });
                      }}
                    />
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const next = [...(entry.highlights ?? [])];
                        next.splice(highlightIndex, 1);
                        updateExperience(index, { highlights: next });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="secondary"
                  onClick={() =>
                    updateExperience(index, {
                      highlights: [...(entry.highlights ?? []), ""],
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
                    checked={entry.current ?? false}
                    onChange={(event) =>
                      updateExperience(index, { current: event.target.checked })
                    }
                  />
                  Current role
                </label>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        id="projects"
        title="Projects"
        expanded={expanded.projects}
        onToggle={() => toggleSection("projects")}
        changed={sectionChanged("projects")}
        actions={
          <Button variant="secondary" onClick={addProject}>
            Add project
          </Button>
        }
      >
        <div className="flex flex-col gap-6">
          {(data.projects ?? []).map((entry, index) => (
            <div
              key={`${entry.title}-${index}`}
              className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Project {index + 1}
                </p>
                <Button variant="secondary" onClick={() => removeProject(index)}>
                  Remove
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                  placeholder="Title"
                  value={entry.title}
                  onChange={(event) =>
                    updateProjects(index, { title: event.target.value })
                  }
                />
                <input
                  className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                  placeholder="Link"
                  value={entry.link}
                  onChange={(event) =>
                    updateProjects(index, { link: event.target.value })
                  }
                />
              </div>
              <textarea
                className="mt-3 min-h-[80px] w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                placeholder="Description"
                value={entry.description}
                onChange={(event) =>
                  updateProjects(index, { description: event.target.value })
                }
              />
              <div className="mt-3 flex flex-col gap-2">
                <ListInput
                  value={entry.tags}
                  placeholder="Tags (comma or line separated)"
                  onCommit={(next) => updateProjects(index, { tags: next })}
                />
                <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Use commas or new lines to separate tags.
                </p>
              </div>
              <CaseStudyEditor
                caseStudy={entry.caseStudy}
                onUpdate={(next) => updateProjects(index, { caseStudy: next })}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        id="skills"
        title="Skills"
        expanded={expanded.skills}
        onToggle={() => toggleSection("skills")}
        changed={sectionChanged("skillGroups")}
        actions={
          <Button variant="secondary" onClick={addSkillGroup}>
            Add skill group
          </Button>
        }
      >
        <div className="flex flex-col gap-6">
          {(data.skillGroups ?? []).map((group, index) => (
            <div
              key={`${group.title}-${index}`}
              className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Skill group {index + 1}
                </p>
                <Button variant="secondary" onClick={() => removeSkillGroup(index)}>
                  Remove
                </Button>
              </div>
              <input
                className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                placeholder="Group title"
                value={group.title}
                onChange={(event) =>
                  updateSkillGroup(index, { title: event.target.value })
                }
              />
              <div className="mt-3 flex flex-col gap-2">
                <ListInput
                  value={group.items}
                  placeholder="Items (comma or line separated)"
                  onCommit={(next) => updateSkillGroup(index, { items: next })}
                />
                <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Use commas or new lines to separate items.
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        id="contacts"
        title="Contacts"
        expanded={expanded.contacts}
        onToggle={() => toggleSection("contacts")}
        changed={sectionChanged("contacts")}
        actions={
          <Button variant="secondary" onClick={addContact}>
            Add contact
          </Button>
        }
      >
        <div className="flex flex-col gap-6">
          {(data.contacts ?? []).map((contact, index) => (
            <div
              key={`${contact.label}-${index}`}
              className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Contact {index + 1}
                </p>
                <Button variant="secondary" onClick={() => removeContact(index)}>
                  Remove
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                  placeholder="Label"
                  value={contact.label}
                  onChange={(event) =>
                    updateContact(index, { label: event.target.value })
                  }
                />
                <input
                  className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                  placeholder="Value"
                  value={contact.value}
                  onChange={(event) =>
                    updateContact(index, { value: event.target.value })
                  }
                />
                <input
                  className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                  placeholder="Href"
                  value={contact.href}
                  onChange={(event) =>
                    updateContact(index, { href: event.target.value })
                  }
                />
                <input
                  className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                  placeholder="Icon key"
                  value={contact.icon ?? ""}
                  onChange={(event) =>
                    updateContact(index, { icon: event.target.value })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        id="navigation"
        title="Navigation"
        expanded={expanded.navigation}
        onToggle={() => toggleSection("navigation")}
        changed={sectionChanged("navItems")}
        actions={
          <Button variant="secondary" onClick={addNavItem}>
            Add nav item
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          {(data.navItems ?? []).map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Nav item {index + 1}
                </p>
                <Button variant="secondary" onClick={() => removeNavItem(index)}>
                  Remove
                </Button>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
              <input
                className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                placeholder="Label"
                value={item.label}
                onChange={(event) =>
                  updateNavItem(index, "label", event.target.value)
                }
              />
              <input
                className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                placeholder="Href"
                value={item.href}
                onChange={(event) =>
                  updateNavItem(index, "href", event.target.value)
                }
              />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        id="footer"
        title="Footer"
        expanded={expanded.footer}
        onToggle={() => toggleSection("footer")}
        changed={sectionChanged("footer")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
            placeholder="Copyright"
            value={data.footer?.copyright ?? ""}
            onChange={(event) =>
              setDraft({
                ...data,
                footer: { ...data.footer, copyright: event.target.value },
              })
            }
          />
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
            placeholder="Tagline"
            value={data.footer?.tagline ?? ""}
            onChange={(event) =>
              setDraft({
                ...data,
                footer: { ...data.footer, tagline: event.target.value },
              })
            }
          />
        </div>
      </SectionCard>
    </AdminShell>
  );
}
