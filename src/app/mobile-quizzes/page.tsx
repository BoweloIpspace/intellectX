import { Mat111MobileTopicQuizzes } from "@/components/education/mat111-mobile-topic-quizzes";
import { MobileAppShell } from "@/components/education/mobile-app-shell";
import { MobileQuizzesSection } from "@/components/education/mobile-quizzes-section";
import { MobileSelectedCourseGuard } from "@/components/education/mobile-selected-course-guard";
import { Badge } from "@/components/ui/badge";
import { MAT111_COURSE_ID } from "@/data/mat111-course";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile Courses & Practice - IntellectX",
  description: "Choose your IntellectX courses, then practice available quizzes and exams.",
};

type MobileQuizzesPageProps = {
  searchParams: Promise<{ course?: string; topic?: string }>;
};

export default async function MobileQuizzesPage({ searchParams }: MobileQuizzesPageProps) {
  const { course, topic } = await searchParams;
  const mat111Topic = course === MAT111_COURSE_ID && Boolean(topic);

  return (
    <MobileAppShell>
      <section className="mb-3 flex flex-col items-start gap-2">
        <Badge variant="secondary" className="uppercase">
          Courses & practice
        </Badge>
        <h1 className="text-2xl leading-[1.08] font-medium tracking-tight">Practice quizzes and exams</h1>
      </section>

      <div className="mobile-quizzes-flow">
        {mat111Topic && topic ? (
          <MobileSelectedCourseGuard courseId={MAT111_COURSE_ID}>
            <Mat111MobileTopicQuizzes topicId={topic} />
          </MobileSelectedCourseGuard>
        ) : (
          <MobileQuizzesSection />
        )}
      </div>
    </MobileAppShell>
  );
}
