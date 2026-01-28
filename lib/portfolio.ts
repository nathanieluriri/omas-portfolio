import { cache } from "react";

import { API_BASE_URL, USER_ID } from "./config";
import type { APIResponse, PortfolioOut } from "./types";

export const getPortfolio = cache(async (): Promise<PortfolioOut | null> => {
  const response = await fetch(`${API_BASE_URL}/v1/portfolios/${USER_ID}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as APIResponse<PortfolioOut>;
  return payload.data ?? null;
});
