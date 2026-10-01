import { LearnerSessionName } from "@/components/auth/learner-session-name";
import { DataSourceBadge } from "@/components/education/data-source-badge";
import { LocalDashboardContent } from "@/components/education/local-dashboard-content";
import { PageShell } from "@/components/education/page-shell";
import { AppPageHeader, AppPageStack } from "@/components/ui/app-page-primitives";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - IntellectX",
  description: "View IntellectX courses, recent lessons, quiz progress, and study focus.",
};

export default function DashboardPage() {
  return (
    <PageShell>
      <AppPageStack>
        <AppPageHeader
          eyebrow="Dashboard"
          title={<>Welcome back, <LearnerSessionName firstNameOnly /></>}
          description="Your learning cockpit for selected courses and activity loaded from your account when available."
          meta={<DataSourceBadge />}
        />
        <LocalDashboardContent />
      </AppPageStack>
    </PageShell>
  );
}






