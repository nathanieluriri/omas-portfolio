import type { CSSProperties } from "react";
import type { ThemeColors } from "./types";

export function themeToStyle(theme?: ThemeColors) {
  if (!theme) return undefined;

  return {
    "--text-primary-light": theme.text_primary,
    "--text-secondary-light": theme.text_secondary,
    "--text-muted-light": theme.text_muted,
    "--bg-primary-light": theme.bg_primary,
    "--bg-surface-light": theme.bg_surface,
    "--bg-surface-hover-light": theme.bg_surface_hover,
    "--bg-divider-light": theme.bg_divider,
    "--accent-primary-light": theme.accent_primary,
    "--accent-muted-light": theme.accent_muted,
  } as CSSProperties;
}
