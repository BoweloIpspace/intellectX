import { AdminCourseReviewWorkspace } from "@/components/admin/admin-course-review-workspace";
import { AdminWorkspaceNav } from "@/components/admin/admin-workspace-nav";
import { StaffRouteGuard } from "@/components/auth/staff-route-guard";
import { PageShell } from "@/components/education/page-shell";
import { AppPageHeader, AppPageStack } from "@/components/ui/app-page-primitives";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Review - IntellectX",
  description: "Secure admin review and publication workflow for instructor-created IntellectX courses.",
};

type AdminCourseReviewPageProps = {
  searchParams: Promise<{ course?: string }>;
};

export default async function AdminCourseReviewPage({ searchParams }: AdminCourseReviewPageProps) {
  const { course } = await searchParams;

  return (
    <StaffRouteGuard pathname="/admin/course-review">
      <PageShell>
        <AppPageStack>
          <AdminWorkspaceNav />
          <AppPageHeader
            eyebrow="Admin review"
            title="Review, approve, and publish courses"
            description="Inspect real submitted lesson content, videos, quizzes, questions, and audit history before applying server-authorized workflow decisions."
          />
          <AdminCourseReviewWorkspace initialCourseStableId={course} />
        </AppPageStack>
      </PageShell>
    </StaffRouteGuard>
  );
}
