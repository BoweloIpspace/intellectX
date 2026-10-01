import { StaffRouteGuard } from "@/components/auth/staff-route-guard";
import { PageShell } from "@/components/education/page-shell";
import { InstructorCourseList } from "@/components/instructor/instructor-course-list";
import { InstructorWorkspaceNav } from "@/components/instructor/instructor-workspace-nav";
import { AppPageHeader, AppPageStack } from "@/components/ui/app-page-primitives";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Instructor Courses - IntellectX",
  description: "Manage authenticated instructor course drafts, content, workflow state, and learner previews.",
};

export default function InstructorCoursesPage() {
  return (
    <StaffRouteGuard pathname="/instructor/courses">
      <PageShell>
        <AppPageStack>
          <InstructorWorkspaceNav />
          <AppPageHeader
            eyebrow="Course management"
            title="Manage your courses"
            description="Search real instructor-owned courses, respond to review feedback, continue editable drafts, and preview published learner-facing content."
            action={
              <Button size="lg" asChild>
                <Link href="/instructor/courses/new">
                  <PlusIcon className="size-4" />
                  Create course
                </Link>
              </Button>
            }
          />
          <InstructorCourseList />
        </AppPageStack>
      </PageShell>
    </StaffRouteGuard>
  );
}
