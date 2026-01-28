# AI Suggestions Feature — Complete Implementation Plan

> **Design Philosophy:** Integrates seamlessly with admin design system. Minimal, calm, focused. Leverages existing components and spacing. Uses environment variables for all API calls.

---

## STRATEGY OVERVIEW

**Goal:** Add intelligent resume-powered content suggestions to the admin without disrupting the existing aesthetic or UX patterns.

**Key Principles:**
- ✅ Use existing design tokens (colors, spacing, typography)
- ✅ Match admin card/button/input patterns
- ✅ Respect motion preferences (prefers-reduced-motion)
- ✅ Zero jank, smooth animations
- ✅ Accessible by default (keyboard nav, ARIA labels, focus states)
- ✅ Use `NEXT_PUBLIC_API_BASE_URL` from `.env.local`
- ✅ Minimal, non-intrusive command palette integration

---

# PHASE 1: DESIGN SYSTEM ALIGNMENT

## P1.1 — Review & Document Design System

### Tasks:
- [ ] **P1.1a** — Extract admin design tokens
  - Colors: `--text-primary`, `--text-secondary`, `--text-muted`, `--bg-primary`, `--bg-surface`, `--bg-divider`, `--accent-primary`
  - Spacing: `gap-4`, `gap-6`, `px-6`, `py-6`, `p-4`, `p-6`
  - Rounded: `rounded-2xl`, `rounded-lg`
  - Shadows: subtle, used on cards only
  - Borders: `border-[var(--bg-divider)]`

- [ ] **P1.1b** — Document component patterns
  - **Primary Button:** Orange fill, white text, hover lift, uppercase tracking
  - **Secondary Button:** Transparent, border, muted text, hover brightens
  - **Cards:** `rounded-2xl`, `border`, `bg-[var(--bg-surface)]`, soft shadow
  - **Inputs:** `rounded-lg`, border, dark background, focus state visible
  - **Status Pills:** `rounded-full`, `px-3 py-1`, `text-xs`
  - **Labels:** uppercase, small, tracking-wider, `text-[var(--text-muted)]`

- [ ] **P1.1c** — Document motion patterns
  - Collapse/expand: smooth slide (150-250ms, `ease-out`)
  - Fade-in: `motion-safe:animate-[fade-up_0.7s_ease-out]`
  - Button hover: small lift (2-4px)
  - No heavy bounce or spring animations in admin

**Expected outcome:** Design system document ready for implementation

---

## P1.2 — Create Shared AI Suggestions Styles

### Tasks:
- [ ] **P1.2a** — Create `app/components/admin/ai-suggestions/styles.ts`
  ```typescript
  // Export reusable Tailwind class strings for consistency
  export const aiStyles = {
    card: 'rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-6 transition-all duration-200 ease-out',
    button: 'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors duration-200 ease-out',
    primaryButton: 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary)]/90',
    secondaryButton: 'border border-[var(--bg-divider)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
    input: 'rounded-lg border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none',
    label: 'text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]',
    statusPill: 'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
  };
  ```

- [ ] **P1.2b** — Match confidence visualization
  - Use same badge pattern as Experience status pills
  - Colors: 
    - Low confidence (< 0.6): muted gray
    - Medium (0.6–0.8): orange-muted
    - High (> 0.8): green-muted

**Expected outcome:** Shared styles for consistency

---

# PHASE 2: COMMAND PALETTE INTEGRATION

## P2.1 — Extend Command Palette

**Note:** Assumes existing Ctrl+K command palette (cmdk or similar).

### Tasks:
- [ ] **P2.1a** — Add AI Suggestions command
  ```typescript
  // In command palette provider/hook
  const commands = [
    {
      id: 'ai-suggestions',
      name: 'AI Suggestions',
      description: 'Upload resume to get content improvements',
      icon: '✨', // or use lucide icon
      action: () => setShowAiSuggestionsModal(true),
      category: 'AI',
      priority: 1, // Show at top
    },
    // ... rest of commands
  ];
  ```

- [ ] **P2.1b** — Implement subtle highlight effect
  ```typescript
  // Only when palette first opens
  useEffect(() => {
    if (open) {
      // Highlight AI Suggestions command for 2s
      const timer = setTimeout(() => setHighlightAi(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [open]);
  ```

  ```tsx
  // In command item render
  {item.id === 'ai-suggestions' && highlightAi && (
    <motion.div
      className="absolute inset-0 rounded-lg bg-[var(--accent-primary)]/5 pointer-events-none"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  )}
  ```

