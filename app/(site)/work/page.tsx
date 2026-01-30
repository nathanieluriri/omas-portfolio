import ProjectsSection from "../../components/ProjectsSection";
import { fetchPortfolioLive } from "../../../lib/server/portfolio";

export default async function WorkPage() {
  const portfolio = await fetchPortfolioLive();

  if (!portfolio) {
    return <ProjectsSection />;
  }

  return <ProjectsSection projects={portfolio.projects ?? []} />;
}
