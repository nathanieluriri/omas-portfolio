interface AvailabilityBadgeProps {
  label?: string;
  status?: string;
}

export default function AvailabilityBadge({
  label = "Open to Work",
  status = "available",
}: AvailabilityBadgeProps) {
  const statusColor = "#ffffff";
  return (
    <div
      className={[
        "group relative inline-flex items-center gap-2 rounded-full",
        "bg-[var(--accent-primary)] px-4 py-1.5",
        "text-xs font-medium uppercase tracking-[0.12em]",
        "text-white",
        "border border-white/10",
        "shadow-[0_10px_30px_rgba(255,106,0,0.18)]",
      ].join(" ")}
    >
      <span className="relative flex h-2 w-2 overflow-visible">
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: statusColor }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full opacity-70 blur-[2px]"
          style={{ background: statusColor }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full blur-[1px] animate-status-glow"
          style={{ background: statusColor, opacity: 0.6 }}
        />
      </span>

      <span className="relative">{label}</span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
        style={{
          boxShadow:
            "0 0 0 1px rgba(34,197,94,0.10), 0 10px 30px rgba(34,197,94,0.08)",
        }}
      />
    </div>
  );
}
