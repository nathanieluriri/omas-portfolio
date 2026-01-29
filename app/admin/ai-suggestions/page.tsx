"use client";

import { useRouter } from "next/navigation";
import AdminShell from "../components/AdminShell";
import SurfaceCard from "../components/SurfaceCard";
import Button from "../components/Button";
import { aiStyles } from "../../components/admin/ai-suggestions/styles";

export default function AiSuggestionsPage() {
  const router = useRouter();

  return (
    <AdminShell
      title="AI Suggestions"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "AI Suggestions" },
      ]}
    >
      <SurfaceCard className={aiStyles.card}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className={aiStyles.stepPill}>AI Suggestions</span>
            <h2 className={aiStyles.title}>Generate updates from your resume</h2>
            <p className={aiStyles.helper}>
              Upload a resume to draft content updates you can review and apply.
            </p>
          </div>
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={() => router.push("/admin/ai-suggestions/analysis")}
            >
              Start analysis
            </Button>
          </div>
        </div>
      </SurfaceCard>
    </AdminShell>
  );
}
