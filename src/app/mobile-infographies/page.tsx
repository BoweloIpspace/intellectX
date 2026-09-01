import { Mat111MobileInfographies } from "@/components/education/mat111-mobile-infographies";
import { MobileAppShell } from "@/components/education/mobile-app-shell";
import { MobileInfographies } from "@/components/education/mobile-infographies";
import { MobileSelectedCourseGuard } from "@/components/education/mobile-selected-course-guard";
import { MAT111_COURSE_ID } from "@/data/mat111-course";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infographies - IntellectX",
  description: "Swipe through visual study summaries from your selected courses.",
};

type MobileInfographiesPageProps = {
  searchParams: Promise<{ course?: string; topic?: string }>;
};

export default async function MobileInfographiesPage({ searchParams }: MobileInfographiesPageProps) {
  const { course, topic } = await searchParams;
  const mat111Focused = course === MAT111_COURSE_ID;

  return (
    <MobileAppShell>
      {mat111Focused ? (
        <MobileSelectedCourseGuard courseId={MAT111_COURSE_ID}>
          <Mat111MobileInfographies requestedTopicId={topic} />
        </MobileSelectedCourseGuard>
      ) : (
        <MobileInfographies />
      )}
    </MobileAppShell>
  );
}