- [ ] **P2.1c** — Add keyboard shortcut hint
  - Next to command: `⌘+⇧+I` or similar (optional)
  - Only show if space permits

**Expected outcome:** AI Suggestions accessible via Ctrl+K, subtly highlighted on first open

---

## P2.2 — Modal Architecture

### Tasks:
- [ ] **P2.2a** — Create `app/components/admin/ai-suggestions/AiSuggestionsModal.tsx`
  - Props: `open: boolean`, `onClose: () => void`
  - Uses existing modal pattern (backdrop + centered card)
  - Manages internal state: `step: 'upload' | 'analyzing' | 'reviewing' | 'applying' | 'success'`
  - Responsive: full-width on mobile, constrained on desktop (max-width-2xl)

- [ ] **P2.2b** — Add smooth step transitions
  ```typescript
  const stepContent = {
    upload: <UploadStep />,
    analyzing: <AnalyzingStep />,
    reviewing: <ReviewStep />,
    applying: <ApplyingStep />,
    success: <SuccessStep />,
  };
  
  <AnimatePresence mode="wait">
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {stepContent[step]}
    </motion.div>
  </AnimatePresence>
  ```

**Expected outcome:** Smooth modal with multi-step flow

---

# PHASE 3: UPLOAD STEP (FILE SELECTION)

## P3.1 — Upload Interface

### Tasks:
- [ ] **P3.1a** — Create `app/components/admin/ai-suggestions/UploadStep.tsx`
  - Header: "Upload Resume" with subtext "Analyze your resume to get AI content suggestions"
  - Drag-and-drop zone (styled as empty card state)
  - File input button
  - Supported types indicator

- [ ] **P3.1b** — Implement drag-and-drop
  ```typescript
  const [isDragActive, setIsDragActive] = useState(false);
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };
  ```

- [ ] **P3.1c** — File validation (client-side)
  ```typescript
  const SUPPORTED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  
  const SUPPORTED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
  
  const validateFile = (file: File) => {
    if (!SUPPORTED_TYPES.includes(file.type)) {
      return { valid: false, error: 'Unsupported file type. Use PDF, DOC, or DOCX.' };
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB
      return { valid: false, error: 'File too large. Max 10MB.' };
    }
    return { valid: true };
  };
  ```

- [ ] **P3.1d** — Display file preview
  ```tsx
  {selectedFile && (
    <div className="mt-4 rounded-lg border border-[var(--bg-divider)] bg-[var(--bg-primary)] p-4">
      <p className="text-sm text-[var(--text-secondary)]">
        <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
      </p>
    </div>
  )}
  ```

- [ ] **P3.1e** — Analyze button
  - Disabled until file selected
  - Show loading spinner while uploading
  - Call `/api/admin/ai-suggestions/analyze` (see P6.1)

**Expected outcome:** Professional drag-drop file upload with validation

---

# PHASE 4: ANALYZING STEP (PROGRESS)

## P4.1 — Loading State

### Tasks:
- [ ] **P4.1a** — Create `app/components/admin/ai-suggestions/AnalyzingStep.tsx`
  - Centered content with animation
  - Show: "Analyzing your resume…"
  - Animated loader (use Framer Motion pulse or spinner)
  - Optional: show file name + size

- [ ] **P4.1b** — Implement animated loader
  ```tsx
  <motion.div
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 2, repeat: Infinity }}
    className="text-3xl"
  >
    ✨
  </motion.div>
  <p className="mt-4 text-[var(--text-secondary)]">
    Analyzing your resume…
  </p>
  ```

- [ ] **P4.1c** — Timeout handling
  - If analysis > 30s, show helpful message ("This is taking longer than usual…")
  - Allow cancel

**Expected outcome:** Calm loading state with timeout fallback

---

# PHASE 5: REVIEW STEP (SUGGESTIONS)

## P5.1 — Suggestion List Display

### Tasks:
- [ ] **P5.1a** — Create `app/components/admin/ai-suggestions/ReviewStep.tsx`
  - Header: "Review Suggestions" + result summary ("5 improvements found")
  - Suggestion list (scrollable if > 8)
  - Bottom actions: "Select all" toggle + "Apply selected"

