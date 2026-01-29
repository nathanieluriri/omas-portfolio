"use client";

import { useRouter } from "next/navigation";
import AdminShell from "../../components/AdminShell";
import Button from "../../components/Button";
import SurfaceCard from "../../components/SurfaceCard";
import DraftBar from "../../../components/admin/DraftBar";
import usePortfolioDraft from "../../hooks/usePortfolioDraft";
import { emptyPortfolio } from "../utils";

export default function NavigationListPage() {
  const router = useRouter();
  const { draft, loading, saving, error, save, discard, hasChanges } =
    usePortfolioDraft();

  const data = draft ?? emptyPortfolio();

  const addNavItem = () => {
    router.push("/admin/content/navigation/new");
  };

  if (loading) {
    return (
      <AdminShell
        title="Navigation"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Navigation" },
        ]}
      >
        <SurfaceCard>Loading portfolio...</SurfaceCard>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Navigation"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Content", href: "/admin/content" },
        { label: "Navigation" },
      ]}
    >
      <DraftBar visible={hasChanges} saving={saving} onSave={save} onDiscard={discard} />
      {error ? (
        <SurfaceCard className="border border-red-500/30 bg-red-500/10 text-red-100">
          {error}
        </SurfaceCard>
      ) : null}

      <SurfaceCard>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-[var(--text-secondary)]">
            {data.navItems?.length ?? 0} items
          </p>
          <Button variant="secondary" onClick={addNavItem}>
            Add nav item
          </Button>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {(data.navItems ?? []).map((item, index) => (
            <button
              key={`${item.label}-${index}`}
              type="button"
              onClick={() => router.push(`/admin/content/navigation/${index}`)}
              className="flex items-center justify-between rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-3 text-left text-sm text-[var(--text-primary)]"
            >
              <span>{item.label || "Untitled nav item"}</span>
              <span className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Edit
              </span>
            </button>
          ))}
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
