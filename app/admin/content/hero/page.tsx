"use client";

import AdminShell from "../../components/AdminShell";
import Button from "../../components/Button";
import SurfaceCard from "../../components/SurfaceCard";
import DraftBar from "../../../components/admin/DraftBar";
import usePortfolioDraft from "../../hooks/usePortfolioDraft";
import { emptyPortfolio } from "../utils";
import AiFieldSuggestion from "../../../components/admin/ai-suggestions/AiFieldSuggestion";

export default function HeroEditorPage() {
  const { draft, setDraft, loading, saving, error, save, discard, hasChanges } =
    usePortfolioDraft();

  const data = draft ?? emptyPortfolio();

  const updateHero = (field: string, value: string | string[]) => {
    setDraft({
      ...data,
      hero: {
        ...data.hero,
        [field]: value,
      },
    });
  };

  const updateAvailability = (field: string, value: string) => {
    setDraft({
      ...data,
      hero: {
        ...data.hero,
        availability: {
          ...data.hero?.availability,
          [field]: value,
        },
      },
    });
  };

  if (loading) {
    return (
      <AdminShell
        title="Hero"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Content", href: "/admin/content" },
          { label: "Hero" },
        ]}
      >
        <SurfaceCard>Loading portfolio...</SurfaceCard>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Hero"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Content", href: "/admin/content" },
        { label: "Hero" },
      ]}
    >
      <DraftBar visible={hasChanges} saving={saving} onSave={save} onDiscard={discard} />
      {error ? (
        <SurfaceCard className="border border-red-500/30 bg-red-500/10 text-red-100">
          {error}
        </SurfaceCard>
      ) : null}

      <SurfaceCard>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <input
              className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
              placeholder="Name"
              value={data.hero?.name ?? ""}
              onChange={(event) => updateHero("name", event.target.value)}
            />
            <AiFieldSuggestion
              targetPath="hero.name"
              currentValue={data.hero?.name ?? ""}
              onApply={(value) => updateHero("name", value)}
              label="Name"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
              placeholder="Title"
              value={data.hero?.title ?? ""}
              onChange={(event) => updateHero("title", event.target.value)}
            />
            <AiFieldSuggestion
              targetPath="hero.title"
              currentValue={data.hero?.title ?? ""}
              onApply={(value) => updateHero("title", value)}
              label="Title"
            />
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <input
              className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
              placeholder="Availability label"
              value={data.hero?.availability?.label ?? ""}
              onChange={(event) => updateAvailability("label", event.target.value)}
            />
            <AiFieldSuggestion
              targetPath="hero.availability.label"
              currentValue={data.hero?.availability?.label ?? ""}
              onApply={(value) => updateAvailability("label", value)}
              label="Availability label"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
              placeholder="Availability status"
              value={data.hero?.availability?.status ?? ""}
              onChange={(event) => updateAvailability("status", event.target.value)}
            />
            <AiFieldSuggestion
              targetPath="hero.availability.status"
              currentValue={data.hero?.availability?.status ?? ""}
              onApply={(value) => updateAvailability("status", value)}
              label="Availability status"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {(data.hero?.bio ?? []).map((paragraph, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex gap-3">
                <textarea
                  className="min-h-[80px] w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
                  placeholder={`Bio paragraph ${index + 1}`}
                  value={paragraph}
                  onChange={(event) => {
                    const next = [...(data.hero?.bio ?? [])];
                    next[index] = event.target.value;
                    updateHero("bio", next);
                  }}
                />
                <AiFieldSuggestion
                  targetPath={`hero.bio[${index}]`}
                  currentValue={paragraph}
                  onApply={(value) => {
                    const next = [...(data.hero?.bio ?? [])];
                    next[index] = value;
                    updateHero("bio", next);
                  }}
                  label={`Bio ${index + 1}`}
                />
              </div>
              <div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const next = [...(data.hero?.bio ?? [])];
                    next.splice(index, 1);
                    updateHero("bio", next);
                  }}
                >
                  Remove paragraph
                </Button>
              </div>
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={() => updateHero("bio", [...(data.hero?.bio ?? []), ""])}
          >
            Add paragraph
          </Button>
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
