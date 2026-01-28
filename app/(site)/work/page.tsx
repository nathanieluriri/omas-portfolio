import ProjectsSection from "../../components/ProjectsSection";
import { fetchPortfolioISR } from "../../../lib/server/portfolio";

export default async function WorkPage() {
  const portfolio = await fetchPortfolioISR();

  if (!portfolio) {
    return <ProjectsSection />;
  }

  return <ProjectsSection projects={portfolio.projects ?? []} />;
}
