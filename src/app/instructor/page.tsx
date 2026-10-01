import { StaffRouteGuard } from "@/components/auth/staff-route-guard";
import { PageShell } from "@/components/education/page-shell";
import { InstructorDashboard } from "@/components/instructor/instructor-dashboard";
import { InstructorWorkspaceNav } from "@/components/instructor/instructor-workspace-nav";
import { AppPageHeader, AppPageStack } from "@/components/ui/app-page-primitives";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instructor - IntellectX",
  description: "Secure instructor workspace for creating courses, managing content, and submitting drafts for review.",
};

export default function InstructorPage() {
  return (
    <StaffRouteGuard pathname="/instructor">
      <PageShell>
        <AppPageStack>
          <InstructorWorkspaceNav />
          <AppPageHeader
            eyebrow="Instructor workspace"
            title="Build and manage focused learning experiences"
            description="Create course drafts, manage lessons and quizzes, track review status, and submit complete courses to admins from one authenticated workspace."
          />
          <InstructorDashboard />
        </AppPageStack>
      </PageShell>
    </StaffRouteGuard>
  );
}
