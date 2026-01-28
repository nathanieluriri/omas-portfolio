import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null;

  const first = items[0];
  const last = items[items.length - 1];

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-[var(--text-muted)]">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isMiddle = index > 0 && index < items.length - 1;
          const shouldHide = isMiddle;

          return (
            <li
              key={`${item.label}-${index}`}
              className={shouldHide ? "hidden md:flex md:items-center md:gap-2" : "flex items-center gap-2"}
            >
              {index > 0 && <span className="text-[var(--text-muted)]">/</span>}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-[var(--text-primary)]" : ""}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
        {items.length > 2 && (
          <li className="flex items-center gap-2 md:hidden">
            <span className="text-[var(--text-muted)]">/</span>
            <span className="text-[var(--text-primary)]">{last.label}</span>
          </li>
        )}
      </ol>
    </nav>
  );
}
