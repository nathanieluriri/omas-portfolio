"use client";

import { useState } from "react";
import AdminShell from "../components/AdminShell";
import SurfaceCard from "../components/SurfaceCard";
import usePortfolioDraft from "../hooks/usePortfolioDraft";
import DraftBar from "../../components/admin/DraftBar";
import { uploadMetadataImages } from "../lib/apiClient";

export default function SeoEditorPage() {
  const { draft, setDraft, loading, save, saveDraft, saving, discard, hasChanges } =
    usePortfolioDraft();
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [socialImage, setSocialImage] = useState<File | null>(null);
  const [anagramDark, setAnagramDark] = useState<File | null>(null);
  const [anagramLight, setAnagramLight] = useState<File | null>(null);
  const [favicon, setFavicon] = useState<File | null>(null);

  if (loading || !draft) {
    return (
      <AdminShell
        title="SEO"
        breadcrumb={[{ label: "Admin", href: "/admin/dashboard" }, { label: "SEO" }]}
      >
        <SurfaceCard>Loading metadata...</SurfaceCard>
      </AdminShell>
    );
  }

  const metadata = draft.metadata ?? {};
  const handleImageUpload = async () => {
    if (!socialImage && !anagramDark && !anagramLight && !favicon) {
      setImageError("Select at least one image to upload.");
      return;
    }
    setImageError(null);
    setImageUploading(true);
    try {
      const response = await uploadMetadataImages({
        socialImage,
        anagramDark,
        anagramLight,
        favicon,
      });
      const next = {
        ...metadata,
        ...(response.data ?? {}),
      };
      const updated = { ...draft, metadata: next };
      setDraft(updated);
      await saveDraft(updated);
      setSocialImage(null);
      setAnagramDark(null);
      setAnagramLight(null);
      setFavicon(null);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Failed to upload images.");
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <AdminShell
      title="SEO"
      breadcrumb={[{ label: "Admin", href: "/admin/dashboard" }, { label: "SEO" }]}
    >
      <DraftBar
        visible={hasChanges}
        saving={saving}
        onSave={save}
        onDiscard={discard}
      />

      <SurfaceCard>
        <h2 className="text-lg font-semibold">Metadata</h2>
        <div className="mt-4 flex flex-col gap-4">
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
            placeholder="Title"
            value={metadata.title ?? ""}
            onChange={(event) =>
              setDraft({
                ...draft,
                metadata: { ...metadata, title: event.target.value },
              })
            }
          />
          <textarea
            className="min-h-[100px] w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
            placeholder="Description"
            value={metadata.description ?? ""}
            onChange={(event) =>
              setDraft({
                ...draft,
                metadata: { ...metadata, description: event.target.value },
              })
            }
          />
          <input
            className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-2 text-sm"
            placeholder="Author"
            value={metadata.author ?? ""}
            onChange={(event) =>
              setDraft({
                ...draft,
                metadata: { ...metadata, author: event.target.value },
              })
            }
          />
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <h2 className="text-lg font-semibold">Branding</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Toggle the anagram mark in the navbar.
        </p>
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-3">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Show anagram</p>
            <p className="text-xs text-[var(--text-muted)]">
              When enabled, the anagram replaces the theme toggle in the navbar.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setDraft({
                ...draft,
                metadata: { ...metadata, showAnagram: !metadata.showAnagram },
              })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-out ${
              metadata.showAnagram ? "bg-[var(--accent-primary)]" : "bg-[var(--bg-divider)]"
            }`}
            aria-pressed={metadata.showAnagram ? "true" : "false"}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white transition-transform duration-200 ease-out ${
                metadata.showAnagram ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <h2 className="text-lg font-semibold">Metadata images</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Upload social, anagram, or favicon images. SVG and other image formats are
          supported.
        </p>
        {imageError ? (
          <p className="mt-3 text-sm text-red-400">{imageError}</p>
        ) : null}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Social image
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setSocialImage(event.target.files?.[0] ?? null)}
              className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)]"
            />
            {metadata.socialImageUrl ? (
              <span className="text-[11px] text-[var(--text-secondary)]">
                Current: {metadata.socialImageUrl}
              </span>
            ) : null}
          </label>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Anagram dark
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setAnagramDark(event.target.files?.[0] ?? null)}
              className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)]"
            />
            {metadata.anagramDarkModeUrl ? (
              <span className="text-[11px] text-[var(--text-secondary)]">
                Current: {metadata.anagramDarkModeUrl}
              </span>
            ) : null}
          </label>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Anagram light
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setAnagramLight(event.target.files?.[0] ?? null)}
              className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)]"
            />
            {metadata.anagramLightModeUrl ? (
              <span className="text-[11px] text-[var(--text-secondary)]">
                Current: {metadata.anagramLightModeUrl}
              </span>
            ) : null}
          </label>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Favicon
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFavicon(event.target.files?.[0] ?? null)}
              className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)]"
            />
            {metadata.faviconImageUrl ? (
              <span className="text-[11px] text-[var(--text-secondary)]">
                Current: {metadata.faviconImageUrl}
              </span>
            ) : null}
          </label>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={imageUploading}
            className="rounded-full bg-[var(--accent-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-60"
          >
            {imageUploading ? "Uploading…" : "Upload images"}
          </button>
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
