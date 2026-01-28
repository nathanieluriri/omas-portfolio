import type { HeroSection } from "../../lib/types";
import AvailabilityBadge from "./ui/AvailabilityBadge";
import RichParagraph from "./ui/RichParagraph";

const fallbackBio = [
  "I build portfolio-grade systems with the same care I give production platforms: clear boundaries, reliable interfaces, and a calm experience for whoever inherits the stack next.",
  "My work focuses on designing dependable backends and clean product surfaces that stay readable at scale. I optimize for durability, not noise, with a preference for precise execution and quiet confidence.",
];

interface HeroProps {
  hero?: HeroSection;
  resumeUrl?: string | null;
}

export default function Hero({ hero, resumeUrl }: HeroProps) {
  const availability = hero?.availability;
  return (
    <section id="about" className="pt-24 pb-20 md:pt-28 md:pb-24">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <div
          className="motion-safe:animate-[fade-up_0.7s_ease-out]"
          style={{ animationDelay: "80ms" }}
        >
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
            <h1 className="text-[clamp(2.6rem,4vw,3.5rem)] font-semibold leading-[1.08] text-[var(--text-primary)]">
              {hero?.name ?? "Oma Dashi"}
            </h1>
            <div className="md:mt-2 md:ml-auto">
              <AvailabilityBadge
                label={availability?.label ?? "Open to Work"}
                status={availability?.status ?? "available"}
              />
            </div>
          </div>

          <p className="mt-3 text-[1.05rem] font-medium italic text-[var(--accent-primary)]">
            {hero?.title ?? "Systems Engineer · Product Builder"}
          </p>

          <div className="mt-10 max-w-[740px] md:mt-12">
            <RichParagraph paragraphs={hero?.bio ?? fallbackBio} />
          </div>

          {resumeUrl ? (
            <a
              href={resumeUrl}
              className="mt-8 inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.12em] text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text-primary)]"
            >
              Resume
              <span aria-hidden="true">→</span>
            </a>
          ) : null}

          <div className="mt-12 h-px w-full bg-[var(--bg-divider)] md:mt-16" />
        </div>
      </div>
    </section>
  );
}
