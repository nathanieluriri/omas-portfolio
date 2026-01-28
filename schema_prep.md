# Portfolio Schema Documentation

This document outlines every dynamic element in the Oma Dashi portfolio. All fields marked as **dynamic** can be easily modified to personalize the portfolio.

---

## 1. HEADER NAVIGATION

**Component:** `app/components/Header.tsx`

### Navigation Items
```json
{
  "navItems": [
    {
      "href": "string (route path)",
      "label": "string (display text)"
    }
  ]
}
```

| Field | Type | Example | Dynamic |
|-------|------|---------|---------|
| `href` | string | "/" | ✅ Yes |
| `label` | string | "about" | ✅ Yes |

---

## 2. FOOTER

**Component:** `app/components/Footer.tsx`

### Footer Content
```json
{
  "copyright": "string",
  "tagline": "string"
}
```

| Field | Type | Example | Dynamic |
|-------|------|---------|---------|
| `copyright` | string | "© 2026 Oma Dashi" | ✅ Yes |
| `tagline` | string | "Built with calm systems thinking." | ✅ Yes |

---

## 3. HERO / ABOUT SECTION

**Component:** `app/components/Hero.tsx`

### Personal Information
```json
{
  "name": "string",
  "title": "string",
  "bio": ["string", "string"],
  "availability": "object (AvailabilityBadge component)"
}
```

| Field | Type | Example | Dynamic |
|-------|------|---------|---------|
| `name` | string | "Oma Dashi" | ✅ Yes |
| `title` | string | "Systems Engineer · Product Builder" | ✅ Yes |
| `bio` | string[] | Array of paragraph strings | ✅ Yes |

### Bio Structure
Each item in the `bio` array is a paragraph displayed in the hero section:
- Multiple paragraphs supported
- Text formatting handled by `RichParagraph` component
- Can include markdown-like syntax based on component implementation

---

## 4. EXPERIENCE SECTION

**Component:** `app/components/ExperienceSection.tsx`

### Experience Entry Schema
```json
{
  "experience": [
    {
      "date": "string (date range)",
      "role": "string (job title)",
      "company": "string (company name)",
      "link": "string (company URL)",
      "description": "string (optional role summary)",
      "highlights": ["string", "string", "string"],
      "current": "boolean (is current position)"
    }
  ]
}
```

| Field | Type | Example | Dynamic |
|-------|------|---------|---------|
| `date` | string | "2023 — Present" | ✅ Yes |
| `role` | string | "Senior Systems Engineer" | ✅ Yes |
| `company` | string | "Nordlane Labs" | ✅ Yes |
| `link` | string | "https://example.com" | ✅ Yes |
| `description` | string | "Leading platform architecture..." | ✅ Yes |
| `highlights` | string[] | Array of 3 key achievements | ✅ Yes |
| `current` | boolean | `true` / `false` | ✅ Yes |

### Notes
- `highlights` array: Up to 3 items displayed (`.slice(0, 3)`)
- `current`: When `true`, shows animated pulse indicator on timeline
- Display order: Most recent first
- Resume download button points to `/resume.pdf`

---

## 5. PROJECTS / WORK SECTION

**Component:** `app/components/ProjectsSection.tsx`

### Project Entry Schema
```json
{
  "projects": [
    {
      "title": "string (project name)",
      "tags": ["string", "string", "string"],
      "description": "string (project summary)",
      "link": "string (project URL)"
    }
  ]
}
```

| Field | Type | Example | Dynamic |
|-------|------|---------|---------|
| `title` | string | "SignalForge Analytics" | ✅ Yes |
| `tags` | string[] | ["Observability", "SaaS", "B2B"] | ✅ Yes |
| `description` | string | "A real-time ops console..." | ✅ Yes |
| `link` | string | "/projects/signalforge" or "#" | ✅ Yes |

### Notes
- Projects displayed in grid layout (2 columns on tablet, 3 on desktop)
- Tags displayed as `Tag` components
- 6 projects recommended for optimal layout
- Can accommodate more or fewer projects

---

## 6. TOOLS & SKILLS SECTION

**Component:** `app/components/ToolsSection.tsx`

### Skill Groups Schema
```json
{
  "skillGroups": [
    {
      "title": "string (category name)",
      "items": ["string", "string", "string", ...]
    }
  ]
}
```

| Field | Type | Example | Dynamic |
|-------|------|---------|---------|
| `title` | string | "Languages & Frameworks" | ✅ Yes |
| `items` | string[] | ["TypeScript", "Go", "Python", ...] | ✅ Yes |

### Current Structure
- **Group 1:** Languages & Frameworks (8 items)
- **Group 2:** Infrastructure & Tools (8 items)

### Notes
- Supports unlimited skill groups (displays in 2-column grid on desktop)
- Supports unlimited items per group
- Displayed as `SkillChip` components
- No specific ordering required

