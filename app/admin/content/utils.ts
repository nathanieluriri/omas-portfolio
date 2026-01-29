import type { PortfolioOut } from "../../../lib/types";

export function emptyPortfolio(): PortfolioOut {
  return {
    navItems: [],
    hero: { name: "", title: "", bio: [], availability: { label: "", status: "" } },
    experience: [],
    projects: [],
    skillGroups: [],
    contacts: [],
    footer: { copyright: "", tagline: "" },
    resumeUrl: "/resume.pdf",
  };
}

export function parseList(value: string) {
  return value
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}
