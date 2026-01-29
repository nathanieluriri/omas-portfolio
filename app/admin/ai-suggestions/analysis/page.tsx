"use client";

import { useRouter } from "next/navigation";
import AdminShell from "../../components/AdminShell";
import SurfaceCard from "../../components/SurfaceCard";
import Button from "../../components/Button";
import { aiStyles } from "../../../components/admin/ai-suggestions/styles";
import { allowedLabels, allowedTypes } from "../../../components/admin/ai-suggestions/constants";
import { useAiSuggestions } from "../../../components/admin/ai-suggestions/AiSuggestionsProvider";

export default function AiSuggestionsAnalysisPage() {
  const router = useRouter();
  const { file, selectFile, analyzeResume, analyzeError, isAnalyzing } =
    useAiSuggestions();

  const handleAnalyze = async () => {
    const ok = await analyzeResume();
    if (ok) router.push("/admin/ai-suggestions/selections");
  };

  return (
    <AdminShell
      title="AI Suggestions"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "AI Suggestions", href: "/admin/ai-suggestions" },
        { label: "Analysis" },
      ]}
    >
      <SurfaceCard className={aiStyles.card}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className={aiStyles.stepPill}>Step 1 of 3 · Analysis</span>
            <h2 className={aiStyles.title}>Upload a resume to begin</h2>
            <p className={aiStyles.helper}>
              The AI will read your resume and draft portfolio updates you can
              review.
            </p>
          </div>

          <div
            className="rounded-2xl border border-dashed border-[var(--bg-divider)] bg-[var(--bg-primary)] p-6 transition-colors"
            onDragEnter={(event) => {
              event.preventDefault();
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              selectFile(event.dataTransfer.files?.[0] ?? null);
            }}
          >
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  Resume file
                </p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Drag and drop or choose a file.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--bg-divider)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
                  Choose file
                  <input
                    type="file"
                    className="hidden"
                    accept={allowedTypes.join(",")}
                    onChange={(event) =>
                      selectFile(event.target.files?.[0] ?? null)
                    }
                  />
                </label>
                {file ? (
                  <span className="text-sm text-[var(--text-primary)]">
                    Selected: {file.name}
                  </span>
                ) : (
                  <span className="text-sm text-[var(--text-muted)]">
                    No file selected
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Supported: {allowedLabels.join(" · ")}
              </p>
            </div>
          </div>

          {analyzeError ? (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {analyzeError}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="secondary"
              onClick={() => router.push("/admin/ai-suggestions")}
            >
              Back to tutorial
            </Button>
            <Button variant="primary" onClick={handleAnalyze} disabled={!file || isAnalyzing}>
              {isAnalyzing ? "Analyzing..." : "Analyze resume"}
            </Button>
          </div>
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
