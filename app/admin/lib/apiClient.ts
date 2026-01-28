import { API_BASE_URL } from "../../../lib/config";
import type { APIResponse, PortfolioOut, UserOut } from "../../../lib/types";
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from "./auth";

async function refreshTokens() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await fetch(`${API_BASE_URL}/v1/users/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as APIResponse<UserOut>;
  const user = payload.data ?? null;
  if (user?.access_token) setAccessToken(user.access_token);
  if (user?.refresh_token) setRefreshToken(user.refresh_token);
  return user;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  requireAuth = true
) {
  const headers = new Headers(options.headers);
  if (requireAuth) {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && requireAuth) {
    const refreshed = await refreshTokens();
    if (refreshed?.access_token) {
      const retryHeaders = new Headers(options.headers);
      retryHeaders.set("Authorization", `Bearer ${refreshed.access_token}`);
      return fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: retryHeaders,
      });
    }
  }

  return response;
}

export async function getMe() {
  const response = await apiFetch<UserOut>("/v1/users/me");
  if (!response.ok) return null;
  const payload = (await response.json()) as APIResponse<UserOut>;
  return payload.data ?? null;
}

export async function getPortfolioByUser(userId: string) {
  const response = await apiFetch<PortfolioOut>(`/v1/portfolios/${userId}`, {}, false);
  if (!response.ok) return null;
  const payload = (await response.json()) as APIResponse<PortfolioOut>;
  return payload.data ?? null;
}

export async function updatePortfolio(data: Partial<PortfolioOut>) {
  const response = await apiFetch<PortfolioOut>("/v1/portfolios/", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to update portfolio");
  }

  const payload = (await response.json()) as APIResponse<PortfolioOut>;
  return payload.data ?? null;
}

export async function createPortfolio(data: Partial<PortfolioOut>) {
  const response = await apiFetch<PortfolioOut>("/v1/portfolios/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to create portfolio");
  }

  const payload = (await response.json()) as APIResponse<PortfolioOut>;
  return payload.data ?? null;
}

export async function deletePortfolio() {
  const response = await apiFetch<void>("/v1/portfolios/", {
    method: "DELETE",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to delete portfolio");
  }

  return true;
}

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await apiFetch<{ resumeUrl?: string }>(
    "/v1/portfolios/upload_resume",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to upload resume");
  }

  return response.json() as Promise<APIResponse<Record<string, unknown>>>;
}