---

## 7. CONTACT SECTION

**Component:** `app/components/ContactSection.tsx`

### Contact Entry Schema
```json
{
  "contacts": [
    {
      "label": "string (contact type)",
      "value": "string (display value)",
      "href": "string (link)",
      "icon": "SVG element"
    }
  ]
}
```

| Field | Type | Example | Dynamic |
|-------|------|---------|---------|
| `label` | string | "Email" | ✅ Yes |
| `value` | string | "hello@omadashi.com" | ✅ Yes |
| `href` | string | "mailto:hello@omadashi.com" | ✅ Yes |
| `icon` | SVG | SVG path element | ✅ Yes (but complex) |

### Current Contacts
1. **Email** - `mailto:` link
2. **GitHub** - GitHub profile URL
3. **LinkedIn** - LinkedIn profile URL
4. **Location** - Geographic location (can be disabled by setting `href="#"`)

### Notes
- Displayed as 2-column grid
- Each contact is a clickable card
- Icon customization requires SVG modification
- Can add/remove contacts as needed

---

## 8. THEME & COLORS

**Location:** `app/globals.css`

### CSS Variables (Root Level)
These variables control the entire color scheme and can be modified:

```css
--text-primary          /* Main text color */
--text-secondary        /* Secondary text (descriptions) */
--text-muted            /* Muted/subdued text */
--bg-primary            /* Primary background */
--bg-surface            /* Surface/card backgrounds */
--bg-surface-hover      /* Hover state for surfaces */
--bg-divider            /* Border/divider color */
--accent-primary        /* Primary accent (orange) */
--accent-muted          /* Muted accent variant */
```

---

## 9. RESUME FILE

**Location:** `public/resume.pdf`

| Field | Type | Dynamic |
|-------|------|---------|
| File path | `/resume.pdf` | ✅ Yes |
| Display link | "Download Resume" button in Experience section | ✅ Yes |

### Notes
- File should be placed in `public/resume.pdf`
- Modify button text in `ExperienceSection.tsx` if needed

---

## 10. ANIMATIONS & MOTION

### Global Settings
- Uses **Framer Motion** for animations
- Respects `prefers-reduced-motion` media query
- All animated elements have fallbacks for accessibility

### Common Animation Parameters (Dynamic)
```json
{
  "staggerChildren": 0.12,
  "delayChildren": 0.08,
  "duration": 0.45,
  "ease": "easeOut"
}
```

| Parameter | Current Value | Dynamic |
|-----------|---------------|---------|
| `staggerChildren` | 0.12s | ✅ Yes |
| `delayChildren` | 0.08s | ✅ Yes |
| `duration` | 0.45s | ✅ Yes |
| `ease` | "easeOut" | ✅ Yes |

---

## 11. METADATA & GLOBAL

**Location:** `app/layout.tsx`

| Field | Type | Example | Dynamic |
|-------|------|---------|---------|
| `title` | string | Site title | ✅ Yes |
| `description` | string | Meta description | ✅ Yes |
| `author` | string | Author name | ✅ Yes |
| `viewport` | string | Device viewport | ❌ No |

---

## SUMMARY: ALL DYNAMIC FIELDS BY SECTION

### High Priority (Change First)
1. **Hero Section:** Name, title, bio paragraphs
2. **Experience:** Job entries (date, role, company, highlights)
3. **Projects:** Project titles, descriptions, tags
4. **Tools:** Skill categories and items
5. **Contact:** Email, GitHub, LinkedIn, location

### Medium Priority
6. Header navigation links
7. Footer copyright year and tagline
8. Resume PDF file
9. Theme colors (CSS variables)

### Low Priority (Advanced)
10. Animation timings and easing
11. Contact icon SVGs
12. Layout/spacing values

---

## FILE LOCATIONS REFERENCE

| Content | File Path |
|---------|-----------|
| Header Navigation | `app/components/Header.tsx` |
| Footer | `app/components/Footer.tsx` |
| Hero/About | `app/components/Hero.tsx` |
| Experience | `app/components/ExperienceSection.tsx` |
| Projects | `app/components/ProjectsSection.tsx` |
| Tools/Skills | `app/components/ToolsSection.tsx` |
| Contact | `app/components/ContactSection.tsx` |
| Colors & Theme | `app/globals.css` |
| Resume | `public/resume.pdf` |
| Metadata | `app/layout.tsx` |

---

## NEXT STEPS

1. **Immediate:** Update Hero name, title, and bio
2. **Week 1:** Add your experience entries and projects
3. **Week 1:** Update contact information and links
4. **Week 2:** Upload resume PDF to `public/resume.pdf`
5. **Week 2:** Customize colors in `globals.css`
6. **Ongoing:** Add new projects and skills as needed
