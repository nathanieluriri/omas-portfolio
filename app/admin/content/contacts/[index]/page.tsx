"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "../../../components/AdminShell";
import Button from "../../../components/Button";
import SurfaceCard from "../../../components/SurfaceCard";
import DraftBar from "../../../../components/admin/DraftBar";
import usePortfolioDraft from "../../../hooks/usePortfolioDraft";
import { emptyPortfolio } from "../../utils";
import type { ContactEntry } from "../../../../../lib/types";

export default function ContactEditorPage() {
  const router = useRouter();
  const params = useParams<{ index: string }>();
  const rawIndex = params.index;
  const createdRef = useRef(false);
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
  const index = isNew ? (data.contacts?.length ?? 0) : Number(rawIndex);
  const contact = data.contacts?.[index];

  useEffect(() => {
    if (!isNew || createdRef.current || loading) return;
    createdRef.current = true;
    const next = [
      ...(data.contacts ?? []),
      { label: "", value: "", href: "", icon: "" },
    ];
    setDraft({ ...data, contacts: next });
    router.replace(`/admin/content/contacts/${next.length - 1}`);
  }, [data, isNew, loading, router, setDraft]);

  const updateContact = (next: Partial<ContactEntry>) => {
    const list = [...(data.contacts ?? [])];
    list[index] = { ...list[index], ...next };
    setDraft({ ...data, contacts: list });
  };

  const removeContact = () => {
    const list = [...(data.contacts ?? [])];
    list.splice(index, 1);
    setDraft({ ...data, contacts: list });
    router.push("/admin/content/contacts");
  };

  if (loading) {
    return (
      <AdminShell
        title="Contacts"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Contacts", href: "/admin/content/contacts" },
          { label: `Contact ${index + 1}` },
        ]}
      >
        <SurfaceCard>Loading portfolio...</SurfaceCard>
      </AdminShell>
    );
  }

  if (!contact && !isNew) {
    return (
      <AdminShell
        title="Contacts"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Contacts", href: "/admin/content/contacts" },
          { label: `Contact ${index + 1}` },
        ]}
      >
        <SurfaceCard>Contact not found.</SurfaceCard>
      </AdminShell>
    );
  }

  if (!contact && isNew) {
    return (
      <AdminShell
        title="Contacts"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Contacts", href: "/admin/content/contacts" },
          { label: "New contact" },
        ]}
      >
        <SurfaceCard>Preparing a new contact...</SurfaceCard>
      </AdminShell>
    );
  }

  const current = contact as ContactEntry;

  return (
    <AdminShell
      title="Contacts"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Content", href: "/admin/content" },
        { label: "Contacts", href: "/admin/content/contacts" },
        { label: `Contact ${index + 1}` },
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
            Contact {index + 1}
          </p>
          <Button variant="secondary" onClick={removeContact}>
            Remove
          </Button>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
            placeholder="Label"
            value={current.label}
            onChange={(event) => updateContact({ label: event.target.value })}
          />
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
            placeholder="Value"
            value={current.value}
            onChange={(event) => updateContact({ value: event.target.value })}
          />
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
            placeholder="Href"
            value={current.href}
            onChange={(event) => updateContact({ href: event.target.value })}
          />
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
            placeholder="Icon key"
            value={current.icon ?? ""}
            onChange={(event) => updateContact({ icon: event.target.value })}
          />
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
