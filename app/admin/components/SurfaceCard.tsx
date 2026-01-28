import type { PropsWithChildren } from "react";

interface SurfaceCardProps extends PropsWithChildren {
  className?: string;
}

export default function SurfaceCard({ className = "", children }: SurfaceCardProps) {
  return (
    <div
      className={`rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-6 shadow-[0_8px_20px_rgba(0,0,0,0.16)] ${className}`}
    >
      {children}
    </div>
  );
}
