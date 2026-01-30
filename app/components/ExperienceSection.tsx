"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  type Variants,
  useReducedMotion,
} from "framer-motion";

import PrimaryButton from "./ui/PrimaryButton";

import type { ExperienceEntry } from "../../lib/types";

const fallbackExperience: ExperienceEntry[] = [
  {
    date: "2023 — Present",
    role: "Senior Systems Engineer",
    company: "Nordlane Labs",
    link: "#",
    description:
      "Leading platform architecture across distributed product teams, focusing on reliability, observability, and cost-aware scaling.",
    highlights: [
      "Led reliability practices: SLOs, tracing, and incident playbooks",
      "Built guardrails for launch-ready infrastructure and compliance",
      "Improved cost efficiency via autoscaling + caching strategy",
    ],
    current: true,
  },
  {
    date: "2020 — 2023",
    role: "Staff Backend Engineer",
    company: "Harbor Peak",
    link: "#",
    description:
      "Built multi-region data services, automated compliance pipelines, and guardrails for launch-ready infrastructure.",
    highlights: [
      "Shipped multi-region data services with safe failover patterns",
      "Automated compliance pipelines across environments",
      "Standardized guardrails for teams shipping to prod",
    ],
  },
  {
    date: "2017 — 2020",
    role: "Platform Engineer",
    company: "Eastbridge",
    link: "#",
    description:
      "Delivered core APIs and workflow systems that supported rapid customer onboarding without sacrificing stability.",
    highlights: [
      "Built core APIs and workflow services for onboarding",
      "Improved stability and observability across the stack",
      "Reduced friction in integration + deployment workflows",
    ],
  },
];

interface ExperienceSectionProps {
  experience?: ExperienceEntry[];
  resumeUrl?: string | null;
}

export default function ExperienceSection({
  experience = fallbackExperience,
  resumeUrl = "/resume.pdf",
}: ExperienceSectionProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = () => setIsMobile(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const enableAnimations = !reduceMotion && isMobile === false;


  const container = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: enableAnimations
          ? {
              staggerChildren: 0.12,
              delayChildren: 0.08,
            }
          : {},
      },
    }),
    [enableAnimations]
  );

  const item = useMemo<Variants>(
    () => ({
      hidden: enableAnimations ? { opacity: 0, y: 12 } : { opacity: 1 },
      show: !enableAnimations
        ? { opacity: 1 }
        : {
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, ease: "easeOut" },
          },
    }),
    [enableAnimations]
  );

  return (
    <section id="experience" className="py-24 md:py-28">
      <div className="mx-auto w-full max-w-[960px] px-6 md:px-10">
        <div className="flex flex-col gap-4   ">
          <h2 className="text-[clamp(2rem,3vw,2.25rem)] font-semibold leading-tight text-[var(--text-primary)]">
            Experience
          </h2>

          <div className="w-full md:w-auto ">
            <PrimaryButton
              href={resumeUrl ?? "/resume.pdf"}
              label="Download Resume"
              download
              className="w-full md:w-auto px-4 py-2 text-xs uppercase tracking-[0.18em]"
              style={{ boxShadow: "none", opacity: 0.85 }}
            />
          </div>
        </div>

        <div ref={railRef} className="relative mt-12 grid grid-cols-1 gap-10">
          <div className="pointer-events-none absolute left-1 top-0 h-full w-px bg-[var(--bg-divider)]/40" />
          <motion.div
            variants={container}
            initial={enableAnimations ? "hidden" : "show"}
            whileInView={enableAnimations ? "show" : undefined}
            viewport={enableAnimations ? { once: true, amount: 0.25 } : undefined}
            className="relative pl-12 md:pl-14"
          >
            {experience.map((entry, index) => (
              <ExperienceItem
                key={`${entry.role || "role"}-${entry.company || "company"}-${entry.date || "date"}-${index}`}
                entry={entry}
                index={index}
                item={item}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

interface ExperienceItemProps {
  entry: ExperienceEntry;
  index: number;
  item: Variants;
}

function ExperienceItem({
  entry,
  index,
  item,
}: ExperienceItemProps) {
  const itemRef = useRef<HTMLElement | null>(null);
  const isCurrent = entry.current;
  const dotColor = isCurrent ? "bg-[var(--status-open)]" : "bg-[var(--bg-divider)]/60";
  const bulletColor = isCurrent
    ? "bg-[var(--accent-primary)]/80"
    : "bg-[var(--text-muted)]/40";

  return (
    <motion.article
      ref={itemRef}
      variants={item}
      className="group relative mb-14 last:mb-0"
    >
      <div className="absolute -left-[43px] top-[8px]">
        <span
          className={
            "relative block h-2.5 w-2.5 rounded-full transition-transform duration-200 ease-out group-hover:scale-110 " +
            dotColor
          }
        />
      </div>

      <div className="pl-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
          {entry.date}
        </p>

        <h3
          className={
            "mt-2 text-[1.35rem] font-semibold transition-colors duration-200 ease-out " +
            (isCurrent
              ? "text-[var(--accent-primary)]"
              : "text-[var(--text-primary)] group-hover:text-[var(--text-primary)]")
          }
        >
          {entry.role}
        </h3>

        <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">
          {entry.link ? (
            <a
              href={entry.link}
              className="transition-colors duration-200 ease-out hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
            >
              {entry.company}
            </a>
          ) : (
            <span>{entry.company}</span>
          )}
        </p>

        {entry.highlights?.length ? (
          <ul className="mt-3 max-w-[760px] space-y-2 text-sm leading-[1.55] text-[var(--text-secondary)]">
            {entry.highlights.slice(0, 3).map((highlight, hIndex) => (
              <li key={`${index}-${hIndex}-${highlight}`} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className={`mt-2 h-1.5 w-1.5 flex-none rounded-full ${bulletColor}`}
                />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 max-w-[760px] text-sm leading-[1.55] text-[var(--text-secondary)]">
            {entry.description}
          </p>
        )}
      </div>
    </motion.article>
  );
}
