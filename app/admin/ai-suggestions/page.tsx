"use client";

import AdminShell from "../components/AdminShell";
import AiSuggestionsFlow from "../../components/admin/ai-suggestions/AiSuggestionsFlow";

export default function AiSuggestionsPage() {
  return (
    <AdminShell
      title="AI Suggestions"
      breadcrumb={[{ label: "Admin", href: "/admin/dashboard" }, { label: "AI" }]}
    >
      <AiSuggestionsFlow />
    </AdminShell>
  );
}
