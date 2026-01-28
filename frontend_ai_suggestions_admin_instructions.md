# Admin UI: AI Suggestions (Ctrl+K Command) — Implementation Instructions

This document specifies how to add an AI Suggestions workflow to the Admin UI. The flow uses two API endpoints:

- **Analyze (upload file → suggestions):** `POST /v1/portfolios/analyze`
- **Apply (selected suggestions → update):** `POST /v1/portfolios/apply`

The UI is accessed via a **special Ctrl+K command** in the Admin panel.

---

## 1) UX Overview (Required Flow)

1) **User presses Ctrl+K**
   - A **special command** appears at the top of the command list.
   - It should **glow** when Ctrl+K is pressed to indicate it’s special.

2) **User clicks “AI Suggestions” command**
   - Opens a modal/panel with the AI workflow.

3) **Upload Resume**
   - Show file upload control.
   - Display supported doc types (see below).

4) **Analyze**
   - Upload the file to the analyze endpoint.
   - Receive suggestions list with confidence scores.

5) **Select Suggestions**
   - Allow “Select all” and individual selection.
   - Show confidence and reasoning per suggestion.

6) **Apply Selected Suggestions**
   - Send selected items to the apply endpoint.
   - Show success/failure state.

---

## 2) Command Palette Requirements (Ctrl+K)

### Command definition
- **Name:** AI Suggestions
- **Description:** “Upload a resume to get AI content improvements.”
- **Position:** Top of list
- **Special styling:** Must glow on Ctrl+K open

### Visual treatment
- Add a short pulsing glow (e.g., 1.5s pulse) when Ctrl+K opens.
- Ensure the glow only targets the AI Suggestions command.
- Use a subtle accent color (e.g. brand accent) to avoid noise.

### Behavior
- Clicking the command opens the AI Suggestions modal/panel.
- Closing the modal returns the user to the Admin screen.

---

## 3) File Upload + Analyze (Endpoint 1)

### Endpoint
```
POST https://oma-api.uriri.com.ng/v1/portfolios/analyze
Content-Type: multipart/form-data
Form field: file
```

### Example request (curl)
```
curl -X POST \
  'https://oma-api.uriri.com.ng/v1/portfolios/analyze' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@resume.docx;type=application/vnd.openxmlformats-officedocument.wordprocessingml.document'
```

### Response shape
```json
{
  "status_code": 0,
  "data": {
    "fileUrl": "string",
    "suggestions": [
      {
        "id": "string",
        "field": "string",
        "currentValue": "string",
        "suggestedValue": "string",
        "reasoning": "string",
        "confidence": 1
      }
    ]
  },
  "detail": "string"
}
```

### UI requirements
- Upload control with supported file types listed below.
- Disable “Analyze” button until a file is selected.
- Show progress state while uploading.
- On success, display the list of suggestions.
- On error, show an error banner and allow retry.

### Supported doc types (display in UI)
- `.pdf` (application/pdf)
- `.docx` (application/vnd.openxmlformats-officedocument.wordprocessingml.document)
- `.doc` (application/msword)

> If backend supports more types, extend the list, but do not accept unknown types in the UI.

---

## 4) Suggestions Display + Selection

### Suggestion card layout
Each suggestion should show:
- `field` (label)
- `currentValue`
- `suggestedValue`
- `reasoning`
- `confidence` score (0–1 or 0–100?)

If `confidence` is 0–1, display as percent (e.g. 0.82 → 82%).

### Selection UX
- Checkbox per suggestion
- “Select all” toggle
- “Clear all”
- Persist selection across minor UI changes

### Optional filtering (nice-to-have)
- Filter by field name
- Sort by confidence

---

## 5) Apply Selected Suggestions (Endpoint 2)

### Endpoint
```
POST https://oma-api.uriri.com.ng/v1/portfolios/apply
Content-Type: application/json
```

### Request body
```json
{
  "updates": [
    {
      "field": "string",
      "value": "string",
      "expectedCurrent": "string"
    }
  ]
}
```

### Mapping rule
For each selected suggestion:
- `field` → `suggestion.field`
- `value` → `suggestion.suggestedValue`
- `expectedCurrent` → `suggestion.currentValue`

### UI requirements
- Disable “Apply” until at least one suggestion is selected.
- Show loading state while applying.
- On success, show a confirmation and close the modal (or refresh data).
- On failure, show error with retry option.

---

## 6) State Model (Suggested)

```ts
interface Suggestion {
  id: string;
  field: string;
  currentValue: string;
  suggestedValue: string;
  reasoning: string;
  confidence: number;
}

interface AnalyzeResponse {
  fileUrl: string;
  suggestions: Suggestion[];
}

interface ApplyUpdate {
  field: string;
  value: string;
  expectedCurrent: string;
}
```

---

## 7) Error Handling Rules

- **Analyze error:** Keep modal open, show error banner.
- **Apply error:** Do not clear selection; allow retry.
- **No suggestions:** Show empty state (“No improvements found”).
- **Unauthorized / 401:** Prompt user to re-authenticate.

---

## 8) Accessibility Requirements

- Ctrl+K should open the command palette as usual.
- AI Suggestions command must be keyboard selectable.
- Upload control should be fully keyboard accessible.
- Suggestion list should be tab-navigable.

---

## 9) Visual Notes

- The “AI Suggestions” command should be visually distinguished (glow or subtle pulse).
- Use muted background for suggestion cards; emphasize `suggestedValue`.
- Confidence can be rendered as a small badge.

---

## 10) Integration Checklist

- [ ] Add AI Suggestions command to Ctrl+K palette
- [ ] Implement glow effect on palette open
- [ ] Build modal/panel with upload → analyze → suggestions → apply flow
- [ ] Wire analyze endpoint (multipart)
- [ ] Wire apply endpoint (JSON)
- [ ] Ensure selection mapping to updates is correct
- [ ] Handle loading + error states

