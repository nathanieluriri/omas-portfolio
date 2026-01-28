import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-200 ease-out";
  const variants = {
    primary:
      "bg-[var(--accent-primary)] text-white hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(255,106,0,0.25)]",
    secondary:
      "border border-[var(--bg-divider)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-muted)]",
    danger:
      "border border-red-500/40 text-red-300 hover:border-red-400 hover:text-red-200",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