- [ ] **P5.1b** — Implement suggestion card component
  ```tsx
  interface SuggestionCardProps {
    suggestion: Suggestion;
    selected: boolean;
    onToggle: (id: string) => void;
  }
  
  export function SuggestionCard({ suggestion, selected, onToggle }: SuggestionCardProps) {
    return (
      <div className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-6">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggle(suggestion.id)}
            className="mt-1 rounded cursor-pointer"
          />
          
          <div className="flex-1 min-w-0">
            {/* Field label + confidence badge */}
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                {suggestion.field}
              </p>
              <ConfidenceBadge confidence={suggestion.confidence} />
            </div>
            
            {/* Current value */}
            <div className="mb-3">
              <p className="text-xs text-[var(--text-muted)] mb-1">Current</p>
              <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                {suggestion.currentValue}
              </p>
            </div>
            
            {/* Suggested value */}
            <div className="mb-3">
              <p className="text-xs text-[var(--text-muted)] mb-1">Suggested</p>
              <p className="text-sm font-medium text-[var(--accent-primary)]">
                {suggestion.suggestedValue}
              </p>
            </div>
            
            {/* Reasoning */}
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {suggestion.reasoning}
            </p>
          </div>
        </div>
      </div>
    );
  }
  ```

- [ ] **P5.1c** — Confidence badge component
  ```tsx
  function ConfidenceBadge({ confidence }: { confidence: number }) {
    const percent = Math.round(confidence * 100);
    let bgColor = 'bg-[var(--bg-divider)]'; // < 60%
    
    if (confidence >= 0.6 && confidence < 0.8) {
      bgColor = 'bg-[var(--accent-primary)]/20';
    } else if (confidence >= 0.8) {
      bgColor = 'bg-green-500/20';
    }
    
    return (
      <span className={`${bgColor} text-xs font-medium px-2 py-1 rounded-full`}>
        {percent}%
      </span>
    );
  }
  ```

- [ ] **P5.1d** — Selection controls
  ```tsx
  <div className="flex items-center gap-4">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={selectAll}
        onChange={(e) => {
          if (e.target.checked) {
            setSelected(new Set(suggestions.map(s => s.id)));
          } else {
            setSelected(new Set());
          }
        }}
      />
      <span className="text-sm font-medium">
        Select all ({suggestions.length})
      </span>
    </label>
    
    {selected.size > 0 && (
      <span className="text-xs text-[var(--text-muted)]">
        {selected.size} selected
      </span>
    )}
  </div>
  ```

- [ ] **P5.1e** — Empty state
  ```tsx
  {suggestions.length === 0 && (
    <div className="text-center py-12">
      <p className="text-[var(--text-secondary)]">
        No improvements found. Your resume is looking great! 🎉
      </p>
    </div>
  )}
  ```

**Expected outcome:** Clean, scannable suggestion list with intelligent selection

---

## P5.2 — Optional Filtering & Sorting

### Tasks (Low Priority — Phase 2+):
- [ ] **P5.2a** — Filter by field type
  - Dropdown: "All Fields" | "Bio" | "Experience" | "Projects" | "Skills"
  - Updates list in real-time

- [ ] **P5.2b** — Sort options
  - Default: by confidence descending
  - Option: by field name alphabetical

**Expected outcome:** Easier discovery for large suggestion sets

---

# PHASE 6: API INTEGRATION

## P6.1 — Backend API Routes

