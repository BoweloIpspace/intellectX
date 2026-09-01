import { Mat111MobileExpandedQuizPlayer } from "@/components/education/mat111-mobile-expanded-quiz-player";
import { MobileAppShell } from "@/components/education/mobile-app-shell";
import { MobileSelectedCourseGuard } from "@/components/education/mobile-selected-course-guard";
import { Button } from "@/components/ui/button";
import { MAT111_COURSE_ID } from "@/data/mat111-course";
import { getMat111ExpandedQuiz } from "@/data/mat111-expanded-quizzes";
import Link from "next/link";

type MobileExpandedQuizPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MobileExpandedQuizPage({ params }: MobileExpandedQuizPageProps) {
  const { id } = await params;
  const quiz = getMat111ExpandedQuiz(id);

  return (
    <MobileAppShell>
      <MobileSelectedCourseGuard courseId={MAT111_COURSE_ID}>
        {quiz ? (
          <Mat111MobileExpandedQuizPlayer quiz={quiz} />
        ) : (
          <section className="rounded-2xl border border-border/70 bg-background/70 p-6 text-center">
            <h1 className="text-xl font-semibold">Quiz unavailable</h1>
            <p className="text-muted-foreground mt-2 text-sm">This MAT111 further-question set could not be found.</p>
            <Button asChild className="mt-5">
              <Link href={`/mobile-study/${encodeURIComponent(MAT111_COURSE_ID)}`}>Back to MAT111</Link>
            </Button>
          </section>
        )}
      </MobileSelectedCourseGuard>
    </MobileAppShell>
  );
}
