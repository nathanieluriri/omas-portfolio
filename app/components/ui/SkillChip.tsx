interface SkillChipProps {
  label: string;
}

export default function SkillChip({ label }: SkillChipProps) {
  return (
    <span className="cursor-default rounded-full bg-[var(--bg-surface)] px-3.5 py-2 text-sm text-[var(--text-secondary)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]">
      {label}
    </span>
  );
}