### Tasks:
- [ ] **P6.1a** — Create `/api/admin/ai-suggestions/analyze` endpoint
  ```typescript
  // app/api/admin/ai-suggestions/analyze/route.ts
  import { NextRequest, NextResponse } from 'next/server';
  
  export async function POST(req: NextRequest) {
    // Check auth
    const token = req.headers.get('Authorization');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Create new FormData for backend
    const backendForm = new FormData();
    backendForm.append('file', file);
    
    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/portfolios/analyze`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': token,
      },
      body: backendForm,
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Analysis failed' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  }
  ```

- [ ] **P6.1b** — Create `/api/admin/ai-suggestions/apply` endpoint
  ```typescript
  // app/api/admin/ai-suggestions/apply/route.ts
  import { NextRequest, NextResponse } from 'next/server';
  
  export async function POST(req: NextRequest) {
    const token = req.headers.get('Authorization');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const body = await req.json();
    
    // Validate request shape
    if (!Array.isArray(body.updates)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    
    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/portfolios/apply`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Apply failed' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  }
  ```

- [ ] **P6.1c** — Add auth middleware
  - Both endpoints require valid session
  - Return 401 if no auth header
  - (Integrate with existing admin auth)

**Expected outcome:** Protected API routes that proxy to backend safely

---

## P6.2 — Frontend API Calls

### Tasks:
- [ ] **P6.2a** — Create hook: `useAiSuggestions()`
  ```typescript
  // app/components/admin/ai-suggestions/useAiSuggestions.ts
  import { useState } from 'react';
  
  export function useAiSuggestions() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const analyze = async (file: File) => {
      setLoading(true);
      setError(null);
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/admin/ai-suggestions/analyze', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`, // implement getAuthToken
          },
        });
        
        if (!response.ok) throw new Error('Analyze failed');
        
        const data = await response.json();
        return data.data; // { fileUrl, suggestions }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    };
    
    const apply = async (updates: ApplyUpdate[]) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/admin/ai-suggestions/apply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({ updates }),
        });
        
        if (!response.ok) throw new Error('Apply failed');
        
        const data = await response.json();
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    };
    
    return { analyze, apply, loading, error };
  }
  ```

- [ ] **P6.2b** — Error handling
  - Display error in modal
  - Allow retry
  - Show specific error messages (401 → re-auth, 413 → file too large, etc.)

**Expected outcome:** Clean, reusable API integration

---

# PHASE 7: APPLY STEP (EXECUTION)

## P7.1 — Apply Interface

### Tasks:
- [ ] **P7.1a** — Create `app/components/admin/ai-suggestions/ApplyingStep.tsx`
  - Similar to AnalyzingStep
  - Show: "Applying changes…"
  - Progress indicator (optional: per-item)
  - Disable cancel once started

- [ ] **P7.1b** — Apply logic
  ```typescript
  const handleApply = async () => {
    const updates = Array.from(selectedIds).map(id => {
      const suggestion = suggestions.find(s => s.id === id)!;
      return {
        field: suggestion.field,
        value: suggestion.suggestedValue,
        expectedCurrent: suggestion.currentValue,
      };
    });
    
    try {
      await apply(updates);
      setStep('success');
    } catch (err) {
      setError(err.message);
    }
  };
  ```

**Expected outcome:** Smooth apply flow with error recovery

---

# PHASE 8: SUCCESS STEP (CONFIRMATION)

## P8.1 — Success Feedback

### Tasks:
- [ ] **P8.1a** — Create `app/components/admin/ai-suggestions/SuccessStep.tsx`
  - Success icon + message
  - Show: "Applied X changes to your portfolio"
  - Button: "View changes" (link to /admin/content)
  - Button: "Close"

- [ ] **P8.1b** — Trigger content refresh
  - After success, optionally refresh parent state
  - Show toast notification: "Content updated"
  - Redirect to content page or close modal

**Expected outcome:** Satisfying completion experience

---

# PHASE 9: ERROR HANDLING & EDGE CASES

## P9.1 — Comprehensive Error States

### Tasks:
- [ ] **P9.1a** — Handle analyze errors
  ```typescript
  {error && (
    <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/5 p-4">
      <p className="text-sm text-red-400">
        <strong>Error:</strong> {error}
      </p>
      <button
        onClick={() => {
          setError(null);
          setStep('upload');
        }}
        className="mt-2 text-xs font-medium text-red-400 hover:text-red-300"
      >
        Try another file
      </button>
    </div>
  )}
  ```

- [ ] **P9.1b** — Handle apply errors
  - Show error banner but keep selection
  - Offer retry button
  - Log to Sentry (if using error tracking)

- [ ] **P9.1c** — Unauthorized (401)
  - Redirect to login
  - Show: "Session expired. Please sign in again."

- [ ] **P9.1d** — No suggestions found
  - Show empty state
  - Offer download resume template
  - Suggest manual review instead

- [ ] **P9.1e** — Timeout handling
  - If > 30s with no response, show timeout message
  - Offer cancel + retry

**Expected outcome:** Graceful error handling for all scenarios

---

# PHASE 10: ACCESSIBILITY & KEYBOARD NAVIGATION

## P10.1 — Keyboard Support

### Tasks:
- [ ] **P10.1a** — Tab navigation
  - File input → Analyze button → (if reviewing) Checkboxes → Apply button
  - Proper `tabIndex` and focus management

- [ ] **P10.1b** — Keyboard shortcuts
  - `Escape` → Close modal
  - `Ctrl+Enter` or `Cmd+Enter` → Apply (if reviewing)
  - `Ctrl+A` → Select all (if reviewing)

- [ ] **P10.1c** — ARIA labels
  ```tsx
  <input
    type="checkbox"
    aria-label={`Toggle suggestion: ${suggestion.field}`}
    checked={selected}
    onChange={() => onToggle(suggestion.id)}
  />
  
  <div
    role="status"
    aria-live="polite"
    aria-label={`${selected.size} of ${suggestions.length} suggestions selected`}
  />
  ```

**Expected outcome:** Full keyboard accessibility

---

## P10.2 — Screen Reader Support

### Tasks:
- [ ] **P10.2a** — Add aria-busy during loading
  ```tsx
  <div aria-busy={loading} aria-label="Analyzing resume">
    {/* content */}
  </div>
  ```

- [ ] **P10.2b** — Announce changes
  ```tsx
  <div
    role="status"
    aria-live="assertive"
    aria-label={`${selected.size} suggestions selected`}
  />
  ```

- [ ] **P10.2c** — Announce steps
  - "Step 1 of 5: Upload resume"
  - "Step 2 of 5: Analyzing"
  - etc.

**Expected outcome:** Fully accessible to screen readers

---

# PHASE 11: TESTING & VALIDATION

## P11.1 — Functional Testing

### Tasks:
- [ ] **P11.1a** — Upload flow
  - [ ] File validation works (rejects invalid types)
  - [ ] Drag-drop works
  - [ ] Size limit enforced (10MB)
  - [ ] Loading state appears
  - [ ] Suggestions load correctly

- [ ] **P11.1b** — Selection flow
  - [ ] Individual checkboxes work
  - [ ] "Select all" works
  - [ ] Selection persists during nav
  - [ ] Count updates correctly

- [ ] **P11.1c** — Apply flow
  - [ ] Only enabled with selection
  - [ ] Sends correct payload
  - [ ] Success/error states work
  - [ ] Modal closes on success

- [ ] **P11.1d** — Error cases
  - [ ] 401 → re-auth prompt
  - [ ] 413 → file too large error
  - [ ] 500 → generic error + retry
  - [ ] Timeout → timeout message + retry

**Expected outcome:** All flows functional

---

## P11.2 — Design & Visual Testing

### Tasks:
- [ ] **P11.2a** — Responsive testing
  - Mobile (375px): all elements stack, readable
  - Tablet (768px): layout balanced
  - Desktop (1440px+): proper proportions

- [ ] **P11.2b** — Dark mode testing
  - Colors contrast-compliant
  - No color-only indicators
  - Badges visible

- [ ] **P11.2c** — Motion testing
  - Animations smooth (60fps)
  - Respect `prefers-reduced-motion`
  - No janky transitions

- [ ] **P11.2d** — Browser testing
  - Chrome, Firefox, Safari, Edge
  - Mobile browsers (iOS Safari, Chrome Mobile)

**Expected outcome:** Pixel-perfect, cross-browser compatible

---

## P11.3 — Accessibility Testing

### Tasks:
- [ ] **P11.3a** — Keyboard navigation
  - Tab through all elements
  - All buttons reachable
  - Focus visible everywhere

- [ ] **P11.3b** — Screen reader testing
  - NVDA on Windows
  - JAWS (if available)
  - VoiceOver on Mac/iOS

- [ ] **P11.3c** — Color contrast
  - WCAG AA minimum (4.5:1 for text)
  - Run Lighthouse accessibility audit
  - Use axe DevTools browser extension

**Expected outcome:** WCAG AA compliant

---

# PHASE 12: MONITORING & ANALYTICS

## P12.1 — Error Tracking

### Tasks:
- [ ] **P12.1a** — Log errors to Sentry (if using)
  ```typescript
  try {
    await analyze(file);
  } catch (err) {
    Sentry.captureException(err, {
      tags: { feature: 'ai-suggestions', step: 'analyze' },
    });
  }
  ```

- [ ] **P12.1b** — Track API response times
  - Log analyze latency
  - Log apply latency
  - Monitor for slow requests

**Expected outcome:** Visibility into errors and performance

---

## P12.2 — Usage Analytics

### Tasks:
- [ ] **P12.2a** — Track feature adoption
  - Count: modal opens
  - Count: successful analyzes
  - Count: suggestions applied

- [ ] **P12.2b** — Track user journey
  - Which step users drop off at
  - Average time per step
  - Error rate

**Expected outcome:** Understand usage patterns

---

# PHASE 13: DOCUMENTATION & HANDOFF

## P13.1 — Developer Documentation

### Tasks:
- [ ] **P13.1a** — Create `FEATURES_AI_SUGGESTIONS.md`
  - Architecture overview
  - Component hierarchy
  - Data flow diagram
  - API contract
  - Error codes reference

- [ ] **P13.1b** — Add inline code comments
  - Complex logic explained
  - WHY decisions documented
  - Edge cases noted

**Expected outcome:** Maintainable code

---

## P13.2 — User Documentation

### Tasks:
- [ ] **P13.2a** — Add to `ADMIN_GUIDE.md`
  - How to access: "Press Ctrl+K, then select 'AI Suggestions'"
  - Supported file formats
  - What each field means
  - Tips: "Accept high-confidence suggestions, review others carefully"
  - Troubleshooting: "File too large? Compress or use a shorter resume"

- [ ] **P13.2b** — Add in-app help text
  - Tooltips on hover
  - Helpful empty states
  - Success message explains what changed

**Expected outcome:** Users know how to use feature

---

# QUICK IMPLEMENTATION CHECKLIST

## Phase 1 — Design System
- [ ] P1.1 Design tokens documented
- [ ] P1.2 Shared styles created

## Phase 2 — Integration
- [ ] P2.1 Command palette extended
- [ ] P2.2 Modal architecture

## Phase 3–8 — UI Steps
- [ ] P3.1 Upload step
- [ ] P4.1 Analyzing step
- [ ] P5.1 Review step
- [ ] P5.2 Filtering (optional)
- [ ] P6.1 API routes
- [ ] P6.2 Frontend hooks
- [ ] P7.1 Applying step
- [ ] P8.1 Success step

## Phase 9–13 — Polish & Release
- [ ] P9.1 Error handling
- [ ] P10.1 Keyboard nav
- [ ] P10.2 Screen readers
- [ ] P11.1 Functional tests
- [ ] P11.2 Design tests
- [ ] P11.3 Accessibility tests
- [ ] P12.1 Error tracking
- [ ] P12.2 Analytics
- [ ] P13.1 Dev docs
- [ ] P13.2 User docs

---

# FILE STRUCTURE

```
app/
├── components/admin/ai-suggestions/
│   ├── AiSuggestionsModal.tsx          [Main component]
│   ├── UploadStep.tsx                  [File upload]
│   ├── AnalyzingStep.tsx               [Loading]
│   ├── ReviewStep.tsx                  [Suggestion list]
│   ├── SuggestionCard.tsx              [Card component]
│   ├── ConfidenceBadge.tsx             [Badge component]
│   ├── ApplyingStep.tsx                [Applying]
│   ├── SuccessStep.tsx                 [Success]
│   ├── useAiSuggestions.ts             [API hook]
│   ├── styles.ts                       [Shared styles]
│   └── types.ts                        [TypeScript definitions]
├── api/admin/ai-suggestions/
│   ├── analyze/route.ts                [Analyze endpoint]
│   └── apply/route.ts                  [Apply endpoint]
└── layout.tsx                          [Integrate in command palette]
```

---

# ENVIRONMENT VARIABLES

```env
# Already in .env.local
NEXT_PUBLIC_API_BASE_URL=https://oma-api.uriri.com.ng

# Additional (optional, for analytics)
NEXT_PUBLIC_SENTRY_DSN=<your-sentry-dsn>
```

---

# SUCCESS CRITERIA

✅ AI Suggestions accessible via Ctrl+K
✅ Upload/analyze/review/apply workflow works end-to-end
✅ Design matches admin aesthetic (colors, spacing, buttons)
✅ All error cases handled gracefully
✅ Full keyboard navigation support
✅ WCAG AA accessibility compliant
✅ Mobile responsive (375px–2560px)
✅ Smooth animations (60fps, respects prefers-reduced-motion)
✅ API calls use environment variables
✅ User can apply suggestions and see changes in portfolio
✅ Documentation complete (dev + user)

---

## Notes

1. **Environment variables:** Always use `process.env.API_BASE_URL` instead of hardcoding URLs
2. **Auth:** Integrate with existing admin session/auth system
3. **Design tokens:** Use CSS variables consistently (no hardcoded colors)
4. **Motion:** Always wrap animations with `motion-safe:` Tailwind utility
5. **Error tracking:** Optional but recommended (Sentry, LogRocket, etc.)
6. **Analytics:** Optional but recommended for feature adoption insights
