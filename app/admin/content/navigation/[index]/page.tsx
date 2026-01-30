"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "../../../components/AdminShell";
import Button from "../../../components/Button";
import SurfaceCard from "../../../components/SurfaceCard";
import DraftBar from "../../../../components/admin/DraftBar";
import usePortfolioDraft from "../../../hooks/usePortfolioDraft";
import { emptyPortfolio } from "../../utils";
import type { NavItem } from "../../../../../lib/types";
import AiFieldSuggestion from "../../../../components/admin/ai-suggestions/AiFieldSuggestion";

export default function NavItemEditorPage() {
  const router = useRouter();
  const params = useParams<{ index: string }>();
  const rawIndex = params.index;
  const createdRef = useRef(false);
  const newIndexRef = useRef<number | null>(null);
  const {
    draft,
    setDraft,
    loading,
    saving,
    error,
    save,
    discard,
    hasChanges,
  } = usePortfolioDraft();

  const data = draft ?? emptyPortfolio();
  const isNew = rawIndex === "new";
  const list = data.navItems ?? [];
  const parsedIndex = Number(rawIndex);
  useEffect(() => {
    if (!isNew || loading) return;
    if (newIndexRef.current === null) {
      newIndexRef.current = list.length;
    }
  }, [isNew, list.length, loading]);

  const index = isNew ? (newIndexRef.current ?? list.length) : parsedIndex;
  const item = list[index];
  const invalidIndex = Number.isNaN(index) || index < 0;
  const shouldCreate =
    !loading && !createdRef.current && !invalidIndex && (isNew || (!item && index === list.length));
  const awaitingCreation = !loading && !invalidIndex && !item && (isNew || index === list.length);

  useEffect(() => {
    if (!shouldCreate) return;
    createdRef.current = true;
    const next = [...list, { label: "", href: "" }];
    setDraft({ ...data, navItems: next });
  }, [data, list, setDraft, shouldCreate]);

  useEffect(() => {
    if (loading || !invalidIndex) return;
    router.push("/admin/content/navigation");
  }, [invalidIndex, loading, router]);

  const updateNavItem = (next: Partial<NavItem>) => {
    const list = [...(data.navItems ?? [])];
    list[index] = { ...list[index], ...next };
    setDraft({ ...data, navItems: list });
  };

  const removeNavItem = () => {
    const list = [...(data.navItems ?? [])];
    list.splice(index, 1);
    setDraft({ ...data, navItems: list });
    router.push("/admin/content/navigation");
  };

  if (loading) {
    return (
      <AdminShell
        title="Navigation"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Navigation", href: "/admin/content/navigation" },
          { label: `Item ${index + 1}` },
        ]}
      >
        <SurfaceCard>Loading portfolio...</SurfaceCard>
      </AdminShell>
    );
  }

  if (invalidIndex) {
    return (
      <AdminShell
        title="Navigation"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Navigation", href: "/admin/content/navigation" },
          { label: "Invalid item" },
        ]}
      >
        <SurfaceCard>Invalid navigation item.</SurfaceCard>
      </AdminShell>
    );
  }

  if (!item && !awaitingCreation) {
    return (
      <AdminShell
        title="Navigation"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Navigation", href: "/admin/content/navigation" },
          { label: `Item ${index + 1}` },
        ]}
      >
        <SurfaceCard>Navigation item not found.</SurfaceCard>
      </AdminShell>
    );
  }

  if (!item && awaitingCreation) {
    return (
      <AdminShell
        title="Navigation"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Navigation", href: "/admin/content/navigation" },
          { label: "New item" },
        ]}
      >
        <SurfaceCard>Preparing a new navigation item...</SurfaceCard>
      </AdminShell>
    );
  }

  const current = item as NavItem;

  return (
    <AdminShell
      title="Navigation"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Content", href: "/admin/content" },
        { label: "Navigation", href: "/admin/content/navigation" },
        { label: `Item ${index + 1}` },
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
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Item {index + 1}
          </p>
          <Button variant="secondary" onClick={removeNavItem}>
            Remove
          </Button>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <input
              className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
              placeholder="Label"
              value={current.label}
              onChange={(event) => updateNavItem({ label: event.target.value })}
            />
            <AiFieldSuggestion
              targetPath={`navItems[${index}].label`}
              currentValue={current.label}
              onApply={(value) => updateNavItem({ label: value })}
              label="Label"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
              placeholder="Href"
              value={current.href}
              onChange={(event) => updateNavItem({ href: event.target.value })}
            />
            <AiFieldSuggestion
              targetPath={`navItems[${index}].href`}
              currentValue={current.href}
              onApply={(value) => updateNavItem({ href: value })}
              label="Href"
            />
          </div>
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
