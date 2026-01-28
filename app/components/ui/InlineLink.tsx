interface InlineLinkProps {
  href: string;
  label: string;
}

export default function InlineLink({ href, label }: InlineLinkProps) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-primary)] transition-all duration-200 ease-out hover:text-[var(--accent-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-primary)]"
    >
      <span className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[var(--accent-primary)] after:transition-transform after:duration-200 after:ease-out group-hover:after:scale-x-100">
        {label}
      </span>
      <span className="transition-transform duration-200 ease-out group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}
