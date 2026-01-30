"use client";

import { useMemo, useState } from "react";
import type { CaseStudy } from "../../../lib/types";
import Button from "../../admin/components/Button";
import AiFieldSuggestion from "./ai-suggestions/AiFieldSuggestion";

interface CaseStudyEditorProps {
  caseStudy?: CaseStudy;
  onUpdate: (next: CaseStudy | undefined) => void;
  targetBase: string;
}

function computeStatus(caseStudy?: CaseStudy) {
  const overview = caseStudy?.overview?.trim();
  const goal = caseStudy?.goal?.trim();
  const roleTitle = caseStudy?.role?.title?.trim();
  const bullets = (caseStudy?.role?.bullets ?? []).filter((b) => b.trim());
  const screenshots = (caseStudy?.screenshots ?? []).filter((s) => s.src.trim());
  const outcomes = (caseStudy?.outcomes ?? []).filter((o) => o.trim());

  const hasAny =
    overview || goal || roleTitle || bullets.length > 0 || screenshots.length > 0 || outcomes.length > 0;
  if (!hasAny) return "empty";

  const complete =
    (overview || goal) &&
    (screenshots.length > 0 || outcomes.length >= 2 || bullets.length >= 2);

  return complete ? "complete" : "draft";
}

export default function CaseStudyEditor({
  caseStudy,
  onUpdate,
  targetBase,
}: CaseStudyEditorProps) {
  const [open, setOpen] = useState(Boolean(caseStudy));
  const status = useMemo(() => computeStatus(caseStudy), [caseStudy]);

  const update = (partial: Partial<CaseStudy>) => {
    onUpdate({
      ...(caseStudy ?? {}),
      ...partial,
    });
  };

  const updateRole = (partial: NonNullable<CaseStudy["role"]>) => {
    onUpdate({
      ...(caseStudy ?? {}),
      role: {
        ...(caseStudy?.role ?? {}),
        ...partial,
      },
    });
  };

  return (
    <div className="mt-4 border-t border-[var(--bg-divider)] pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Case Study (optional)
          </span>
          <span
            className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] ${
              status === "complete"
                ? "bg-emerald-500/15 text-emerald-200"
                : status === "draft"
                ? "bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]"
                : "text-[var(--text-muted)]"
            }`}
          >
            {status}
          </span>
        </div>
        <Button variant="secondary" onClick={() => setOpen((prev) => !prev)}>
          {open ? "Collapse" : "Expand"}
        </Button>
      </div>

      {open ? (
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Overview
            </label>
            <div className="mt-2 flex gap-3">
              <textarea
                className="min-h-[120px] w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                placeholder="1–3 paragraphs. Explain context and what this project is."
                value={caseStudy?.overview ?? ""}
                onChange={(event) => update({ overview: event.target.value })}
                maxLength={1500}
              />
              <AiFieldSuggestion
                targetPath={`${targetBase}.overview`}
                currentValue={caseStudy?.overview ?? ""}
                onApply={(value) => update({ overview: value })}
                label="Overview"
              />
            </div>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {(caseStudy?.overview ?? "").length}/1500
            </p>
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
              The goal
            </label>
            <div className="mt-2 flex gap-3">
              <textarea
                className="min-h-[90px] w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                placeholder="What you were trying to achieve (clear and specific)."
                value={caseStudy?.goal ?? ""}
                onChange={(event) => update({ goal: event.target.value })}
                maxLength={500}
              />
              <AiFieldSuggestion
                targetPath={`${targetBase}.goal`}
                currentValue={caseStudy?.goal ?? ""}
                onApply={(value) => update({ goal: value })}
                label="Goal"
              />
            </div>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {(caseStudy?.goal ?? "").length}/500
            </p>
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Role title
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                placeholder="Full-Stack Engineer"
                value={caseStudy?.role?.title ?? ""}
                onChange={(event) => updateRole({ title: event.target.value })}
                maxLength={100}
              />
              <AiFieldSuggestion
                targetPath={`${targetBase}.role.title`}
                currentValue={caseStudy?.role?.title ?? ""}
                onApply={(value) => updateRole({ title: value })}
                label="Role title"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Role bullets
            </label>
            {(caseStudy?.role?.bullets ?? []).map((bullet, index) => (
              <div key={index} className="flex flex-wrap items-center gap-2">
                <input
                  className="flex-1 rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                  placeholder={`Bullet ${index + 1}`}
                  value={bullet}
                  onChange={(event) => {
                    const next = [...(caseStudy?.role?.bullets ?? [])];
                    next[index] = event.target.value;
                    updateRole({ bullets: next });
                  }}
                  maxLength={150}
                />
                <AiFieldSuggestion
                  targetPath={`${targetBase}.role.bullets[${index}]`}
                  currentValue={bullet}
                  onApply={(value) => {
                    const next = [...(caseStudy?.role?.bullets ?? [])];
                    next[index] = value;
                    updateRole({ bullets: next });
                  }}
                  label={`Bullet ${index + 1}`}
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    const next = [...(caseStudy?.role?.bullets ?? [])];
                    next.splice(index, 1);
                    updateRole({ bullets: next });
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              onClick={() =>
                updateRole({ bullets: [...(caseStudy?.role?.bullets ?? []), ""] })
              }
            >
              Add bullet
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Project screenshots
            </label>
            {(caseStudy?.screenshots ?? []).map((shot, index) => (
              <div key={index} className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <input
                      className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
                      placeholder="Image URL or path"
                      value={shot.src}
                      onChange={(event) => {
                        const next = [...(caseStudy?.screenshots ?? [])];
                        next[index] = { ...next[index], src: event.target.value };
                        update({ screenshots: next });
                      }}
                    />
                    <AiFieldSuggestion
                      targetPath={`${targetBase}.screenshots[${index}].src`}
                      currentValue={shot.src}
                      onApply={(value) => {
                        const next = [...(caseStudy?.screenshots ?? [])];
                        next[index] = { ...next[index], src: value };
                        update({ screenshots: next });
                      }}
                      label="Screenshot URL"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
                      placeholder="Alt text (optional)"
                      value={shot.alt ?? ""}
                      onChange={(event) => {
                        const next = [...(caseStudy?.screenshots ?? [])];
                        next[index] = { ...next[index], alt: event.target.value };
                        update({ screenshots: next });
                      }}
                    />
                    <AiFieldSuggestion
                      targetPath={`${targetBase}.screenshots[${index}].alt`}
                      currentValue={shot.alt ?? ""}
                      onApply={(value) => {
                        const next = [...(caseStudy?.screenshots ?? [])];
                        next[index] = { ...next[index], alt: value };
                        update({ screenshots: next });
                      }}
                      label="Alt text"
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <input
                    className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
                    placeholder="Caption (optional)"
                    value={shot.caption ?? ""}
                    onChange={(event) => {
                      const next = [...(caseStudy?.screenshots ?? [])];
                      next[index] = { ...next[index], caption: event.target.value };
                      update({ screenshots: next });
                    }}
                  />
                  <AiFieldSuggestion
                    targetPath={`${targetBase}.screenshots[${index}].caption`}
                    currentValue={shot.caption ?? ""}
                    onApply={(value) => {
                      const next = [...(caseStudy?.screenshots ?? [])];
                      next[index] = { ...next[index], caption: value };
                      update({ screenshots: next });
                    }}
                    label="Caption"
                  />
                </div>
                {shot.src ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--bg-divider)]">
                    <img
                      src={shot.src}
                      alt={shot.alt ?? "Screenshot"}
                      className="h-auto w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <div className="mt-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const next = [...(caseStudy?.screenshots ?? [])];
                      next.splice(index, 1);
                      update({ screenshots: next });
                    }}
                  >
                    Remove screenshot
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="secondary"
              onClick={() =>
                update({
                  screenshots: [
                    ...(caseStudy?.screenshots ?? []),
                    { src: "", alt: "", caption: "" },
                  ],
                })
              }
            >
              Add screenshot
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Outcomes
            </label>
            {(caseStudy?.outcomes ?? []).map((outcome, index) => (
              <div key={index} className="flex flex-wrap items-center gap-2">
                <input
                  className="flex-1 rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                  placeholder={`Outcome ${index + 1}`}
                  value={outcome}
                  onChange={(event) => {
                    const next = [...(caseStudy?.outcomes ?? [])];
                    next[index] = event.target.value;
                    update({ outcomes: next });
                  }}
                  maxLength={200}
                />
                <AiFieldSuggestion
                  targetPath={`${targetBase}.outcomes[${index}]`}
                  currentValue={outcome}
                  onApply={(value) => {
                    const next = [...(caseStudy?.outcomes ?? [])];
                    next[index] = value;
                    update({ outcomes: next });
                  }}
                  label={`Outcome ${index + 1}`}
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    const next = [...(caseStudy?.outcomes ?? [])];
                    next.splice(index, 1);
                    update({ outcomes: next });
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              onClick={() =>
                update({ outcomes: [...(caseStudy?.outcomes ?? []), ""] })
              }
            >
              Add outcome
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
