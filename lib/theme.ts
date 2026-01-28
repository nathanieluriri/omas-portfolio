import type { CSSProperties } from "react";
import type { ThemeColors } from "./types";

export function themeToStyle(theme?: ThemeColors) {
  if (!theme) return undefined;

  return {
    "--text-primary": theme.text_primary,
    "--text-secondary": theme.text_secondary,
    "--text-muted": theme.text_muted,
    "--bg-primary": theme.bg_primary,
    "--bg-surface": theme.bg_surface,
    "--bg-surface-hover": theme.bg_surface_hover,
    "--bg-divider": theme.bg_divider,
    "--accent-primary": theme.accent_primary,
    "--accent-muted": theme.accent_muted,
  } as CSSProperties;
}
