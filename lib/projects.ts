import type { ProjectEntry } from "./types";

const EXTERNAL_LINK_RE = /^(https?:|mailto:|tel:)/i;

function cleanPath(value: string) {
  return value.split(/[?#]/)[0].replace(/^\/+/, "");
}

export function isExternalProjectLink(link?: string | null) {
  if (!link) {
    return false;
  }
  return EXTERNAL_LINK_RE.test(link.trim());
}

export function normalizeProjectSlug(link?: string | null) {
  if (!link) {
    return null;
  }
  const trimmed = link.trim();
  if (!trimmed || trimmed === "#" || isExternalProjectLink(trimmed)) {
    if (!trimmed || trimmed === "#") {
      return null;
    }
    try {
      const url = new URL(trimmed);
      const cleaned = cleanPath(url.pathname);
      if (!cleaned) {
        return null;
      }
      return cleaned.startsWith("projects/")
        ? cleaned.slice("projects/".length)
        : null;
    } catch {
      return null;
    }
  }

  const cleaned = cleanPath(trimmed);
  if (!cleaned) {
    return null;
  }
  return cleaned.startsWith("projects/") ? cleaned.slice("projects/".length) : cleaned;
}

export function getProjectSlug(project: ProjectEntry) {
  return normalizeProjectSlug(project.link);
}

export function getProjectHref(project: ProjectEntry) {
  const link = project.link?.trim();
  if (!link || link === "#") {
    return null;
  }
  if (isExternalProjectLink(link)) {
    return link;
  }
  if (link.startsWith("/")) {
    return link;
  }
  return `/projects/${link}`;
}

export function getProjectExternalLink(project: ProjectEntry) {
  const link = project.link?.trim();
  if (!link) {
    return null;
  }
  return isExternalProjectLink(link) ? link : null;
}
