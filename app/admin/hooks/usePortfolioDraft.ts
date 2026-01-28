"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PortfolioOut } from "../../../lib/types";
import {
  createPortfolio,
  getMe,
  getPortfolioByUser,
  updatePortfolio,
} from "../lib/apiClient";

export default function usePortfolioDraft() {
  const [portfolio, setPortfolio] = useState<PortfolioOut | null>(null);
  const [draft, setDraft] = useState<PortfolioOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await getMe();
      if (!user?._id) {
        setError("Unable to load user profile.");
        setLoading(false);
        return;
      }
      const data = await getPortfolioByUser(user._id);
      setPortfolio(data);
      setDraft(data ? { ...data } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load portfolio.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async () => {
    if (!draft) return null;
    setSaving(true);
    setError(null);
    try {
      const data = portfolio
        ? await updatePortfolio(draft)
        : await createPortfolio(draft);
      setPortfolio(data);
      setDraft(data ? { ...data } : null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
      return null;
    } finally {
      setSaving(false);
    }
  }, [draft, portfolio]);

  const discard = useCallback(() => {
    setDraft(portfolio ? { ...portfolio } : null);
  }, [portfolio]);

  const hasChanges = useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify(portfolio);
  }, [draft, portfolio]);

  return {
    portfolio,
    draft,
    setDraft,
    loading,
    saving,
    error,
    save,
    discard,
    hasChanges,
    reload: load,
  };
}
