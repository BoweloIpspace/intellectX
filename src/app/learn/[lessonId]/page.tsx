import { LessonBlockRenderer } from "@/components/education/lesson-block-renderer";
import { LessonCompletionAction } from "@/components/education/lesson-completion-action";
import { LessonProgressSync } from "@/components/education/lesson-progress-sync";
import { PageShell } from "@/components/education/page-shell";
import { VideoPlayer } from "@/components/education/video-player";
import { Button } from "@/components/ui/button";
import { AppPageHeader, AppPageStack, AppSurface } from "@/components/ui/app-page-primitives";
import { getLearnerLessonPageDetail } from "@/lib/learner-detail";
import { ArrowRightIcon, ClockIcon, FileQuestionIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type LessonPageProps = {
  params: Promise<{ lessonId: string }>;
};

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { lessonId } = await params;
  const detail = await getLearnerLessonPageDetail(lessonId);
  const lesson = detail?.lesson;

  return {
    title: lesson ? `${lesson.title} - IntellectX` : "Lesson - IntellectX",
    description: lesson?.summary,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const detail = await getLearnerLessonPageDetail(lessonId);
  const lesson = detail?.lesson;
  const course = detail?.course;

  if (!lesson || !course) {
    notFound();
  }

  return (
    <PageShell>
      <LessonProgressSync lessonId={lesson.id} />
      <AppPageStack>
        <AppPageHeader
          eyebrow={course.title}
          title={lesson.title}
          description={lesson.summary}
          meta={<p className="text-muted-foreground inline-flex items-center gap-2 text-sm"><ClockIcon className="size-4" />{lesson.duration}</p>}
        />
        <article>
          <section className="space-y-6">
          <div className="space-y-6">
            <div>
              <VideoPlayer
                title={lesson.title}
                videoUrl={lesson.videoUrl}
                posterUrl={lesson.posterUrl}
                currentLessonId={lesson.id}
                playlist={detail.lessons}
              />
            </div>
            <AppSurface id="lesson-flashcards" aria-label="Lesson notes" className="scroll-mt-28 p-5 sm:p-6 md:p-8">
              <div className="space-y-6 text-base leading-8 md:text-lg">
                {lesson.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {lesson.blocks && <LessonBlockRenderer blocks={lesson.blocks} />}
              </div>
            </AppSurface>
          </div>
          </section>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <LessonCompletionAction lessonId={lesson.id} />
          {lesson.nextLessonId && (
            <Button size="lg" asChild>
              <Link href={`/learn/${lesson.nextLessonId}`}>
                Next lesson
                <ArrowRightIcon />
              </Link>
            </Button>
          )}
          {lesson.quizId && (
            <Button variant="outline" size="lg" asChild>
              <Link href={`/quiz/${lesson.quizId}`}>
                Related quiz
                <FileQuestionIcon />
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="lg" asChild>
            <Link href={`/courses/${course.id}`}>Back to course</Link>
          </Button>
          </div>
        </article>
      </AppPageStack>
    </PageShell>
  );
}
