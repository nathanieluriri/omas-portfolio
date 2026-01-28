import type { ContactEntry } from "../../lib/types";

const fallbackContacts: ContactEntry[] = [
  {
    label: "Email",
    value: "hello@omadashi.com",
    href: "mailto:hello@omadashi.com",
    icon: "email",
  },
  {
    label: "GitHub",
    value: "github.com/omadashi",
    href: "https://github.com/omadashi",
    icon: "github",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/omadashi",
    href: "https://linkedin.com/in/omadashi",
    icon: "linkedin",
  },
  {
    label: "Location",
    value: "Remote · New York, NY",
    href: "#",
    icon: "location",
  },
];

function resolveIcon(label?: string, icon?: string | null) {
  const key = (icon ?? label ?? "").toLowerCase();

  if (key.includes("mail") || key.includes("email")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          d="M4 6h16v12H4z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M4 7l8 6 8-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    );
  }

  if (key.includes("github")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          d="M12 3.5a8.5 8.5 0 0 0-2.7 16.6c.4.1.6-.2.6-.4v-1.6c-2.4.5-2.9-1-2.9-1a2.3 2.3 0 0 0-1-1.3c-.8-.6.1-.6.1-.6a1.8 1.8 0 0 1 1.3.9 1.9 1.9 0 0 0 2.6.7 1.9 1.9 0 0 1 .6-1.2c-2-.2-4.1-1-4.1-4.5a3.6 3.6 0 0 1 1-2.5 3.4 3.4 0 0 1 .1-2.4s.8-.3 2.6 1a9.2 9.2 0 0 1 4.8 0c1.8-1.3 2.6-1 2.6-1a3.4 3.4 0 0 1 .1 2.4 3.6 3.6 0 0 1 1 2.5c0 3.5-2.1 4.3-4.1 4.5a2.2 2.2 0 0 1 .6 1.7v2.5c0 .2.2.5.6.4A8.5 8.5 0 0 0 12 3.5z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (key.includes("linkedin")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          d="M6.5 9.5v9M6.5 6.5v.5M10.5 9.5h3.1c2.4 0 3.9 1.6 3.9 4.3v4.7M10.5 18.5v-9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="6.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="M12 21s6-5.1 6-10a6 6 0 0 0-12 0c0 4.9 6 10 6 10z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="11" r="2.5" fill="currentColor" />
    </svg>
  );
}

interface ContactSectionProps {
  contacts?: ContactEntry[];
}

export default function ContactSection({
  contacts = fallbackContacts,
}: ContactSectionProps) {
  return (
    <section id="contact" className="py-24 md:py-28">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-6 md:px-10 motion-safe:animate-[fade-up_0.7s_ease-out]">
        <h2 className="text-[clamp(2rem,3vw,2.25rem)] font-semibold leading-tight text-[var(--text-primary)]">
          Contact
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
        {contacts.map((contact, index) => (
            <a
              key={contact.label}
              href={contact.href}
              className="group flex flex-col gap-2 rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-surface)] p-6 text-left transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-[var(--bg-surface-hover)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-primary)] motion-safe:animate-[fade-up_0.7s_ease-out]"
              style={{ animationDelay: `${100 + index * 90}ms` }}
            >
              <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--bg-divider)] text-[var(--text-secondary)] transition-colors duration-200 ease-out group-hover:border-[var(--accent-muted)] group-hover:text-[var(--text-primary)]">
                  {resolveIcon(contact.label, contact.icon)}
                </span>
                {contact.label}
              </div>
              <span className="text-base font-medium text-[var(--text-primary)]">
                {contact.value}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
