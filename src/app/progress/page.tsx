import { DataSourceBadge } from "@/components/education/data-source-badge";
import { LocalProgressContent } from "@/components/education/local-progress-content";
import { PageShell } from "@/components/education/page-shell";
import { AppPageHeader, AppPageStack } from "@/components/ui/app-page-primitives";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Progress - IntellectX",
  description: "Track IntellectX learning progress, streaks, quizzes, and next focus areas.",
};

export default function ProgressPage() {
  return (
    <PageShell>
      <AppPageStack>
        <AppPageHeader
          eyebrow="Progress"
          title="Your learning momentum"
          description="See selected courses and learning activity hydrated from your account when available. Missing data is shown as an empty state instead of estimated progress."
          meta={<DataSourceBadge />}
        />
        <LocalProgressContent />
      </AppPageStack>
    </PageShell>
  );
}


