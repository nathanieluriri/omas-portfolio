import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
          {children}
        </div>
      </body>
    </html>
  );
}
