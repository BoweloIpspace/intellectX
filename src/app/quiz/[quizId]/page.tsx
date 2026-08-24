import { QuizPageContent } from "@/components/education/quiz-page-content";
import { getCourse } from "@/data/courses";
import { getMobileTopicQuiz } from "@/data/mobile-topic-quizzes";
import { getQuiz, quizzes } from "@/data/quizzes";
import { getLearnerQuizDetail } from "@/lib/learner-catalog";
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
      href: `/mobile-quizzes?course=${encodeURIComponent(courseId)}&topic=${encodeURIComponent(requestedTopicId)}`,
      label: "Back to topic",
    };
  }

  return {
    href: `/mobile-quizzes?course=${encodeURIComponent(courseId)}`,
    label: "Back to course",
  };
}

export function generateStaticParams() {
  return quizzes.map((quiz) => ({ quizId: quiz.id }));
}

export async function generateMetadata({ params, searchParams }: QuizPageProps): Promise<Metadata> {
  const { quizId } = await params;
  const { from } = await searchParams;
  const mobileTopicQuiz = from === "mobile" ? getMobileTopicQuiz(quizId) : null;
  const detail = mobileTopicQuiz ? null : await getLearnerQuizDetail(quizId);
  const quiz = mobileTopicQuiz ?? detail?.quiz ?? getQuiz(quizId);

  return {
    title: quiz ? `${quiz.title} - IntellectX` : "Quiz - IntellectX",
    description: "Practice with an IntellectX multiple-choice quiz.",
  };
}

export default async function QuizPage({ params, searchParams }: QuizPageProps) {
  const { quizId } = await params;
  const { from, course: requestedCourseId, topic: requestedTopicId } = await searchParams;

  if (from === "mobile") {
    const mobileTopicQuiz = getMobileTopicQuiz(quizId);
    const mobileCourse = mobileTopicQuiz ? getCourse(mobileTopicQuiz.courseId) : null;

    if (mobileTopicQuiz && mobileCourse) {
      const returnTarget = getMobileReturnTarget(
        mobileCourse.id,
        mobileTopicQuiz.lessonId,
        requestedCourseId,
        requestedTopicId,
      );
      return (
        <QuizPageContent
          quiz={mobileTopicQuiz}
          courseId={mobileCourse.id}
          mobileRequested
          mobileReturnHref={returnTarget.href}
          mobileReturnLabel={returnTarget.label}
        />
      );
    }
  }

  const detail = await getLearnerQuizDetail(quizId);
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
