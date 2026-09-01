import { Mat111MobileExamPracticeList } from "@/components/education/mat111-mobile-exam-practice";
import { MobileAppShell } from "@/components/education/mobile-app-shell";
import { MobileExamsHome } from "@/components/education/mobile-exams-home";
import { MobilePastPaperList } from "@/components/education/mobile-past-papers";
import { MobileSelectedCourseGuard } from "@/components/education/mobile-selected-course-guard";
import { MAT111_COURSE_ID } from "@/data/mat111-course";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exams - IntellectX",
  description: "Practice long-form exams and lecture-note exam sets inside the IntellectX mobile app.",
};

type MobilePastPapersPageProps = {
  searchParams: Promise<{ course?: string; topic?: string }>;
};

export default async function MobilePastPapersPage({ searchParams }: MobilePastPapersPageProps) {
  const { course, topic } = await searchParams;

  return (
    <MobileAppShell>
      {course ? (
        <MobileSelectedCourseGuard courseId={course}>
          {course === MAT111_COURSE_ID ? (
            <Mat111MobileExamPracticeList topicId={topic} />
          ) : (
            <MobilePastPaperList courseId={course} />
          )}
        </MobileSelectedCourseGuard>
      ) : (
        <MobileExamsHome />
      )}
    </MobileAppShell>
  );
}
