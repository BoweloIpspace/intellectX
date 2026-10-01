import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminWorkspaceNav } from "@/components/admin/admin-workspace-nav";
import { StaffRouteGuard } from "@/components/auth/staff-route-guard";
import { PageShell } from "@/components/education/page-shell";
import { AppPageHeader, AppPageStack } from "@/components/ui/app-page-primitives";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - IntellectX",
  description: "Secure IntellectX administration for course review, publication workflow, and instructor access.",
};

export default function AdminPage() {
  return (
    <StaffRouteGuard pathname="/admin">
      <PageShell>
        <AppPageStack>
          <AdminWorkspaceNav />
          <AppPageHeader
            eyebrow="Admin"
            title="Course workflow control center"
            description="Review submitted instructor courses, control publication state, inspect workflow evidence, and manage instructor access through trusted server-authorized operations."
          />
          <AdminDashboard />
        </AppPageStack>
      </PageShell>
    </StaffRouteGuard>
  );
}
