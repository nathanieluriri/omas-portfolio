"use client";

import { useRouter } from "next/navigation";
import AdminShell from "../components/AdminShell";
import Button from "../components/Button";
import SurfaceCard from "../components/SurfaceCard";
import usePortfolioDraft from "../hooks/usePortfolioDraft";
import { clearTokens, getRefreshToken } from "../lib/auth";
import { deletePortfolio } from "../lib/apiClient";

export default function SettingsPage() {
  const router = useRouter();
  const { portfolio, reload } = usePortfolioDraft();

  return (
    <AdminShell
      title="Settings"
      breadcrumb={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Settings" }]}
    >
      <SurfaceCard>
        <h2 className="text-lg font-semibold">Session</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Refresh token stored: {getRefreshToken() ? "Yes" : "No"}
        </p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => {
            clearTokens();
            router.push("/admin/login");
          }}
        >
          Sign out
        </Button>
      </SurfaceCard>

      <SurfaceCard>
        <h2 className="text-lg font-semibold text-red-200">Danger zone</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Delete the portfolio from the API. This cannot be undone.
        </p>
        <Button
          variant="danger"
          className="mt-4"
          onClick={async () => {
            const confirmed = window.confirm(
              "Delete this portfolio? This action cannot be undone."
            );
            if (!confirmed) return;
            await deletePortfolio();
            await reload();
          }}
        >
          Delete portfolio
        </Button>
        {portfolio ? (
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Current portfolio ID: {portfolio.id ?? "—"}
          </p>
        ) : null}
      </SurfaceCard>
    </AdminShell>
  );
}
