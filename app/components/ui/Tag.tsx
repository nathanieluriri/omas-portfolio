interface TagProps {
  label: string;
}

export default function Tag({ label }: TagProps) {
  return (
    <span className="rounded-full bg-[var(--accent-muted)] px-2.5 py-1 text-xs font-medium uppercase tracking-[0.08em] text-[var(--accent-primary)] transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
      {label}
    </span>
  );
}
