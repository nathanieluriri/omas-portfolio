import type { ProjectEntry } from "../../lib/types";
import { getProjectHref } from "../../lib/projects";
import InlineLink from "./ui/InlineLink";
import Tag from "./ui/Tag";

const fallbackProjects: ProjectEntry[] = [
  {
    title: "SignalForge Analytics",
    tags: ["Observability", "SaaS", "B2B"],
    description:
      "A real-time ops console that turns raw telemetry into actionable incident playbooks across multi-tenant fleets.",
    link: "#",
  },
  {
    title: "Mesa Fintech Core",
    tags: ["Payments", "API", "Risk"],
    description:
      "A modular payments stack with adaptive risk scoring, compliance hooks, and transparent audit trails.",
    link: "#",
  },
  {
    title: "Atlas Field Ops",
    tags: ["Logistics", "Platform", "Mobile"],
    description:
      "A dispatch platform that aligns warehouse, fleet, and customer systems with predictable SLAs.",
    link: "#",
  },
  {
    title: "Pulse Studio",
    tags: ["Product", "Design Systems"],
    description:
      "A design-engineering workflow tool that keeps component inventories aligned with shipped UI.",
    link: "#",
  },
  {
    title: "Orion Data Relay",
    tags: ["Streaming", "Infrastructure"],
    description:
      "An event routing backbone optimized for multi-region latency and graceful degradation.",
    link: "#",
  },
  {
    title: "Driftline Commerce",
    tags: ["Ecommerce", "Personalization"],
    description:
      "A personalization engine that blends merchandising intent with behavioral signals at scale.",
    link: "#",
  },
];

interface ProjectsSectionProps {
  projects?: ProjectEntry[];
}

export default function ProjectsSection({
  projects = fallbackProjects,
}: ProjectsSectionProps) {
  return (
    <section id="work" className="py-24 md:py-28">
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-10 px-6 md:px-10 motion-safe:animate-[fade-up_0.7s_ease-out]">
        <h2 className="text-[clamp(2rem,3vw,2.25rem)] font-semibold leading-tight text-[var(--text-primary)]">
          Selected Work
        </h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
          {projects.map((project, index) => {
            const href = getProjectHref(project);

            return (
              <article
                key={project.title}
                className="group flex h-full flex-col gap-4 rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-6 transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-[var(--bg-surface-hover)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.25)] motion-safe:animate-[fade-up_0.7s_ease-out]"
                style={{ animationDelay: `${120 + index * 70}ms` }}
              >
                <div className="flex flex-wrap gap-2">
                  {(project.tags ?? []).map((tag) => (
                    <Tag key={tag} label={tag} />
                  ))}
                </div>
                <h3 className="text-[1.25rem] font-semibold text-[var(--text-primary)]">
                  {project.title}
                </h3>
                <p className="text-sm leading-6 text-[var(--text-secondary)]">
                  {project.description}
                </p>
                {href ? <InlineLink href={href} label="View details" /> : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
