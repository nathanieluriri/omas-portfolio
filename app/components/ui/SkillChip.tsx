interface SkillChipProps {
  label: string;
}

export default function SkillChip({ label }: SkillChipProps) {
  return (
    <span className="cursor-default rounded-full border border-[var(--bg-divider)]/70 bg-[var(--bg-surface)] px-3.5 py-2 text-sm text-[var(--text-secondary)] transition-colors duration-200 ease-out hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]">
      {label}
    </span>
  );
}
