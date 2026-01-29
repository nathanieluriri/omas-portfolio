"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { apiFetch } from "../../../admin/lib/apiClient";
import { allowedTypes } from "./constants";

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

interface AiSuggestionsContextValue {
  file: File | null;
  suggestions: Suggestion[];
  selectedIds: Set<string>;
  selectedSuggestions: Suggestion[];
  analyzeError: string | null;
  applyError: string | null;
  isAnalyzing: boolean;
  isApplying: boolean;
  hasAnalyzed: boolean;
  hasApplied: boolean;
  selectFile: (nextFile: File | null) => boolean;
  analyzeResume: () => Promise<boolean>;
  toggleSelection: (id: string) => void;
  selectAll: (enabled: boolean) => void;
  applySelected: () => Promise<boolean>;
  resetFlow: () => void;
}

const AiSuggestionsContext = createContext<AiSuggestionsContextValue | null>(null);

export function useAiSuggestions() {
  const ctx = useContext(AiSuggestionsContext);
  if (!ctx) {
    throw new Error("useAiSuggestions must be used within AiSuggestionsProvider");
  }
  return ctx;
}

export type { Suggestion };

export default function AiSuggestionsProvider({ children }: PropsWithChildren) {
  const [file, setFile] = useState<File | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const resetResults = useCallback(() => {
    setSuggestions([]);
    setSelectedIds(new Set());
    setHasAnalyzed(false);
    setHasApplied(false);
    setAnalyzeError(null);
    setApplyError(null);
  }, []);

  const selectFile = useCallback(
    (nextFile: File | null) => {
      if (!nextFile) return false;
      if (!allowedTypes.includes(nextFile.type)) {
        setAnalyzeError("Unsupported file type. Please upload a PDF or Word doc.");
        return false;
      }
      setAnalyzeError(null);
      setFile(nextFile);
      resetResults();
      return true;
    },
    [resetResults]
  );

  const analyzeResume = useCallback(async () => {
    if (!file) return false;
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
      setHasAnalyzed(true);
      return true;
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : "Failed to analyze resume.");
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  }, [file]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(
    (enabled: boolean) => {
      if (!enabled) {
        setSelectedIds(new Set());
        return;
      }
      setSelectedIds(new Set(suggestions.map((item) => item.id)));
    },
    [suggestions]
  );

  const selectedSuggestions = useMemo(
    () => suggestions.filter((item) => selectedIds.has(item.id)),
    [suggestions, selectedIds]
  );

  const applySelected = useCallback(async () => {
    if (selectedSuggestions.length === 0) return false;
    setApplyError(null);
    setIsApplying(true);

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

      setHasApplied(true);
      return true;
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : "Failed to apply suggestions.");
      return false;
    } finally {
      setIsApplying(false);
    }
  }, [selectedSuggestions]);

  const resetFlow = useCallback(() => {
    setFile(null);
    resetResults();
  }, [resetResults]);

  const value = useMemo(
    () => ({
      file,
      suggestions,
      selectedIds,
      selectedSuggestions,
      analyzeError,
      applyError,
      isAnalyzing,
      isApplying,
      hasAnalyzed,
      hasApplied,
      selectFile,
      analyzeResume,
      toggleSelection,
      selectAll,
      applySelected,
      resetFlow,
    }),
    [
      file,
      suggestions,
      selectedIds,
      selectedSuggestions,
      analyzeError,
      applyError,
      isAnalyzing,
      isApplying,
      hasAnalyzed,
      hasApplied,
      selectFile,
      analyzeResume,
      toggleSelection,
      selectAll,
      applySelected,
      resetFlow,
    ]
  );

  return (
    <AiSuggestionsContext.Provider value={value}>
      {children}
    </AiSuggestionsContext.Provider>
  );
}
