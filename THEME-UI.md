Below is a structured description of the Theme Settings UI in the admin area. It covers layout, hierarchy, and the intent behind each block so the interface can be recreated consistently.

---

# Theme Settings UI — Layout & Behavior

## 1) Page Shell

- **Container:** The page is wrapped in `AdminShell`, which provides the admin layout chrome and breadcrumb.
- **Breadcrumb:** `Admin › Theme`.
- **Title:** “Theme” (page-level heading from `AdminShell`).
- **Draft Bar:** A `DraftBar` sits at the top of the content area. It appears when unsaved changes exist and offers **Save** and **Discard** actions.

---

## 2) Section 1 — Theme Options (Presets)

**Card container:** A single `SurfaceCard` with vertical stacking.

### Header

- **Title:** “Theme options”
- **Subtitle:** “Pick a preset and preview it in light and dark mode.”
- Both lines are left-aligned, with the subtitle in smaller, muted text.

### Preset Grid

- **Layout:** Responsive grid, `gap-4`, with **two columns on large screens** and a single column on smaller widths.
- **Each preset card** is a rounded panel with:
  - Border using `--bg-divider`
  - Background using `--bg-surface`
  - Internal padding and vertical spacing

#### Preset Card Top Row

- **Left:** Preset name (bold) and a one-line description (muted).
- **Right:** Action button:
  - **“Selected”** (primary) if the preset matches the current theme.
  - **“Use theme”** (secondary) otherwise.

#### Preset Card Preview Row

- **Layout:** `grid` with **2 columns on small screens and up**, displaying **Light** and **Dark** previews side-by-side.
- **Each preview panel**:
  - Sets `data-theme="light"` or `data-theme="dark"` to simulate the theme.
  - Applies the preset’s color tokens inline via `themeToStyle(preset.colors)`.
  - Uses a rounded frame with border + background.

Inside each preview panel:

1. **Header Row**
   - Left: “light preview” / “dark preview” label in small uppercase.
   - Right: a small pill labeled “Accent” with the accent-muted background.
2. **Sample Card**
   - A nested card with border + surface background.
   - Shows a sample title, short body text, a small accent dot + label, and a primary button.

This block provides immediate visual feedback for each preset without requiring the user to apply it.

---

## 3) Section 2 — Homepage Preview

**Card container:** Another `SurfaceCard`, stacked below presets.

### Header

- **Title:** “Homepage preview”
- **Subtitle:** “Preview how the portfolio homepage looks with your current theme.”

### Preview Mode Controls

- A horizontal row with:
  - Left: label “Preview mode” in small uppercase.
  - Right: two buttons: **Light** and **Dark**.  
    The selected mode uses the primary button style.

### Preview Frame

- A large, rounded container that simulates the homepage:
  - Bordered using `--bg-divider`
  - Background uses `--bg-primary`
  - Has `data-theme` set to the chosen preview mode
  - Inline theme tokens from the current theme via `themeToStyle(currentTheme)`

#### Preview Frame Contents

1. **Top Bar (Header Mock)**
   - Left: user name in tiny uppercase.
   - Right: placeholder nav items (“About”, “Work”, “Contact”).
   - Bottom border in divider color.

2. **Hero Block**
   - Name as a headline.
   - Title in accent color (italic).
   - Availability badge as a small pill.
   - Short bio text.
   - Primary action button (“View resume”).

3. **Work + Skills Split**
   - Two-column grid (on medium screens).
   - **Work highlights** list on left; each item is a small card.
   - **Skills** on right; each group is a card with tag-like chips.

4. **Contact Strip**
   - A final bordered row with contact “chips” (rounded pills) for a few sample contacts.

This section demonstrates how the current theme colors render across key UI surfaces without leaving the admin page.

---

## 4) Section 3 — Advanced Settings

**Card container:** A `SurfaceCard` containing a `<details>` accordion.

### Summary

- Summary label: **“Advanced settings”** (clickable).
- Short helper text underneath: “Create your own theme by editing text, background, and accent colors.”

### Color Inputs Grid

- **Layout:** 2-column grid on medium screens; 1-column on small screens.
- Each item is a label row with:
  - The theme token name (uppercase, underscores replaced with spaces).
  - A **color input** (swatch)
  - A **text input** (hex value), aligned horizontally.

This section allows precise manual overrides for any theme token.

---

## 5) Visual Rhythm & Spacing

- Each `SurfaceCard` is vertically stacked with consistent gaps.
- Titles are medium-large and bold; subtitles are muted and smaller.
- Preview frames use borders and subtle spacing to emulate real UI without heavy decoration.
- Buttons and pills are consistent with the rest of the admin system’s design language.

---

## 6) Behavior Summary

- Preset selection updates the draft theme.
- Draft changes are tracked, with the `DraftBar` indicating unsaved changes.
- Preview mode toggles between light/dark simulation without altering the stored theme.
- Advanced settings allow manual overrides for each theme token.

