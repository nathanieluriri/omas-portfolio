import type { ReactNode } from "react";
import AiSuggestionsProvider from "../../components/admin/ai-suggestions/AiSuggestionsProvider";

export default function AiSuggestionsLayout({ children }: { children: ReactNode }) {
  return <AiSuggestionsProvider>{children}</AiSuggestionsProvider>;
}
