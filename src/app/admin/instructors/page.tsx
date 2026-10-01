import { AdminInstructorsWorkspace } from "@/components/admin/admin-instructors-workspace";
import { AdminWorkspaceNav } from "@/components/admin/admin-workspace-nav";
import { StaffRouteGuard } from "@/components/auth/staff-route-guard";
import { PageShell } from "@/components/education/page-shell";
import { CardContent } from "@/components/ui/card";
import { AppPageHeader, AppPageStack, AppSurface } from "@/components/ui/app-page-primitives";
import { getAdminClerkSession, listAdminManagedUsers, type AdminManagedUser } from "@/lib/server-staff-auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instructors - IntellectX",
  description: "Secure Clerk-backed instructor access management for IntellectX administrators.",
};

export default async function AdminInstructorsPage() {
  const session = await getAdminClerkSession();
  let users: AdminManagedUser[] = [];
  let loadError: string | null = null;

  if (session) {
    try {
      users = await listAdminManagedUsers();
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Unable to load Clerk users.";
    }
  }

  return (
    <StaffRouteGuard pathname="/admin/instructors">
      <PageShell>
        <AppPageStack>
          <AdminWorkspaceNav />
          <AppPageHeader
            eyebrow="Instructor access"
            title="Manage trusted instructors"
            description="Grant or revoke instructor access through server-authorized Clerk metadata changes. Admin accounts remain protected from this surface."
          />
          {loadError ? (
            <AppSurface className="border-rose-500/20 bg-rose-500/5">
              <CardContent className="py-8 text-sm leading-6">
                Unable to load Clerk users: {loadError}
              </CardContent>
            </AppSurface>
          ) : (
            <AdminInstructorsWorkspace users={users} />
          )}
        </AppPageStack>
      </PageShell>
    </StaffRouteGuard>
  );
}

