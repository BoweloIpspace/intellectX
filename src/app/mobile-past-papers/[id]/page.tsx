import { Mat111MobileExamPracticeRunner } from "@/components/education/mat111-mobile-exam-practice";
import { MobileAppShell } from "@/components/education/mobile-app-shell";
import { MobilePastPaperSelectionGuard } from "@/components/education/mobile-past-paper-selection-guard";
import { MobilePastPaperRunner } from "@/components/education/mobile-past-papers";
import { MobileSelectedCourseGuard } from "@/components/education/mobile-selected-course-guard";
import { MAT111_COURSE_ID } from "@/data/mat111-course";
import { isMat111MobileExamPaperId } from "@/data/mat111-mobile-study";
import type { Metadata } from "next";
import styles from "./exam-diagrams.module.css";

type MobilePastPaperPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Exam - IntellectX",
  description: "Work through a long-form exam question by question in the IntellectX mobile app.",
};

export default async function MobilePastPaperPage({ params }: MobilePastPaperPageProps) {
  const { id } = await params;

  if (isMat111MobileExamPaperId(id)) {
    return (
      <MobileAppShell>
        <MobileSelectedCourseGuard courseId={MAT111_COURSE_ID}>
          <Mat111MobileExamPracticeRunner paperId={id} />
        </MobileSelectedCourseGuard>
      </MobileAppShell>
    );
  }

  return (
    <MobileAppShell>
      <MobilePastPaperSelectionGuard paperId={id}>
        <div className={styles.examSurface}>
          <MobilePastPaperRunner paperId={id} />
        </div>
      </MobilePastPaperSelectionGuard>
    </MobileAppShell>
  );
}
