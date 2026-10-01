import { StaffRouteGuard } from "@/components/auth/staff-route-guard";
import { PageShell } from "@/components/education/page-shell";
import { InstructorCourseBuilder } from "@/components/instructor/instructor-course-builder";
import { InstructorLessonMediaManager } from "@/components/instructor/instructor-lesson-media-manager";
import { InstructorWorkspaceNav } from "@/components/instructor/instructor-workspace-nav";
import { AppPageHeader, AppPageStack } from "@/components/ui/app-page-primitives";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Builder - IntellectX",
  description: "Create and edit authenticated instructor course drafts, lessons, quizzes, questions, and lesson media.",
};

type InstructorCourseBuilderPageProps = {
  searchParams: Promise<{ edit?: string; readonly?: string }>;
};

export default async function InstructorNewCoursePage({ searchParams }: InstructorCourseBuilderPageProps) {
  const { edit, readonly } = await searchParams;
  const readOnly = readonly === "1" || readonly === "true";

  return (
    <StaffRouteGuard pathname="/instructor/courses/new">
      <PageShell>
        <AppPageStack>
          <InstructorWorkspaceNav />
          <AppPageHeader
            eyebrow={edit ? (readOnly ? "View course" : "Edit course") : "Create course"}
            title={edit ? (readOnly ? "Review your course" : "Continue building your course") : "Build a new learning path"}
            description="Course details, lessons, quizzes, questions, authenticated file uploads, draft persistence, workflow state, and review submission are backed by server-authorized Convex operations."
          />
          <div className="space-y-6">
            <InstructorCourseBuilder editStableId={edit} />
            {edit ? <InstructorLessonMediaManager courseStableId={edit} readOnly={readOnly} /> : null}
          </div>
        </AppPageStack>
      </PageShell>
    </StaffRouteGuard>
  );
}
