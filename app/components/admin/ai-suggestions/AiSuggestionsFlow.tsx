"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../admin/lib/apiClient";
import SurfaceCard from "../../../admin/components/SurfaceCard";
import Button from "../../../admin/components/Button";
import { aiStyles } from "./styles";

interface Suggestion {
  id: string;
  field: string;
  currentValue: string;
  suggestedValue: string;
  reasoning: string;
  confidence: number;
}

interface AnalyzeResponse {
  fileUrl?: string;
  suggestions: Suggestion[];
}

type Step = "upload" | "review" | "apply" | "success";

const allowedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const allowedLabels = [".pdf", ".docx", ".doc"];

export default function AiSuggestionsFlow() {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (step === "review") {
      setApplyError(null);
    }
  }, [step]);

  const validateFile = (nextFile: File) => {
    if (!allowedTypes.includes(nextFile.type)) {
      setAnalyzeError("Unsupported file type. Please upload a PDF or Word document.");
      return false;
    }
    setAnalyzeError(null);
    return true;
  };

  const handleFileSelect = (nextFile: File | null) => {
    if (!nextFile) return;
    if (!validateFile(nextFile)) return;
    setFile(nextFile);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzeError(null);
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiFetch("/v1/portfolios/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to analyze resume.");
      }

      const payload = (await response.json()) as {
        data?: AnalyzeResponse;
        detail?: string;
        status_code?: number;
      };

      const list = payload.data?.suggestions ?? [];
      setSuggestions(list);
      setSelectedIds(new Set(list.map((item) => item.id)));
      setStep("review");
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : "Failed to analyze resume.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const confidenceLabel = (value: number) => {
    const normalized = value > 1 ? value / 100 : value;
    return Math.round(normalized * 100);
  };

  const confidenceTone = (value: number) => {
    const normalized = value > 1 ? value / 100 : value;
    if (normalized >= 0.8) return "bg-emerald-500/10 text-emerald-200";
    if (normalized >= 0.6) return "bg-amber-500/10 text-amber-200";
    return "bg-slate-500/10 text-slate-200";
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = (enabled: boolean) => {
    if (!enabled) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(suggestions.map((item) => item.id)));
  };

  const selectedSuggestions = useMemo(
    () => suggestions.filter((item) => selectedIds.has(item.id)),
    [suggestions, selectedIds]
  );

  const handleApply = async () => {
    if (selectedSuggestions.length === 0) return;
    setApplyError(null);
    setIsApplying(true);
    setStep("apply");

    const updates = selectedSuggestions.map((item) => ({
      field: item.field,
      value: item.suggestedValue,
      expectedCurrent: item.currentValue,
    }));

    try {
      const response = await apiFetch("/v1/portfolios/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to apply suggestions.");
      }

      setStep("success");
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : "Failed to apply suggestions.");
    } finally {
      setIsApplying(false);
    }
  };

  const stepState = (target: Step) => {
    const order: Step[] = ["upload", "review", "apply", "success"];
    const activeIndex = order.indexOf(step);
    const targetIndex = order.indexOf(target);
    if (target === "apply" && step === "review" && selectedSuggestions.length > 0) {
      return "active";
    }
    if (targetIndex < activeIndex) return "done";
    if (targetIndex === activeIndex) return "active";
    return "locked";
  };

  const stepClass = (state: "active" | "done" | "locked") =>
    `transition-all duration-300 ${
      state === "locked" ? "opacity-40 pointer-events-none" : "opacity-100"
    }`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
        <span className={step === "upload" ? "text-[var(--text-primary)]" : ""}>
          Upload
        </span>
        <span>→</span>
        <span className={step === "review" ? "text-[var(--text-primary)]" : ""}>
          Review
        </span>
        <span>→</span>
        <span className={step === "apply" ? "text-[var(--text-primary)]" : ""}>
          Apply
        </span>
      </div>

      <div className={stepClass(stepState("upload"))}>
        <SurfaceCard>
          <div className="flex flex-col gap-4">
            <div>
              <p className={aiStyles.label}>Step 1 · Upload resume</p>
              <h2 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
                Resume analysis
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Upload your resume to get structured improvements for your portfolio.
              </p>
            </div>
            <div
              className={`rounded-2xl border border-dashed border-[var(--bg-divider)] bg-[var(--bg-primary)] p-5 transition-colors ${
                isDragActive ? "border-[var(--accent-primary)]/70" : ""
              }`}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragActive(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragActive(false);
                handleFileSelect(event.dataTransfer.files?.[0] ?? null);
              }}
            >
              <p className={aiStyles.label}>Upload file</p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Drag and drop your resume here, or select a file.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className={`${aiStyles.button} ${aiStyles.secondaryButton} cursor-pointer`}>
                  Choose file
                  <input
                    type="file"
                    className="hidden"
                    accept={allowedTypes.join(",")}
                    onChange={(event) =>
                      handleFileSelect(event.target.files?.[0] ?? null)
                    }
                  />
                </label>
                {file ? (
                  <span className="text-sm text-[var(--text-primary)]">{file.name}</span>
                ) : (
                  <span className="text-sm text-[var(--text-muted)]">No file selected</span>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Supported: {allowedLabels.join(" · ")}
              </div>
            </div>

            {analyzeError ? (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {analyzeError}
              </div>
            ) : null}

            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Step 1 of 3
              </span>
              <Button
                variant="primary"
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze resume"}
              </Button>
            </div>
          </div>
        </SurfaceCard>
      </div>

      <div className={stepClass(stepState("review"))}>
        <SurfaceCard>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className={aiStyles.label}>Step 2 · Review suggestions</p>
                <h2 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
                  Select what to apply
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Review AI suggestions and choose the updates you want to apply.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => selectAll(true)}>
                  Select all
                </Button>
                <Button variant="secondary" onClick={() => selectAll(false)}>
                  Clear
                </Button>
              </div>
            </div>

            {suggestions.length === 0 ? (
              <div className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                No improvements found for this resume.
              </div>
            ) : (
              <div className="flex max-h-[420px] flex-col gap-4 overflow-y-auto pr-2">
                {suggestions.map((item) => {
                  const selected = selectedIds.has(item.id);
                  return (
                    <div key={item.id} className={`${aiStyles.card} flex flex-col gap-3`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {item.field}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">{item.reasoning}</p>
                        </div>
                        <span
                          className={`${aiStyles.statusPill} ${confidenceTone(item.confidence)}`}
                        >
                          {confidenceLabel(item.confidence)}% confidence
                        </span>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] p-3">
                          <p className={aiStyles.label}>Current</p>
                          <p className="mt-2 text-sm text-[var(--text-secondary)]">
                            {item.currentValue || "—"}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] p-3">
                          <p className={aiStyles.label}>Suggested</p>
                          <p className="mt-2 text-sm text-[var(--text-primary)]">
                            {item.suggestedValue || "—"}
                          </p>
                        </div>
                      </div>
                      <div>
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
            )}
          </div>
        </SurfaceCard>
      </div>

      <div className={stepClass(stepState("apply"))}>
        <SurfaceCard>
          <div className="flex flex-col gap-4">
            <div>
              <p className={aiStyles.label}>Step 3 · Apply updates</p>
              <h2 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
                Update portfolio
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Apply the selected suggestions to your live portfolio content.
              </p>
            </div>

            {applyError ? (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {applyError}
              </div>
            ) : null}

            {step === "success" ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                Suggestions applied. Review the content editor to confirm changes.
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {selectedSuggestions.length} selected
                </span>
                <Button
                  variant="primary"
                  onClick={handleApply}
                  disabled={selectedSuggestions.length === 0 || isApplying}
                >
                  {isApplying ? "Applying..." : "Apply selected"}
                </Button>
              </div>
            )}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
