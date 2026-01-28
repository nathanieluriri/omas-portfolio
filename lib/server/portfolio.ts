import "server-only";

import type { APIResponse, PortfolioOut } from "../types";

const API_BASE_URL = process.env.API_BASE_URL;
const USER_ID = process.env.NEXT_PUBLIC_USER_ID;

function getPortfolioUrl() {
  if (!API_BASE_URL) {
    throw new Error("Missing API_BASE_URL environment variable.");
  }
  if (!USER_ID) {
    throw new Error("Missing NEXT_PUBLIC_USER_ID environment variable.");
  }
  return `${API_BASE_URL}/v1/portfolios/${USER_ID}`;
}

export async function fetchPortfolioISR(): Promise<PortfolioOut | null> {
  const response = await fetch(getPortfolioUrl(), {
    next: {
      revalidate: 3600,
      tags: ["portfolio"],
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as APIResponse<PortfolioOut>;
  return payload.data ?? null;
}

export async function fetchPortfolioLive(): Promise<PortfolioOut | null> {
  const response = await fetch(getPortfolioUrl(), {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as APIResponse<PortfolioOut>;
  return payload.data ?? null;
}
