import ProjectsSection from "../../components/ProjectsSection";
import { getPortfolio } from "../../../lib/portfolio";

export default async function WorkPage() {
  const portfolio = await getPortfolio();

  if (!portfolio) {
    return <ProjectsSection />;
  }

  return <ProjectsSection projects={portfolio.projects ?? []} />;
}
