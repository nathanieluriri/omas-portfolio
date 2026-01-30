"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "../../../admin/components/Button";
import { generateSuggestion } from "../../../admin/lib/apiClient";
import { allowedLabels, allowedTypes } from "./constants";

interface AiFieldSuggestionProps<T> {
  targetPath: string;
  currentValue: T;
  onApply: (value: T) => void;
  coerceValue?: (value: unknown) => T | null;
  label?: string;
}

function parseTargetPath(path: string): Array<string | number> {
  const parts: Array<string | number> = [];
  const regex = /([^.[\]]+)|\[(\d+)\]/g;
  let match: RegExpExecArray | null = null;
  while ((match = regex.exec(path))) {
    if (match[1]) parts.push(match[1]);
    if (match[2]) parts.push(Number(match[2]));
  }
  return parts;
}

function getValueAtPath(source: unknown, path: string): unknown {
  const parts = parseTargetPath(path);
  let current: unknown = source;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<string, unknown>)[String(part)];
  }
  return current;
}

function cloneValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return [...value] as T;
  }
  if (value && typeof value === "object") {
    return { ...(value as Record<string, unknown>) } as T;
  }
  return value;
}

export default function AiFieldSuggestion<T>({
  targetPath,
  currentValue,
  onApply,
  coerceValue,
  label,
}: AiFieldSuggestionProps<T>) {
  const [open, setOpen] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [useExistingResume, setUseExistingResume] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastValue, setLastValue] = useState<T | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const trimmedInput = textInput.trim();
  const canUseExistingResume = !trimmedInput && !file;

  useEffect(() => {
    if (!canUseExistingResume && useExistingResume) {
      setUseExistingResume(false);
    }
  }, [canUseExistingResume, useExistingResume]);

  const isReady = useMemo(() => {
    if (!targetPath.trim()) return false;
    return Boolean(trimmedInput || file || useExistingResume);
  }, [file, targetPath, trimmedInput, useExistingResume]);

  const handleFileChange = (nextFile: File | null) => {
    if (!nextFile) {
      setFile(null);
      return;
    }
    if (!allowedTypes.includes(nextFile.type)) {
      setError("Unsupported file type. Please upload a PDF or Word doc.");
      setFile(null);
      return;
    }
    setError(null);
    setFile(nextFile);
  };

  const handleGenerate = async () => {
    if (!isReady) return;
    setError(null);
    setNote(null);
    setIsGenerating(true);

    try {
      const payload = await generateSuggestion({
        targetPath: targetPath.trim(),
        textInput: trimmedInput || undefined,
        file,
        useExistingResume: canUseExistingResume && useExistingResume,
      });

      if (!payload.data) {
        throw new Error("No suggestion data returned.");
      }

      const rawValue = getValueAtPath(payload.data.patch, targetPath);
      if (rawValue === undefined) {
        throw new Error("AI response did not include the selected field.");
      }

      const nextValue = coerceValue ? coerceValue(rawValue) : (rawValue as T);
      if (nextValue === null || nextValue === undefined) {
        throw new Error("AI response could not be applied to this field.");
      }

      setLastValue(cloneValue(currentValue));
      onApply(nextValue);
      setNote("Suggestion applied. You can undo if needed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate suggestion.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUndo = () => {
    if (lastValue === null) return;
    onApply(lastValue);
    setLastValue(null);
    setNote("Undo applied.");
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        variant="secondary"
        onClick={() => setOpen((prev) => !prev)}
        className="px-3 py-1.5 text-[10px]"
      >
        AI
      </Button>

      {open ? (
        <div className="w-[320px] rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] p-4 text-xs text-[var(--text-secondary)] shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              AI Assist{label ? ` · ${label}` : ""}
            </p>

            <textarea
              className="min-h-[80px] w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-3 py-2 text-xs"
              placeholder="Optional context to guide the suggestion..."
              value={textInput}
              onChange={(event) => setTextInput(event.target.value)}
            />

            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--bg-divider)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">
                Upload
                <input
                  type="file"
                  className="hidden"
                  accept={allowedTypes.join(",")}
                  onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
                />
              </label>
              <span className="text-[10px] text-[var(--text-muted)]">
                {file ? file.name : `Files: ${allowedLabels.join(" ")}`}
              </span>
            </div>

            <label className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-[var(--bg-divider)]"
                checked={useExistingResume}
                disabled={!canUseExistingResume}
                onChange={(event) => setUseExistingResume(event.target.checked)}
              />
              Use stored resume
            </label>

            {!canUseExistingResume ? (
              <p className="text-[10px] text-[var(--text-muted)]">
                Clear text/file to use the stored resume.
              </p>
            ) : null}

            {error ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-200">
                {error}
              </div>
            ) : null}

            {note ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-200">
                {note}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button
                variant="primary"
                onClick={handleGenerate}
                disabled={!isReady || isGenerating}
                className="px-3 py-1.5 text-[10px]"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
              <Button
                variant="secondary"
                onClick={handleUndo}
                disabled={lastValue === null}
                className="px-3 py-1.5 text-[10px]"
              >
                Undo
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
