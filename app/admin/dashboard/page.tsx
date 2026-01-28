"use client";

import { useEffect, useState } from "react";
import AdminShell from "../components/AdminShell";
import Button from "../components/Button";
import SurfaceCard from "../components/SurfaceCard";
import { API_BASE_URL } from "../../../lib/config";
import type { PortfolioOut } from "../../../lib/types";
import { apiFetch, getMe } from "../lib/apiClient";

export default function DashboardPage() {
  const [portfolio, setPortfolio] = useState<PortfolioOut | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [health, setHealth] = useState<string>("Checking...");
  const [authStatus, setAuthStatus] = useState<string>("Checking...");

  useEffect(() => {
    const load = async () => {
      const me = await getMe();
      if (me?._id) {
        setUserId(me._id);
        const response = await apiFetch<PortfolioOut>(`/v1/portfolios/${me._id}`, {}, false);
        if (response.ok) {
          const payload = await response.json();
          setPortfolio(payload.data ?? null);
        }
        setAuthStatus("Authenticated");
      } else {
        setAuthStatus("Not authenticated");
      }

      const healthRes = await apiFetch("/health", {}, false);
      setHealth(healthRes.ok ? "API Connected" : "API Offline");
    };

    load();
  }, []);

  return (
    <AdminShell
      title="Dashboard"
      breadcrumb={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Dashboard" }]}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <SurfaceCard className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Portfolio Status
          </p>
          <div className="text-sm text-[var(--text-secondary)]">
            User ID: {userId ?? "—"}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            Portfolio ID: {portfolio?.id ?? "—"}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            Last updated: {portfolio?.lastUpdated ? new Date(portfolio.lastUpdated * 1000).toLocaleString() : "—"}
          </div>
          <span className="mt-2 inline-flex w-fit items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-emerald-200">
            Live
          </span>
        </SurfaceCard>

        <SurfaceCard className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Quick Actions
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => (window.location.href = "/admin/content")}
              >Edit content</Button>
            <Button variant="secondary" onClick={() => (window.location.href = "/admin/assets")}
              >Upload resume</Button>
            <Button
              variant="secondary"
              onClick={() => (window.location.href = "/")}
            >
              Open public portfolio
            </Button>
          </div>
        </SurfaceCard>

        <SurfaceCard className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Sync & Health
          </p>
          <div className="text-sm text-[var(--text-secondary)]">{health}</div>
          <div className="text-sm text-[var(--text-secondary)]">{authStatus}</div>
          <a
            href={`${API_BASE_URL}/health-detailed`}
            className="mt-auto text-xs uppercase tracking-[0.12em] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            View detailed health
          </a>
        </SurfaceCard>
      </div>
    </AdminShell>
  );
}
