import ContactSection from "../components/ContactSection";
import Hero from "../components/Hero";
import ToolsSection from "../components/ToolsSection";
import { fetchPortfolioISR } from "../../lib/server/portfolio";

function MissingPortfolio() {
  return (
    <section className="py-24 md:py-28">
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-4 px-6 md:px-10">
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">
          Portfolio not found
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          We couldn&apos;t load this portfolio yet. Please check back soon.
        </p>
      </div>
    </section>
  );
}

export default async function Home() {
  const portfolio = await fetchPortfolioISR();

  if (!portfolio) {
    return <MissingPortfolio />;
  }

  return (
    <>
      <Hero hero={portfolio.hero} resumeUrl={portfolio.resumeUrl} />
      <ToolsSection skillGroups={portfolio.skillGroups ?? []} />
      <ContactSection contacts={portfolio.contacts ?? []} />
    </>
  );
}
