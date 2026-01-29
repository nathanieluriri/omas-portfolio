"use client";

import { useRouter } from "next/navigation";
import AdminShell from "../../components/AdminShell";
import SurfaceCard from "../../components/SurfaceCard";
import Button from "../../components/Button";
import { aiStyles } from "../../../components/admin/ai-suggestions/styles";
import { useAiSuggestions } from "../../../components/admin/ai-suggestions/AiSuggestionsProvider";
import AiSuggestionsTour, {
  setAiSuggestionsTourStep,
} from "../../../components/admin/ai-suggestions/AiSuggestionsTour";

const confidenceLabel = (value: number) => {
  const normalized = value > 1 ? value / 100 : value;
  return Math.round(normalized * 100);
};

export default function AiSuggestionsSelectionsPage() {
  const router = useRouter();
  const {
    suggestions,
    selectedIds,
    selectedSuggestions,
    toggleSelection,
    selectAll,
    applySelected,
    applyError,
    isApplying,
    hasAnalyzed,
  } = useAiSuggestions();

  const handleApply = async () => {
    const ok = await applySelected();
    if (ok) {
      setAiSuggestionsTourStep("final");
      router.push("/admin/ai-suggestions/final");
    }
  };

  const hasSuggestions = suggestions.length > 0;

  return (
    <AdminShell
      title="AI Suggestions"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "AI Suggestions", href: "/admin/ai-suggestions" },
        { label: "Selections" },
      ]}
    >
      <AiSuggestionsTour page="selections" />
      <SurfaceCard className={aiStyles.card}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className={aiStyles.stepPill}>Step 2 of 3 · Selections</span>
            <h2 className={aiStyles.title}>Choose what to apply</h2>
            <p className={aiStyles.helper}>
              Nothing changes until you confirm. Select the updates that feel right.
            </p>
          </div>

          {!hasAnalyzed ? (
            <div className={aiStyles.subCard}>
              <p className="text-sm text-[var(--text-secondary)]">
                Run an analysis first to generate suggestions.
              </p>
            </div>
          ) : null}

          {hasSuggestions ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className={aiStyles.label}>{suggestions.length} suggestions</p>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={() => selectAll(true)}>
                    Select all
                  </Button>
                  <Button variant="secondary" onClick={() => selectAll(false)}>
                    Clear
                  </Button>
                </div>
              </div>

              <div className="flex max-h-[440px] flex-col gap-3 overflow-y-auto pr-1">
                {suggestions.map((item) => {
                  const selected = selectedIds.has(item.id);
                  return (
                    <div key={item.id} className={aiStyles.subCard}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {item.field}
                          </p>
                          <p className="mt-1 text-xs text-[var(--text-secondary)]">
                            {item.reasoning}
                          </p>
                        </div>
                        <span className={aiStyles.statusPill}>
                          {confidenceLabel(item.confidence)}% confidence
                        </span>
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-[var(--bg-divider)]/70 bg-[var(--bg-primary)] p-3">
                          <p className={aiStyles.label}>Current</p>
                          <p className="mt-2 text-sm text-[var(--text-secondary)]">
                            {item.currentValue || "—"}
                          </p>
                        </div>
                        <div className="rounded-xl border border-[var(--bg-divider)]/70 bg-[var(--bg-primary)] p-3">
                          <p className={aiStyles.label}>Suggested</p>
                          <p className="mt-2 text-sm text-[var(--text-primary)]">
                            {item.suggestedValue || "—"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button
                          variant={selected ? "primary" : "secondary"}
                          onClick={() => toggleSelection(item.id)}
                        >
                          {selected ? "Selected" : "Select"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            hasAnalyzed && (
              <div className={aiStyles.subCard}>
                <p className="text-sm text-[var(--text-secondary)]">
                  No suggestions were found for this resume.
                </p>
              </div>
            )
          )}

          {applyError ? (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {applyError}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="secondary"
              onClick={() => router.push("/admin/ai-suggestions/analysis")}
            >
              Back to analysis
            </Button>
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <span>{selectedSuggestions.length} selected</span>
              <Button
                variant="primary"
                onClick={handleApply}
                disabled={selectedSuggestions.length === 0 || isApplying}
                data-tour="ai-apply"
              >
                {isApplying ? "Applying..." : "Apply and continue"}
              </Button>
            </div>
          </div>
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
