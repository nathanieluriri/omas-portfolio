"use client";

export default function SessionLoader({ label = "Checking session" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 text-[var(--text-muted)]">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="h-2.5 w-2.5 rounded-full bg-current animate-bounce"
            style={{ animationDelay: `${index * 150}ms` }}
          />
        ))}
      </div>
      <p className="text-sm">{label}...</p>
    </div>
  );
}
