import type { HeroSection } from "../../lib/types";
import AvailabilityBadge from "./ui/AvailabilityBadge";
import RichParagraph from "./ui/RichParagraph";

const fallbackBio = [
  "I build portfolio-grade systems with the same care I give production platforms: clear boundaries, reliable interfaces, and a calm experience for whoever inherits the stack next.",
  "My work focuses on designing dependable backends and clean product surfaces that stay readable at scale. I optimize for durability, not noise, with a preference for precise execution and quiet confidence.",
];

interface HeroProps {
  hero?: HeroSection;
}

export default function Hero({ hero }: HeroProps) {
  const availability = hero?.availability;
  return (
    <section id="about" className="pt-20 pb-14 md:pt-24 md:pb-16">
      <div className="mx-auto w-full max-w-[960px] px-6 md:px-10">
        <div
          className="motion-safe:animate-[fade-up_0.7s_ease-out]"
          style={{ animationDelay: "80ms" }}
        >
          <div className="flex max-w-[720px] flex-wrap items-center justify-between gap-4">
  <h1
    className="
      max-w-[450px]
      break-words
      text-[clamp(2.6rem,4vw,3.6rem)]
      font-semibold
      leading-[1.08]
      text-[var(--text-primary)]
    "
  >
    {hero?.name ?? "Oma Dashi"}
  </h1>

  <AvailabilityBadge
    label={availability?.label ?? "Open to Work"}
    status={availability?.status ?? "available"}
  />
</div>


          <p className="mt-3 text-[1.05rem] font-medium text-[var(--accent-primary)]">
            {hero?.title ?? "Systems Engineer · Product Builder"}
          </p>

          <div className="mt-10 max-w-[720px] md:mt-12">
            <RichParagraph paragraphs={hero?.bio ?? fallbackBio} />
          </div>
        </div>
      </div>
    </section>
  );
}
