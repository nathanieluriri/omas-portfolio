import type { AnchorHTMLAttributes } from "react";

interface PrimaryButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string;
}

export default function PrimaryButton({
  label,
  className = "",
  style,
  ...props
}: PrimaryButtonProps) {
  return (
    <a
      {...props}
      className={
        "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent-primary)] px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-primary)] " +
        className
      }
      style={{
        boxShadow: "0 10px 30px rgba(255,106,0,0.18)",
        ...style,
      }}
    >
      <span aria-hidden="true">↓</span>
      {label}
    </a>
  );
}
