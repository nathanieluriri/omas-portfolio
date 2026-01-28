# Portfolio UI Implementation Plan

## Phase 1: Design System & Tokens

### 1.1 Color System
- [ ] Define color tokens in CSS variables or Tailwind config
  - [ ] Background colors (bg-primary, bg-surface, bg-surface-hover, bg-divider)
  - [ ] Text colors (text-primary, text-secondary, text-muted)
  - [ ] Accent colors (accent-primary #FF6A00, accent-secondary #22C55E)
  - [ ] Status colors (status-open)
- [ ] Add dark/light theme toggle support
- [ ] Test color contrast ratios (AA+ standard)

### 1.2 Typography System
- [ ] Configure font family (Inter + system fallback)
- [ ] Define type scale with sizes and weights
  - [ ] H1 (Hero Name): 48–56px / Semibold
  - [ ] H2 (Section Titles): 32–36px / Semibold
  - [ ] H3 (Card Titles): 20–22px / Semibold
  - [ ] Body Large: 16–18px / Regular
  - [ ] Body Small: 14–15px / Regular
  - [ ] Meta/Labels: 12–13px / Medium
- [ ] Set line heights (headings: 1.2–1.3, body: 1.6–1.7)

### 1.3 Layout Grid & Spacing
- [ ] Define max content width (1100–1200px)
- [ ] Set horizontal padding (24px mobile, 40px desktop)
- [ ] Define vertical rhythm (80–120px between sections)
- [ ] Create responsive breakpoint strategy

### 1.4 Global Styles
- [ ] Reset base styles (globals.css)
- [ ] Apply theme tokens globally
- [ ] Set up CSS variables or Tailwind utilities

---

## Phase 2: Core Layout Components

### 2.1 App Shell Structure
- [ ] Create `Header` component
- [ ] Create `MainContent` wrapper component
- [ ] Create `Footer` component (minimal)
- [ ] Layout page with proper spacing and grid

### 2.2 Header & Navigation
- [ ] Build `ThemeToggle` component (light/dark)
  - [ ] Store theme preference (localStorage)
  - [ ] Apply theme to entire app
- [ ] Build `Navigation` component
  - [ ] Links: about, work, experience
  - [ ] Active route highlighting
  - [ ] Responsive mobile menu (if needed)
- [ ] Style navigation
  - [ ] Italicized/light-weight font
  - [ ] Hover effects
  - [ ] Active state highlighting

---

## Phase 3: Hero / About Section

### 3.1 Hero Container
- [ ] Create `HeroSection` component
- [ ] Implement two-column layout (desktop) / single-column (mobile)

### 3.2 Left Column
- [ ] Display hero name (H1)
- [ ] Display role subtitle (accent color)
- [ ] Build `AvailabilityBadge` component
  - [ ] Pill shape
  - [ ] Green background (low opacity)
  - [ ] Dot indicator on left
  - [ ] Text: "Open to Work"

### 3.3 Right Column
- [ ] Add breathing space / intentional minimalism

### 3.4 Bio Text Block
- [ ] Build `RichParagraph` component
  - [ ] Max width: ~700px
  - [ ] Multi-paragraph support
  - [ ] Proper line height and spacing
  - [ ] No emojis

---

## Phase 4: Tools & Skills Section

### 4.1 Section Container
- [ ] Create `ToolsSection` component
- [ ] Title: "Tools & Skills"

### 4.2 Skill Groups
- [ ] Create `SkillGroup` component
  - [ ] Group title
  - [ ] Flexible chip grid (responsive)
- [ ] Data structure for skills by category:
  - [ ] Languages & Frameworks
  - [ ] Infrastructure & Tools

### 4.3 Skill Chips
- [ ] Build `SkillChip` component
  - [ ] Rounded pill shape
  - [ ] Background: bg-surface
  - [ ] Text: text-secondary
  - [ ] Padding: 8px 14px
  - [ ] Static (non-interactive)

---

## Phase 5: Projects / Work Section

### 5.1 Projects Grid
- [ ] Create `ProjectsSection` component
- [ ] Implement grid layout
  - [ ] 3 columns on desktop
  - [ ] 1–2 columns on mobile
  - [ ] Gap: 24–32px

### 5.2 Project Cards
- [ ] Build `ProjectCard` component
  - [ ] Card container with proper spacing
  - [ ] Project title (H3)
  - [ ] Tag list
  - [ ] Description paragraph
  - [ ] CTA link

### 5.3 Project Tags
- [ ] Build `Tag` component
  - [ ] Background: accent-muted
  - [ ] Text: accent-primary
  - [ ] Small size

### 5.4 Project CTA
- [ ] Build `InlineLink` component
  - [ ] Text + arrow icon
  - [ ] Accent color
  - [ ] Hover: translate arrow slightly (150–200ms transition)

---

## Phase 6: Experience Section

### 6.1 Timeline Layout
- [ ] Create `ExperienceSection` component
- [ ] Build `VerticalTimeline` component
  - [ ] Left vertical line (divider color)
  - [ ] Nodes for each role

### 6.2 Timeline Items
- [ ] Build `ExperienceItem` component
  - [ ] Date range (muted text, meta size)
  - [ ] Role + Company name
  - [ ] Description paragraph
  - [ ] Link to company (if applicable)
- [ ] Highlight current/active role
  - [ ] Accent-colored node
  - [ ] Slight emphasis

### 6.3 Resume Download
- [ ] Build `PrimaryButton` component
  - [ ] Background: accent-primary
  - [ ] Text: white
  - [ ] Download icon
  - [ ] Rounded corners
  - [ ] Hover effect (subtle scale or color lift)
- [ ] Link to resume file
- [ ] Position in experience section or footer

---

## Phase 7: Contact Section

### 7.1 Contact Grid
- [ ] Create `ContactSection` component
- [ ] Build `ContactGrid` (2-column layout)

### 7.2 Contact Cards
- [ ] Build `ContactCard` component
  - [ ] Icon + Label
  - [ ] Background: bg-surface
  - [ ] Hover: bg-surface-hover
  - [ ] Full clickable area
  - [ ] Links to: email, GitHub, LinkedIn, etc.

---

## Phase 8: Interactions & Animations

### 8.1 Transition Settings
- [ ] Apply transition durations: 150–200ms
- [ ] Use easing: ease-out
- [ ] Apply to hover states (links, buttons, cards)
- [ ] Smooth color transitions

### 8.2 Hover States
- [ ] Link hover effects
- [ ] Button hover effects
- [ ] Card hover effects (slight lift or bg change)
- [ ] No heavy animations; focus on subtle feedback

### 8.3 Scroll Behavior
- [ ] Natural scroll (no snap)
- [ ] Smooth scrolling if needed

---

## Phase 9: Responsive Design

### 9.1 Mobile Layout
- [ ] Test all components on mobile (max 480px)
- [ ] Single-column layouts for sections
- [ ] Stack navigation (hamburger menu if needed)
- [ ] Adjust font sizes for small screens

### 9.2 Tablet Layout
- [ ] 2-column grids where applicable
- [ ] Adjust spacing and padding

### 9.3 Desktop Layout
- [ ] Full 3-column grids
- [ ] Optimal spacing (40px horizontal padding)

---

## Phase 10: Accessibility & Testing

### 10.1 Keyboard Navigation
- [ ] All links and buttons keyboard-accessible
- [ ] Logical tab order
- [ ] No keyboard traps

### 10.2 Focus States
- [ ] Visible focus indicators on all interactive elements
- [ ] Sufficient contrast (AA+)

### 10.3 Screen Reader Testing
- [ ] Semantic HTML (nav, section, article, etc.)
- [ ] ARIA labels where necessary
- [ ] Image alt text for all icons

### 10.4 Color Contrast
- [ ] Verify all text meets AA+ standard
- [ ] Test with contrast checker tools

### 10.5 Testing
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on real mobile devices
- [ ] Test with screen readers (NVDA, JAWS, VoiceOver)
- [ ] Test keyboard navigation

---

## Phase 11: Data & Content

### 11.1 Content Structure
- [ ] Define data structure for projects
- [ ] Define data structure for experience items
- [ ] Define data structure for skills
- [ ] Define data structure for contact links

### 11.2 Content Integration
- [ ] Add project data
- [ ] Add experience data
- [ ] Add skills data
- [ ] Add contact links
- [ ] Add bio text

---

## Phase 12: Performance & Optimization

### 12.1 Image Optimization
- [ ] Optimize project images (if any)
- [ ] Use next/image for Next.js optimization

### 12.2 Code Splitting
- [ ] Lazy-load components where appropriate
- [ ] Optimize bundle size

### 12.3 Lighthouse Audit
- [ ] Run Lighthouse audit
- [ ] Fix performance issues
- [ ] Target: 90+ on all metrics

---

## Phase 13: Final Polish & Deployment

### 13.1 Visual Polish
- [ ] Review all components against spec
- [ ] Fine-tune spacing and alignment
- [ ] Verify color consistency
- [ ] Check typography hierarchy

### 13.2 Theme Toggle Testing
- [ ] Test dark/light theme toggle
- [ ] Verify all colors in both modes
- [ ] Test persistence across page reloads

### 13.3 Cross-Browser Testing
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on iOS and Android

### 13.4 Deploy
- [ ] Build for production
- [ ] Deploy to hosting (Vercel, etc.)
- [ ] Verify deployment

---

## Implementation Notes

- **Component Library First:** Build reusable components early (buttons, cards, chips, etc.)
- **Design Tokens:** Use CSS variables or Tailwind for centralized styling
- **Avoid Over-Engineering:** Keep animations subtle, prioritize readability
- **Mobile-First Approach:** Style mobile first, then enhance for desktop
- **Document Components:** Create Storybook or component docs for reference
- **Iterate Based on Feedback:** Collect feedback and refine iteratively

---

## File Structure Reference

```
app/
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── ToolsSection.tsx
│   ├── ProjectsSection.tsx
│   ├── ExperienceSection.tsx
│   ├── ContactSection.tsx
│   ├── Footer.tsx
│   └── ui/
│       ├── AvailabilityBadge.tsx
│       ├── SkillChip.tsx
│       ├── Tag.tsx
│       ├── InlineLink.tsx
│       ├── PrimaryButton.tsx
│       └── ThemeToggle.tsx
├── globals.css
├── layout.tsx
└── page.tsx
```

---

## Success Criteria

- [ ] All components built according to spec
- [ ] Fully responsive (mobile, tablet, desktop)
- [ ] Dark/light theme toggle functional
- [ ] All interactions smooth (150–200ms transitions)
- [ ] Accessibility: AA+ contrast, keyboard-navigable, screen-reader friendly
- [ ] Lighthouse score: 90+
- [ ] No console errors or warnings
- [ ] Deployed and live
