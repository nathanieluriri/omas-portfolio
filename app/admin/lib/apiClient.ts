import { API_BASE_URL } from "../../../lib/config";
import type { APIResponse, PortfolioOut, UserOut } from "../../../lib/types";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./auth";

interface SuggestionPatchData {
  target: string;
  patch: Record<string, unknown>;
  source_length: number;
}

async function refreshTokens() {
  const refreshToken = getRefreshToken();
  const accessToken = getAccessToken();
  if (!refreshToken) return null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}/v1/users/refresh`, {
    method: "POST",
    headers,
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
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const refreshed = await refreshTokens();
      if (!refreshed?.access_token) break;
      const retryHeaders = new Headers(options.headers);
      retryHeaders.set("Authorization", `Bearer ${refreshed.access_token}`);
      const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: retryHeaders,
      });
      if (retryResponse.status !== 401) {
        return retryResponse;
      }
    }

    clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
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

export async function uploadMetadataImages(params: {
  socialImage?: File | null;
  anagramDark?: File | null;
  anagramLight?: File | null;
  favicon?: File | null;
}) {
  const formData = new FormData();
  if (params.socialImage) formData.append("social_image", params.socialImage);
  if (params.anagramDark) formData.append("anagram_dark", params.anagramDark);
  if (params.anagramLight) formData.append("anagram_light", params.anagramLight);
  if (params.favicon) formData.append("favicon", params.favicon);

  const response = await apiFetch<Record<string, string>>(
    "/v1/portfolios/upload_metadata_images",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to upload metadata images");
  }

  return response.json() as Promise<APIResponse<Record<string, string>>>;
}

export async function generateSuggestion(params: {
  targetPath: string;
  textInput?: string;
  file?: File | null;
  useExistingResume?: boolean;
}) {
  const formData = new FormData();
  formData.append("target_path", params.targetPath);

  if (params.textInput) {
    formData.append("text_input", params.textInput);
  }

  if (params.file) {
    formData.append("file", params.file);
  }

  if (params.useExistingResume) {
    formData.append("use_existing_resume", "true");
  }

  const response = await apiFetch<SuggestionPatchData>("/v1/suggestions/generate", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to generate suggestion");
  }

  return response.json() as Promise<APIResponse<SuggestionPatchData>>;
}
