import "server-only";

import type { APIResponse, PortfolioOut } from "../types";

const API_BASE_URL =
  process.env.API_BASE_URL?.trim() ?? process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
const USER_ID = process.env.NEXT_PUBLIC_USER_ID?.trim();

function getPortfolioUrl() {
  if (!API_BASE_URL || !USER_ID) {
    return null;
  }
  return `${API_BASE_URL}/v1/portfolios/${USER_ID}`;
}

export async function fetchPortfolioISR(): Promise<PortfolioOut | null> {
  const url = getPortfolioUrl();
  if (!url) return null;
  const response = await fetch(url, {
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
  const url = getPortfolioUrl();
  if (!url) return null;
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as APIResponse<PortfolioOut>;
  return payload.data ?? null;
}
