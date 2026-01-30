Suggestion API – Quick Guide

Overview

Generates AI-powered, schema-valid partial patches for any portfolio section/field. Input can be raw text, an uploaded document, or a previously uploaded resume.

Endpoint: POST /v1/suggestions/generate

Auth: Bearer access token (member)

Consumes: multipart/form-data

Produces: application/json

Form Fields

target_path (required, string): Dot/bracket path, e.g. hero.title, experience[0].role, projects[1].caseStudy.overview.

text_input (optional, string): Raw text/context.

file (optional, file): PDF, DOCX, or TXT.

use_existing_resume (optional, bool): true to reuse stored resumeUrl on the user’s portfolio. Ignored if file or text_input is provided.

Priority for content extraction: text_input → file → use_existing_resume.

Successful Response Shape

{
  "status_code": 200,
  "detail": "Suggestion generated",
  "data": {
    "target": "hero.title",
    "patch": {
      "hero": { "title": "Senior Systems Engineer" }
    },
    "source_length": 12456
  }
}


Error Responses (examples)

400: validation issues (missing target_path, unsupported file type, no resume to reuse, AI JSON validation failure).

401/403: auth or account status failures.

502: upstream AI error.

Example Calls

1) Simple text input (update hero title)

curl -X POST [https://api.yourdomain.com/v1/suggestions/generate](https://api.yourdomain.com/v1/suggestions/generate) \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -F "target_path=hero.title" \
  -F "text_input=I am Jane Doe, a senior systems engineer specializing in distributed systems."


2) PDF upload to populate experience[0]

curl -X POST [https://api.yourdomain.com/v1/suggestions/generate](https://api.yourdomain.com/v1/suggestions/generate) \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -F "target_path=experience[0]" \
  -F "file=@/path/to/resume.pdf;type=application/pdf"


Example success:

{
  "status_code": 200,
  "detail": "Suggestion generated",
  "data": {
    "target": "experience[0]",
    "patch": {
      "experience": [
        {
          "date": "2022 — Present",
          "role": "Backend Engineer",
          "company": "Acme Corp",
          "description": "Owns messaging platform reliability.",
          "highlights": [
            "Cut p99 latency by 35%.",
            "Led migration to event-driven architecture."
          ],
          "current": true
        }
      ]
    },
    "source_length": 8421
  }
}


3) Reuse existing resume on file

curl -X POST [https://api.yourdomain.com/v1/suggestions/generate](https://api.yourdomain.com/v1/suggestions/generate) \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -F "target_path=projects[0]" \
  -F "use_existing_resume=true"


Notes & Limits

Text is truncated to ~15,000 characters before sending to AI.

Output is validated against the portfolio schema; only fields present in the text are returned.

For list targets, the service returns the most relevant single item unless the AI supplies a full list that passes validation.

Portfolio Update Flow

This document explains how portfolio updates work in the admin panel, how each section (Hero, Experience, Projects, Skills, Contacts, Navigation, Footer) is updated, and how changes reach the public site.

1) Core Idea: Draft → Save → API

All admin pages edit a draft copy of the portfolio stored in client state. Nothing is persisted until you press Save in the Draft Bar.

The flow looks like this:

Load portfolio

usePortfolioDraft calls getMe() then getPortfolioByUser(user._id).

The response becomes both portfolio (original) and draft (editable).

Edit draft

Each admin page writes updates into draft with setDraft.

Save

Draft Bar triggers save().

save() calls:

updatePortfolio(draft) if a portfolio already exists, or

createPortfolio(draft) if none exists yet.

Public site render

The public site fetches via ISR in lib/server/portfolio.ts.

/api/revalidate can be called to refresh cached data immediately.

Key files:

Draft logic: app/admin/hooks/usePortfolioDraft.ts

API client: app/admin/lib/apiClient.ts

Public fetch: lib/server/portfolio.ts

Revalidation: app/api/revalidate/route.ts

2) Section Updates (How Each Page Works)

Each admin section updates a portion of the draft object. The update pattern is:

const next = { ...draft, section: updatedSection };
setDraft(next);


Hero Section

Route: /admin/content/hero

Fields: name, title, bio, availability

How it updates: direct updates on draft.hero.

Experience

List route: /admin/content/experience

Editor route: /admin/content/experience/[index]

How it updates:

List page routes to /new to create a new entry.

Editor page appends a new entry and then routes to the new index.

Updates are written to draft.experience[index].

Projects

List route: /admin/content/projects

Editor route: /admin/content/projects/[index]

How it updates:

New projects are created via /new then appended to draft.projects.

Updates apply to draft.projects[index].

Case study editor updates draft.projects[index].caseStudy.

Skills

List route: /admin/content/skills

Editor route: /admin/content/skills/[index]

How it updates:

Skill groups are appended to draft.skillGroups.

Edits apply to draft.skillGroups[index].

Contacts

List route: /admin/content/contacts

Editor route: /admin/content/contacts/[index]

How it updates:

New entries are appended to draft.contacts.

Edits apply to draft.contacts[index].

Navigation

List route: /admin/content/navigation

Editor route: /admin/content/navigation/[index]

How it updates:

New entries appended to draft.navItems.

Edits apply to draft.navItems[index].

Footer

Route: /admin/content/footer

Fields: copyright, tagline

How it updates: direct updates on draft.footer.

3) Theme Updates

Route: /admin/theme

Theme updates are saved in draft.theme. This includes presets and advanced custom colors.

The public site applies themeToStyle(draft.theme) in app/(site)/layout.tsx.

4) Save + Revalidate

When you press Save:

The draft is sent to the API via PATCH /v1/portfolios/.

The API response becomes the new portfolio and draft.

To instantly refresh the public site (ISR cache), call:

POST /api/revalidate
Headers:
  x-revalidate-token: <REVALIDATE_SECRET>


5) Why Drafts Matter

Drafts let you:

Make multiple edits across sections before saving.

Discard all unsaved changes in one click.

Avoid partial updates until you’re ready.