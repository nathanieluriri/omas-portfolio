"use client";

import { useRef, useState } from "react";
import AdminShell from "../components/AdminShell";
import Button from "../components/Button";
import SurfaceCard from "../components/SurfaceCard";
import usePortfolioDraft from "../hooks/usePortfolioDraft";
import { uploadResume } from "../lib/apiClient";

export default function AssetsPage() {
  const { draft, setDraft, loading } = usePortfolioDraft();
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (loading || !draft) {
    return (
      <AdminShell title="Assets">
        <SurfaceCard>Loading assets...</SurfaceCard>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Assets">
      <SurfaceCard>
        <h2 className="text-lg font-semibold">Resume upload</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Upload a PDF resume to update the public download link.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <input
            type="file"
            accept="application/pdf"
            className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] px-4 py-3 text-sm"
            ref={inputRef}
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              if (!file) {
                setFileName(null);
                return;
              }
              setFileName(file.name);
            }}
          />
          <Button
            onClick={async () => {
              const file = inputRef.current?.files?.[0];
              if (!file) return;
              setUploading(true);
              setStatus(null);
              try {
                const response = await uploadResume(file);
                const url = (response.data as { resumeUrl?: string })?.resumeUrl;
                if (url) {
                  setDraft({ ...draft, resumeUrl: url });
                }
                setStatus("Upload complete");
              } catch (err) {
                setStatus(
                  err instanceof Error ? err.message : "Upload failed"
                );
              } finally {
                setUploading(false);
              }
            }}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload resume"}
          </Button>
          {fileName ? (
            <p className="text-xs text-[var(--text-muted)]">
              Selected: {fileName}
            </p>
          ) : null}
          {status ? (
            <p className="text-xs text-[var(--text-muted)]">{status}</p>
          ) : null}
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Current resume URL
          </p>
          <a
            href={draft.resumeUrl ?? "#"}
            className="mt-2 block text-sm text-[var(--accent-primary)]"
          >
            {draft.resumeUrl ?? "No resume uploaded"}
          </a>
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
