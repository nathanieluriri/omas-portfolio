"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "ai_suggestions_tour_step";

type TourPage = "intro" | "analysis" | "selections" | "final";

const tourCopy: Record<
  TourPage,
  { element: string; intro: string; nextKey?: TourPage; nextRoute?: string; showNext: boolean }
> = {
  intro: {
    element: '[data-tour="ai-intro-anchor"]',
    intro:
      "Welcome. We will guide you through the AI Suggestions flow. Click Continue to begin.",
    nextKey: "analysis",
    nextRoute: "/admin/ai-suggestions/analysis",
    showNext: true,
  },
  analysis: {
    element: '[data-tour="ai-analyze"]',
    intro:
      "Upload your resume, then click Analyze to continue.",
    nextKey: "selections",
    showNext: false,
  },
  selections: {
    element: '[data-tour="ai-apply"]',
    intro:
      "Pick the suggestions you want, then click Apply to proceed to the final step.",
    nextKey: "final",
    showNext: false,
  },
  final: {
    element: '[data-tour="ai-content"]',
    intro:
      "All done. Open the Content editor to confirm your updates and make final tweaks.",
    showNext: false,
  },
};

const waitForEl = (selector: string, timeout = 5000) =>
  new Promise<Element>((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      if (Date.now() - start > timeout) return reject(new Error("timeout"));
      requestAnimationFrame(tick);
    };
    tick();
  });

export function setAiSuggestionsTourStep(step: TourPage | "done") {
  if (typeof window === "undefined") return;
  if (step === "done") {
    window.localStorage.setItem(STORAGE_KEY, "done");
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, step);
}

const readStep = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
};

export default function AiSuggestionsTour({ page }: { page: TourPage }) {
  const router = useRouter();

  const options = useMemo(() => {
    const config = tourCopy[page];
    return {
      steps: [
        {
          element: config.element,
          intro: config.intro,
        },
      ],
      showProgress: false,
      showBullets: false,
      showStepNumbers: false,
      showButtons: config.showNext,
      showPrevButton: false,
      showSkipButton: false,
      exitOnEsc: true,
      exitOnOverlayClick: false,
      scrollToElement: true,
      disableInteraction: false,
      nextLabel: "Continue",
      doneLabel: "Continue",
    };
  }, [page]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = readStep();
    if (stored === "done") return;
    if (stored && stored !== page) return;

    const config = tourCopy[page];
    let cancelled = false;

    const start = async () => {
      try {
        const { default: introJs } = await import("intro.js");
        const el = await waitForEl(config.element);
        if (cancelled) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const instance = introJs();
        instance.setOptions(options);
        instance.oncomplete(() => {
          if (config.nextKey) {
            setAiSuggestionsTourStep(config.nextKey);
          } else {
            setAiSuggestionsTourStep("done");
          }
          if (config.nextRoute) {
            router.push(config.nextRoute);
          }
        });
        instance.onexit(() => {
          if (!readStep()) setAiSuggestionsTourStep(page);
        });
        instance.start();
      } catch {
        // If the element never appears, do nothing.
      }
    };

    const timer = window.setTimeout(() => {
      void start();
    }, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [options, page, router]);

  return null;
}
