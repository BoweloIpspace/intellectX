import { AdminPastPapersWorkspace } from "@/components/admin/admin-past-papers-workspace";
import { AdminWorkspaceNav } from "@/components/admin/admin-workspace-nav";
import { StaffRouteGuard } from "@/components/auth/staff-route-guard";
import { PageShell } from "@/components/education/page-shell";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Past Paper Administration - IntellectX",
  description: "Secure administration for IntellectX Past Papers, questions, model answers, and publication state.",
};

export default function AdminPastPapersPage() {
  return (
    <StaffRouteGuard pathname="/admin/past-papers">
      <PageShell>
        <AdminWorkspaceNav />
        <section className="mb-8 flex flex-col gap-4">
          <Badge variant="secondary" className="w-fit uppercase">
            Past Papers
          </Badge>
          <h1 className="max-w-4xl text-4xl leading-[1.1] font-medium tracking-tight md:text-6xl">
            Manage Past Papers and answers
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-7 md:text-lg">
            Create, edit, publish, and delete paper records and their question-level source material, model answers, explanations, ordering, and marks through admin-authorized Convex mutations.
          </p>
        </section>
        <AdminPastPapersWorkspace />
      </PageShell>
    </StaffRouteGuard>
  );
}
