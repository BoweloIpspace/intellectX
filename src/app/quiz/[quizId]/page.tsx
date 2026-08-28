import { QuizPageContent } from "@/components/education/quiz-page-content";
import { getLearnerQuizPageDetail } from "@/lib/learner-detail";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type QuizPageProps = {
  params: Promise<{ quizId: string }>;
  searchParams: Promise<{ from?: string; course?: string; topic?: string }>;
};

function getMobileReturnTarget(
  courseId: string,
  lessonId: string | undefined,
  requestedCourseId: string | undefined,
  requestedTopicId: string | undefined,
) {
  if (requestedCourseId === courseId && requestedTopicId && lessonId === requestedTopicId) {
    return {
      href: `/mobile-infographies?course=${encodeURIComponent(courseId)}&topic=${encodeURIComponent(requestedTopicId)}`,
      label: "Back to infographic",
    };
  }

  return {
    href: `/mobile-study/${encodeURIComponent(courseId)}`,
    label: "Back to course",
  };
}

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const { quizId } = await params;
  const detail = await getLearnerQuizPageDetail(quizId);
  const quiz = detail?.quiz;

  return {
    title: quiz ? `${quiz.title} - IntellectX` : "Quiz - IntellectX",
    description: "Practice with an IntellectX timed quiz.",
  };
}

export default async function QuizPage({ params, searchParams }: QuizPageProps) {
  const { quizId } = await params;
  const { from, course: requestedCourseId, topic: requestedTopicId } = await searchParams;
  const detail = await getLearnerQuizPageDetail(quizId);
  const quiz = detail?.quiz;
  const course = detail?.course;

  if (!quiz || !course) {
    notFound();
  }

  const returnTarget = getMobileReturnTarget(course.id, quiz.lessonId, requestedCourseId, requestedTopicId);

  return (
    <QuizPageContent
      quiz={quiz}
      courseId={course.id}
      mobileRequested={from === "mobile"}
      mobileReturnHref={returnTarget.href}
      mobileReturnLabel={returnTarget.label}
    />
  );
}
