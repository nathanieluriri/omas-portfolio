import ExperienceSection from "../../components/ExperienceSection";
import { getPortfolio } from "../../../lib/portfolio";

export default async function ExperiencePage() {
  const portfolio = await getPortfolio();

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
