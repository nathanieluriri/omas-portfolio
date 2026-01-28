"use client";

import Button from "../../admin/components/Button";

interface DraftBarProps {
  visible: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export default function DraftBar({
  visible,
  saving,
  onSave,
  onDiscard,
}: DraftBarProps) {
  if (!visible) return null;

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)]/90 px-4 py-3 backdrop-blur">
      <span className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
        You have unsaved changes
      </span>
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={onDiscard} disabled={saving}>
          Discard
        </Button>
        <Button onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
