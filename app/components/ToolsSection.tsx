import type { SkillGroup as SkillGroupType } from "../../lib/types";
import SkillChip from "./ui/SkillChip";

const fallbackSkillGroups: SkillGroupType[] = [
  {
    title: "Languages & Frameworks",
    items: [
      "TypeScript",
      "Go",
      "Python",
      "Node.js",
      "Next.js",
      "React",
      "PostgreSQL",
      "GraphQL",
    ],
  },
  {
    title: "Infrastructure & Tools",
    items: [
      "Docker",
      "Kubernetes",
      "Terraform",
      "AWS",
      "Vercel",
      "GitHub Actions",
      "Redis",
      "Observability",
    ],
  },
];

function SkillGroup({
  title,
  items,
  delay,
}: {
  title: string;
  items?: string[];
  delay: string;
}) {
  return (
    <div
      className="flex flex-col gap-4 motion-safe:animate-[fade-up_0.7s_ease-out]"
      style={{ animationDelay: delay }}
    >
      <h3 className="text-[1.25rem] font-semibold text-[var(--text-primary)]">
        {title}
      </h3>
      <div className="flex flex-wrap gap-3">
        {(items ?? []).map((item) => (
          <SkillChip key={item} label={item} />
        ))}
      </div>
    </div>
  );
}

interface ToolsSectionProps {
  skillGroups?: SkillGroupType[];
}

export default function ToolsSection({
  skillGroups = fallbackSkillGroups,
}: ToolsSectionProps) {
  return (
    <section className="py-24 md:py-28" id="tools">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-6 md:px-10 motion-safe:animate-[fade-up_0.7s_ease-out]">
        <h2 className="text-[clamp(2rem,3vw,2.25rem)] font-semibold leading-tight text-[var(--text-primary)]">
          Tools &amp; Skills
        </h2>
        <div className="grid gap-10 md:grid-cols-2">
          {skillGroups.map((group, index) => (
            <SkillGroup
              key={group.title}
              {...group}
              delay={`${140 + index * 120}ms`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
