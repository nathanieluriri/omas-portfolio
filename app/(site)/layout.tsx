import type { Metadata } from "next";

import Footer from "../components/Footer";
import Header from "../components/Header";
import { fetchPortfolioLive } from "../../lib/server/portfolio";
import { themeToCssString, themeToStyle } from "../../lib/theme";

export async function generateMetadata(): Promise<Metadata> {
  const portfolio = await fetchPortfolioLive();
  const metadata = portfolio?.metadata;

  return {
    title: metadata?.title ?? "Oma Dashi — Portfolio",
    description:
      metadata?.description ??
      "Developer-focused portfolio showcasing systems thinking, work, and experience.",
    authors: metadata?.author ? [{ name: metadata.author }] : undefined,
  };
}

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const portfolio = await fetchPortfolioLive();
  const navItems =
    portfolio?.navItems && portfolio.navItems.length > 0
      ? portfolio.navItems
      : undefined;
  const footer = portfolio?.footer ?? undefined;
  const themeStyle = themeToStyle(portfolio?.theme);
  const themeCss = themeToCssString(portfolio?.theme);

  return (
    <>
      {themeCss ? (
        <style
          // Prevent hydration mismatch when values differ between server/client renders.
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: `:root{${themeCss}}` }}
        />
      ) : null}
      <div
        className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]"
        style={themeStyle}
      >
        <Header navItems={navItems} />
        <main>{children}</main>
        <Footer footer={footer} />
      </div>
    </>
  );
}
