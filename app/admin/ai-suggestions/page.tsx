"use client";

import AdminShell from "../components/AdminShell";
import SurfaceCard from "../components/SurfaceCard";
import Button from "../components/Button";
import { useRouter } from "next/navigation";
import { aiStyles } from "../../components/admin/ai-suggestions/styles";
import { useAiSuggestions } from "../../components/admin/ai-suggestions/AiSuggestionsProvider";

export default function AiSuggestionsPage() {
  const router = useRouter();
  const { hasAnalyzed, hasApplied, resetFlow } = useAiSuggestions();

  const nextHref = hasApplied
    ? "/admin/ai-suggestions/final"
    : hasAnalyzed
      ? "/admin/ai-suggestions/selections"
      : "/admin/ai-suggestions/analysis";

  return (
    <AdminShell
      title="AI Suggestions"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "AI Suggestions" },
      ]}
    >
      <SurfaceCard className={aiStyles.card}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className={aiStyles.stepPill}>Start here</span>
            <h2 className={aiStyles.title}>Quiet, guided AI suggestions</h2>
            <p className={aiStyles.helper}>
              This flow keeps you in control. You upload a resume, review every
              suggestion, and only apply what you approve.
            </p>
          </div>

          <div className={aiStyles.subCard}>
            <p className={aiStyles.label}>Where to go first</p>
            <p className="mt-2 text-sm text-[var(--text-primary)]">
              Head to <strong>Analysis</strong> to upload your resume and start
              generating suggestions.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                title: "1. Analyze",
                detail: "Upload your resume and let the AI draft improvements.",
              },
              {
                title: "2. Select",
                detail: "Pick the suggestions you actually want to use.",
              },
              {
                title: "3. Apply",
                detail: "Apply the selected updates and review the result.",
              },
            ].map((step) => (
              <div key={step.title} className={aiStyles.subCard}>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {step.title}
                </p>
                <p className="mt-2 text-xs text-[var(--text-secondary)]">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>

          <div className={aiStyles.subCard}>
            <p className={aiStyles.label}>How to use it</p>
            <div className="mt-2 flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
              <span>Use a clean resume file (PDF or Word).</span>
              <span>
                You can deselect anything that feels off before applying.
              </span>
              <span>
                After applying, double-check the Content editor for any manual
                tweaks.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" onClick={() => router.push(nextHref)}>
              {hasApplied ? "View final step" : "Start analysis"}
            </Button>
            {(hasAnalyzed || hasApplied) && (
              <Button
                variant="secondary"
                onClick={() => {
                  resetFlow();
                  router.push("/admin/ai-suggestions/analysis");
                }}
              >
                Start over
              </Button>
            )}
          </div>
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
