let accessToken: string | null = null;

const ACCESS_KEY = "admin.access_token";
const REFRESH_KEY = "admin.refresh_token";

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window === "undefined") return;
  if (token) {
    sessionStorage.setItem(ACCESS_KEY, token);
  } else {
    sessionStorage.removeItem(ACCESS_KEY);
  }
}

export function getAccessToken() {
  if (accessToken) return accessToken;
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(ACCESS_KEY);
  accessToken = stored;
  return stored;
}

export function setRefreshToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(REFRESH_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_KEY);
  }
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function clearTokens() {
  setAccessToken(null);
  setRefreshToken(null);
}
