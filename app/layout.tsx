import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oma Dashi — Portfolio",
  description:
    "Developer-focused portfolio showcasing systems thinking, work, and experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body
        className="antialiased"
      >
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
          {children}
        </div>
      </body>
    </html>
  );
}
