import ExperienceSection from "../../components/ExperienceSection";
import { fetchPortfolioISR } from "../../../lib/server/portfolio";

export default async function ExperiencePage() {
  const portfolio = await fetchPortfolioISR();

  if (!portfolio) {
    return <ExperienceSection />;
  }

  return (
    <ExperienceSection
      experience={portfolio.experience ?? []}
      resumeUrl={portfolio.resumeUrl}
    />
  );
}
