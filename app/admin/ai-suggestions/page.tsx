"use client";

import AdminShell from "../components/AdminShell";
import SurfaceCard from "../components/SurfaceCard";
import { aiStyles } from "../../components/admin/ai-suggestions/styles";
import AiSuggestionsTour from "../../components/admin/ai-suggestions/AiSuggestionsTour";

export default function AiSuggestionsPage() {
  return (
    <AdminShell
      title="AI Suggestions"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "AI Suggestions" },
      ]}
    >
      <AiSuggestionsTour page="intro" />
      <SurfaceCard className={aiStyles.card}>
        <div className="flex min-h-[220px] items-center">
          <div data-tour="ai-intro-anchor" className="h-2 w-2" />
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
