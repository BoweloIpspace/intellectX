import { AdminPastPapersWorkspace } from "@/components/admin/admin-past-papers-workspace";
import { AdminWorkspaceNav } from "@/components/admin/admin-workspace-nav";
import { StaffRouteGuard } from "@/components/auth/staff-route-guard";
import { PageShell } from "@/components/education/page-shell";
import { AppPageHeader, AppPageStack } from "@/components/ui/app-page-primitives";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Past Paper Administration - IntellectX",
  description: "Secure administration for IntellectX Past Papers, questions, model answers, and publication state.",
};

export default function AdminPastPapersPage() {
  return (
    <StaffRouteGuard pathname="/admin/past-papers">
      <PageShell>
        <AppPageStack>
          <AdminWorkspaceNav />
          <AppPageHeader
            eyebrow="Past papers"
            title="Manage Past Papers and answers"
            description="Create, edit, publish, and delete paper records and their question-level source material, model answers, explanations, ordering, and marks through admin-authorized Convex mutations."
          />
          <AdminPastPapersWorkspace />
        </AppPageStack>
      </PageShell>
    </StaffRouteGuard>
  );
}
