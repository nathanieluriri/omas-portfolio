import ExperienceSection from "../../components/ExperienceSection";
import { fetchPortfolioLive } from "../../../lib/server/portfolio";

export default async function ExperiencePage() {
  const portfolio = await fetchPortfolioLive();

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
