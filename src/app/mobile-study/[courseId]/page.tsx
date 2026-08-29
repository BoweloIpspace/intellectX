import { MobileAppShell } from "@/components/education/mobile-app-shell";
import { MobileCourseTopics } from "@/components/education/mobile-course-topics";
import type { Metadata } from "next";

type MobileCoursePageProps = {
  params: Promise<{ courseId: string }>;
};

export const metadata: Metadata = {
  title: "Course Topics - IntellectX",
  description: "Choose a course topic, study its infographic, then start the matching quiz.",
};

export default async function MobileCoursePage({ params }: MobileCoursePageProps) {
  const { courseId } = await params;

  return (
    <MobileAppShell>
      <MobileCourseTopics courseId={courseId} />
    </MobileAppShell>
  );
}
