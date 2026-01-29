"use client";

import { useRouter } from "next/navigation";
import AdminShell from "../../components/AdminShell";
import SurfaceCard from "../../components/SurfaceCard";
import Button from "../../components/Button";
import { aiStyles } from "../../../components/admin/ai-suggestions/styles";
import { useAiSuggestions } from "../../../components/admin/ai-suggestions/AiSuggestionsProvider";

export default function AiSuggestionsFinalPage() {
  const router = useRouter();
  const { hasApplied, selectedSuggestions, suggestions } = useAiSuggestions();

  return (
    <AdminShell
      title="AI Suggestions"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "AI Suggestions", href: "/admin/ai-suggestions" },
        { label: "Final" },
      ]}
    >
      <SurfaceCard className={aiStyles.card}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className={aiStyles.stepPill}>Step 3 of 3 · Final</span>
            <h2 className={aiStyles.title}>Review your updates</h2>
            <p className={aiStyles.helper}>
              Your portfolio stays unchanged until you apply suggestions.
            </p>
          </div>

          {hasApplied ? (
            <div className={aiStyles.subCard}>
              <p className="text-sm text-[var(--text-primary)]">
                Applied {selectedSuggestions.length} of {suggestions.length} suggestions.
              </p>
              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                Open the Content editor to confirm everything reads how you want.
              </p>
            </div>
          ) : (
            <div className={aiStyles.subCard}>
              <p className="text-sm text-[var(--text-secondary)]">
                Apply suggestions on the Selections page to finish this flow.
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => router.push("/admin/ai-suggestions/selections")}
            >
              Back to selections
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                router.push("/admin/content");
              }}
            >
              Open Content editor
            </Button>
          </div>
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
