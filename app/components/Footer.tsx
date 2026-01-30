import type { FooterContent } from "../../lib/types";

interface FooterProps {
  footer?: FooterContent;
}

export default function Footer({ footer }: FooterProps) {
  return (
    <footer className="border-t border-[var(--bg-divider)] py-8">
      <div className="mx-auto flex w-full max-w-[960px] items-center justify-between px-6 text-xs text-[var(--text-muted)] md:px-10">
        <span>{footer?.copyright ?? "© 2026 Oma Dashi"}</span>
        <span>{footer?.tagline ?? "Built with calm systems thinking."}</span>
      </div>
    </footer>
  );
}
