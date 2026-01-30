import type { CSSProperties } from "react";
import type { ThemeColors } from "./types";

// Accept both snake_case and camelCase keys in case the API sends either format.
type ThemeInput = ThemeColors & {
  textPrimary?: string;
  textSecondary?: string;
  textMuted?: string;
  bgPrimary?: string;
  bgSurface?: string;
  bgSurfaceHover?: string;
  bgDivider?: string;
  accentPrimary?: string;
  accentMuted?: string;
};

function pick(theme: ThemeInput | undefined, snake: keyof ThemeColors, camel: keyof ThemeInput) {
  return theme?.[snake] ?? theme?.[camel];
}

export function themeToStyle(theme?: ThemeInput) {
  if (!theme) return undefined;

  const computed: CSSProperties = {
    ["--text-primary-light" as any]: pick(theme, "text_primary", "textPrimary"),
    ["--text-secondary-light" as any]: pick(theme, "text_secondary", "textSecondary"),
    ["--text-muted-light" as any]: pick(theme, "text_muted", "textMuted"),
    ["--bg-primary-light" as any]: pick(theme, "bg_primary", "bgPrimary"),
    ["--bg-surface-light" as any]: pick(theme, "bg_surface", "bgSurface"),
    ["--bg-surface-hover-light" as any]: pick(theme, "bg_surface_hover", "bgSurfaceHover"),
    ["--bg-divider-light" as any]: pick(theme, "bg_divider", "bgDivider"),
    ["--accent-primary-light" as any]: pick(theme, "accent_primary", "accentPrimary"),
    ["--accent-muted-light" as any]: pick(theme, "accent_muted", "accentMuted"),
  };

  // Remove undefined entries to avoid overriding CSS defaults with blank values.
  Object.keys(computed).forEach((key) => {
    if (computed[key as keyof CSSProperties] === undefined) {
      delete computed[key as keyof CSSProperties];
    }
  });

  return computed;
}

export function themeToCssString(theme?: ThemeInput) {
  const style = themeToStyle(theme);
  if (!style) return "";

  return Object.entries(style)
    .map(([key, value]) => `${key}:${value};`)
    .join("");
}
