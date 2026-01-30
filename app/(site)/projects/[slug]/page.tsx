import { notFound } from "next/navigation";

import {
  getProjectExternalLink,
  getProjectSlug,
} from "../../../../lib/projects";
import { fetchPortfolioLive } from "../../../../lib/server/portfolio";
import RichParagraph from "../../../components/ui/RichParagraph";

function splitParagraphs(text?: string | null) {
  if (!text) {
    return [];
  }
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const portfolio = await fetchPortfolioLive();
  const projects = portfolio?.projects ?? [];
  const targetSlug = (slug ?? "").trim().toLowerCase();
  if (!targetSlug) {
    notFound();
  }
  const entries = projects
    .map((project, index) => ({
      project,
      slug: getProjectSlug(project)?.toLowerCase() ?? null,
      index,
    }))
    .filter(
      (entry): entry is { project: (typeof projects)[number]; slug: string; index: number } =>
        Boolean(entry.slug),
    );

  const currentIndex = entries.findIndex((entry) => entry.slug === targetSlug);
  if (currentIndex === -1) {
    notFound();
  }

  const current = entries[currentIndex];
  const previous = currentIndex > 0 ? entries[currentIndex - 1] : null;
  const next = currentIndex < entries.length - 1 ? entries[currentIndex + 1] : null;
  const project = current.project;
  const caseStudy = project.caseStudy ?? {};

  const overviewText = caseStudy.overview?.trim() || project.description;
  const overviewParagraphs = splitParagraphs(overviewText);
  const goalText = caseStudy.goal?.trim();
  const roleTitle = caseStudy.role?.title?.trim();
  const roleBullets = (caseStudy.role?.bullets ?? []).filter((bullet) => bullet.trim());
  const screenshots = (caseStudy.screenshots ?? []).filter((shot) => shot.src?.trim());
  const outcomes = (caseStudy.outcomes ?? []).filter((outcome) => outcome.trim());
  const externalLink = getProjectExternalLink(project);
  const shouldShowRoleTitle =
    Boolean(roleTitle) && (roleBullets.length > 0 || roleTitle !== "Full-Stack Engineer");

  return (
    <div className="mx-auto w-full max-w-[960px] px-6 pb-24 pt-16 md:px-10 md:pb-28 md:pt-20">
      <div
        className="flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--text-muted)] motion-safe:animate-[fade-up_0.7s_ease-out]"
        style={{ animationDelay: "60ms" }}
      >
        <a
          href="/work"
          className="inline-flex items-center gap-2 transition-colors duration-200 ease-out hover:text-[var(--text-secondary)]"
        >
          <span aria-hidden="true">←</span>
          Back to work
        </a>
        <div className="flex items-center gap-3">
          {previous ? (
            <a
              href={`/projects/${previous.slug}`}
              aria-label={`Previous project: ${previous.project.title}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--bg-divider)] bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:text-[var(--text-secondary)]"
            >
              ←
            </a>
          ) : null}
          {next ? (
            <a
              href={`/projects/${next.slug}`}
              aria-label={`Next project: ${next.project.title}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--bg-divider)] bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:text-[var(--text-secondary)]"
            >
              →
            </a>
          ) : null}
        </div>
      </div>

      <div
        className="mt-10 flex flex-wrap items-start justify-between gap-6 motion-safe:animate-[fade-up_0.7s_ease-out]"
        style={{ animationDelay: "140ms" }}
      >
        <h1 className="text-[clamp(2.5rem,5vw,3.6rem)] font-semibold leading-[1.05] text-[var(--text-primary)]">
          {project.title}
        </h1>
        {externalLink ? (
          <a
            href={externalLink}
            className="inline-flex items-center gap-2 rounded-full border border-transparent bg-[var(--accent-primary)] px-5 py-2 text-sm font-semibold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5"
          >
            Visit Project <span aria-hidden="true">→</span>
          </a>
        ) : null}
      </div>

      {overviewParagraphs.length > 0 ? (
        <section
          className="mt-14 flex flex-col gap-5 motion-safe:animate-[fade-up_0.7s_ease-out]"
          style={{ animationDelay: "220ms" }}
        >
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Overview</h2>
          <RichParagraph paragraphs={overviewParagraphs} />
        </section>
      ) : null}

      {goalText ? (
        <section
          className="mt-14 motion-safe:animate-[fade-up_0.7s_ease-out]"
          style={{ animationDelay: "300ms" }}
        >
          <div className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-6">
            <p className="text-[15px] leading-7 text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">The goal:</span>{" "}
              {goalText}
            </p>
          </div>
        </section>
      ) : null}

      {shouldShowRoleTitle || roleBullets.length > 0 ? (
        <section
          className="mt-14 flex flex-col gap-5 motion-safe:animate-[fade-up_0.7s_ease-out]"
          style={{ animationDelay: "380ms" }}
        >
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Role</h2>
          {shouldShowRoleTitle ? (
            <p className="text-sm font-medium italic text-[var(--accent-primary)]">
              {roleTitle}
            </p>
          ) : null}
          {roleBullets.length > 0 ? (
            <ul className="space-y-3 text-[15px] leading-7 text-[var(--text-secondary)]">
              {roleBullets.map((bullet) => (
                <li
                  key={bullet}
                  className="relative pl-5 before:absolute before:left-0 before:top-[0.5rem] before:h-2 before:w-2 before:rounded-full before:bg-[var(--accent-primary)]"
                >
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {screenshots.length > 0 ? (
        <section
          className="mt-14 flex flex-col gap-8 motion-safe:animate-[fade-up_0.7s_ease-out]"
          style={{ animationDelay: "460ms" }}
        >
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Project Screenshots
          </h2>
          <div className="flex flex-col gap-12">
            {screenshots.map((shot, index) => (
              <figure
                key={shot.src}
                className="flex flex-col gap-3 motion-safe:animate-[fade-up_0.7s_ease-out]"
                style={{ animationDelay: `${520 + index * 90}ms` }}
              >
                <div className="overflow-hidden rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center gap-2 border-b border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-3">
                    <span className="h-2 w-2 rounded-full bg-[var(--bg-divider)]" />
                    <span className="h-2 w-2 rounded-full bg-[var(--bg-divider)]" />
                    <span className="h-2 w-2 rounded-full bg-[var(--bg-divider)]" />
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={shot.src}
                    alt={shot.alt?.trim() || `${project.title} screenshot ${index + 1}`}
                    loading="lazy"
                    className="h-auto w-full"
                  />
                </div>
                {shot.caption ? (
                  <figcaption className="text-xs text-[var(--text-muted)]">
                    {shot.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {outcomes.length > 0 ? (
        <section
          className="mt-14 flex flex-col gap-5 motion-safe:animate-[fade-up_0.7s_ease-out]"
          style={{ animationDelay: "620ms" }}
        >
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Outcomes</h2>
          <ul className="space-y-3 text-[15px] leading-7 text-[var(--text-secondary)]">
            {outcomes.map((outcome) => (
              <li
                key={outcome}
                className="relative pl-5 before:absolute before:left-0 before:top-[0.5rem] before:h-2 before:w-2 before:rounded-full before:bg-[var(--accent-primary)]"
              >
                {outcome}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-16 border-t border-[var(--bg-divider)] pt-8">
        {next ? (
          <a
            href={`/projects/${next.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition-colors duration-200 ease-out hover:text-[var(--text-primary)]"
          >
            Next Project <span aria-hidden="true">→</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
