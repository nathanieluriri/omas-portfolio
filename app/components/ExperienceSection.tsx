"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  type Variants,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
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
  const railRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleActive = useCallback((index: number) => {
    setActiveIndex((prev) => (index > prev ? index : prev));
  }, []);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.85", "end 0.35"],
  });

  const railHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const container = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: reduceMotion
          ? {}
          : {
              staggerChildren: 0.12,
              delayChildren: 0.08,
            },
      },
    }),
    [reduceMotion]
  );

  const item = useMemo<Variants>(
    () => ({
      hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 },
      show: reduceMotion
        ? { opacity: 1 }
        : {
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, ease: "easeOut" },
          },
    }),
    [reduceMotion]
  );

  return (
    <section id="experience" className="py-24 md:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-[clamp(2rem,3vw,2.25rem)] font-semibold leading-tight text-[var(--text-primary)]">
            Experience
          </h2>

          <div className="w-full md:w-auto">
            <PrimaryButton
              href={resumeUrl ?? "/resume.pdf"}
              label="Download Resume"
              download
              className="w-full md:w-auto"
            />
          </div>
        </div>

        <div ref={railRef} className="relative mt-10 grid grid-cols-1 gap-8">
          <div className="pointer-events-none absolute left-2 top-0 h-full w-px bg-[var(--bg-divider)]" />

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-2 top-0 w-px origin-top"
            style={{ height: railHeight }}
          >
            <div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(180deg, var(--accent-primary), rgba(255,106,0,0.0))",
              }}
            />
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="relative pl-10"
          >
            {experience.map((entry, index) => (
              <ExperienceItem
                key={`${entry.role}-${entry.company}`}
                entry={entry}
                index={index}
                activeIndex={activeIndex}
                item={item}
                reduceMotion={reduceMotion}
                onActive={handleActive}
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
  activeIndex: number;
  item: Variants;
  reduceMotion: boolean;
  onActive: (index: number) => void;
}

function ExperienceItem({
  entry,
  index,
  activeIndex,
  item,
  reduceMotion,
  onActive,
}: ExperienceItemProps) {
  const itemRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(itemRef, {
    amount: 0.35,
    margin: "-20% 0px -50% 0px",
  });

  useEffect(() => {
    if (isInView) {
      onActive(index);
    }
  }, [index, isInView, onActive]);

  const isActive = index <= activeIndex;

  return (
    <motion.article
      ref={itemRef}
      variants={item}
      className="group relative mb-10 last:mb-0"
    >
      <div className="absolute -left-[34px] top-[10px]">
        <span
          className={
            "relative block h-3.5 w-3.5 rounded-full border-2 border-[var(--bg-primary)] transition-transform duration-200 ease-out group-hover:scale-110 " +
            (isActive ? "bg-[var(--accent-primary)]" : "bg-[var(--bg-divider)]")
          }
        />

        {entry.current && (
          <span
            aria-hidden="true"
            className={
              "absolute inset-0 rounded-full " +
              (reduceMotion ? "" : "animate-[pulse_2.2s_ease-out_infinite]")
            }
            style={{
              boxShadow:
                "0 0 0 6px rgba(255,106,0,0.12), 0 0 18px rgba(255,106,0,0.25)",
            }}
          />
        )}
      </div>

      <div className="rounded-2xl border border-transparent p-4 -ml-4 transition-all duration-200 ease-out group-hover:border-[var(--bg-divider)] group-hover:bg-[var(--bg-surface)]/60">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
          {entry.date}
        </p>

                  <h3 className="mt-2 text-[1.25rem] font-semibold text-[var(--text-primary)]">
                    {entry.role} ·{" "}
                    {entry.link ? (
                      <a
                        href={entry.link}
                        className="text-[var(--text-secondary)] transition-colors duration-200 ease-out hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
                      >
                        {entry.company}
                      </a>
                    ) : (
                      <span className="text-[var(--text-secondary)]">
                        {entry.company}
                      </span>
                    )}
                  </h3>

        {entry.highlights?.length ? (
          <ul className="mt-3 max-w-[760px] space-y-2 text-sm leading-6 text-[var(--text-secondary)]">
            {entry.highlights.slice(0, 3).map((highlight) => (
              <li key={highlight} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[var(--accent-primary)]/70"
                />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 max-w-[760px] text-sm leading-6 text-[var(--text-secondary)]">
            {entry.description}
          </p>
        )}

        <div className="mt-4 h-px w-0 bg-[var(--accent-primary)]/60 transition-all duration-300 ease-out group-hover:w-24" />
      </div>
    </motion.article>
  );
}
