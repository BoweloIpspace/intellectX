import { ConvexCoursesSection } from "@/components/education/convex-courses-section";
import { PageShell } from "@/components/education/page-shell";
import { AppPageHeader, AppPageStack } from "@/components/ui/app-page-primitives";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses - IntellectX",
  description: "Browse IntellectX course tracks with lessons, progress, and quizzes.",
};

export default function CoursesPage() {
  return (
    <PageShell>
      <AppPageStack>
        <AppPageHeader
          eyebrow="Courses"
          title="Choose your next intelligent learning path"
          description="Published course tracks with lesson flows, progress indicators, and quizzes built for focused study."
          align="center"
        />
        <ConvexCoursesSection />
      </AppPageStack>
    </PageShell>
  );
}
