interface AvailabilityBadgeProps {
  label?: string;
  status?: string;
}

export default function AvailabilityBadge({
  label = "Open to Work",
  status = "available",
}: AvailabilityBadgeProps) {
  const statusColor = "var(--status-open)";
  return (
    <div
      className={[
        "group relative inline-flex items-center gap-2 rounded-full",
        "bg-[var(--bg-surface)] px-3 py-1",
        "text-[11px] font-medium uppercase tracking-[0.14em]",
        "text-[var(--text-muted)]",
        "border border-[var(--bg-divider)]",
      ].join(" ")}
    >
      <span className="relative flex h-2 w-2 overflow-visible">
        <span className="absolute inset-0 rounded-full" style={{ background: statusColor }} />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full opacity-60 blur-[3px]"
          style={{ background: statusColor }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full opacity-60 blur-[1px] animate-status-glow"
          style={{ background: statusColor }}
        />
      </span>

      <span className="relative">{label}</span>
    </div>
  );
}
