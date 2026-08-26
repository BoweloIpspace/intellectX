"use client";

import { useLearnerAuthRuntime } from "@/components/providers/learner-auth-runtime-provider";
import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isClerkAuthEnabled } from "@/lib/auth-mode";
import {
  COURSE_SELECTION_CHANGE_EVENT,
  type CourseSelection,
  loadCourseSelection,
} from "@/lib/course-selection";
import { isMobileAppRuntime } from "@/lib/feature-scope";
import { type LearnerCatalog, useLearnerCatalog } from "@/lib/learner-catalog-client";
import { getLearnerSession } from "@/lib/learner-session";
import {
  QUIZ_ATTEMPT_HISTORY_CHANGE_EVENT,
  readQuizAttemptHistory,
  summarizeQuizAttemptHistory,
  type QuizAttemptHistoryItem,
} from "@/lib/quiz-attempt-history";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenCheckIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  ListChecksIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function MobileQuizzesSection() {
  const catalog = useLearnerCatalog();
  const [nativeAppSurface, setNativeAppSurface] = useState<boolean | null>(null);

  useEffect(() => {
    setNativeAppSurface(isMobileAppRuntime());
  }, []);

  if (catalog.isLoading || nativeAppSurface === null) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <AppLoadingSpinner label="Loading quizzes" showLabel />
      </div>
    );
  }

  if (!nativeAppSurface) {
    return <QuizCards catalog={catalog} quizzes={catalog.quizzes} />;
  }

  return <NativeCourseTopicQuizFlow catalog={catalog} />;
}

function NativeCourseTopicQuizFlow({ catalog }: { catalog: LearnerCatalog }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useLearnerAuthRuntime();
  const requestedCourseId = searchParams.get("course");
  const requestedTopicId = searchParams.get("topic");
  const setupRequested = searchParams.get("setup") === "1";
  const [accessReady, setAccessReady] = useState(false);
  const [selection, setSelection] = useState<CourseSelection | null>(null);

  useEffect(() => {
    if (isClerkAuthEnabled()) {
      if (!auth.isLoaded) return;
      if (!auth.isSignedIn) {
        router.replace("/login");
        return;
      }
    } else if (!getLearnerSession()) {
      router.replace("/login");
      return;
    }

    setAccessReady(true);
  }, [auth.isLoaded, auth.isSignedIn, router]);

  useEffect(() => {
    if (!accessReady) return;

    const syncSelection = () => setSelection(loadCourseSelection());
    syncSelection();
    window.addEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSelection);
    window.addEventListener("storage", syncSelection);
    window.addEventListener("pageshow", syncSelection);
    return () => {
      window.removeEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSelection);
      window.removeEventListener("storage", syncSelection);
      window.removeEventListener("pageshow", syncSelection);
    };
  }, [accessReady]);

  const selectedCourses = useMemo(() => {
    if (!selection) return [];
    return catalog.courses.filter((course) => selection.selectedCourseIds.includes(course.id));
  }, [catalog.courses, selection]);

  useEffect(() => {
    if (!accessReady || !selection) return;
    if (setupRequested || selectedCourses.length === 0) {
      router.replace("/mobile-profile#course-selection");
    }
  }, [accessReady, router, selectedCourses.length, selection, setupRequested]);

  if (!accessReady || !selection || setupRequested || selectedCourses.length === 0) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <AppLoadingSpinner label="Opening your Profile courses" showLabel />
      </div>
    );
  }

  const selectedCourse = requestedCourseId
    ? selectedCourses.find((course) => course.id === requestedCourseId) ?? null
    : null;

  if (requestedCourseId && !selectedCourse) {
    return <MessageState title="Course unavailable" description="Only courses selected in Profile can be opened here." />;
  }

  if (selectedCourse && requestedTopicId) {
    return <TopicQuizList catalog={catalog} courseId={selectedCourse.id} topicId={requestedTopicId} />;
  }

  if (selectedCourse) {
    return <CourseTopicList catalog={catalog} courseId={selectedCourse.id} />;
  }

  return <SelectedCourseList catalog={catalog} courses={selectedCourses} selection={selection} />;
}

function SelectedCourseList({
  catalog,
  courses,
  selection,
}: {
  catalog: LearnerCatalog;
  courses: LearnerCatalog["courses"];
  selection: CourseSelection;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <Badge variant="secondary">Quizzes</Badge>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Choose a course</h1>
          <p className="text-muted-foreground mt-2 text-sm">Only courses chosen in Profile appear here.</p>
        </div>
        {!selection.locked ? (
          <Button asChild size="sm" variant="outline">
            <Link href="/mobile-profile#course-selection">Change</Link>
          </Button>
        ) : null}
      </div>

      <div className="grid gap-3">
        {courses.map((course) => {
          const topicCount = catalog.lessons.filter(
            (lesson) => lesson.courseId === course.id && catalog.quizzes.some((quiz) => quiz.lessonId === lesson.id),
          ).length;
          const quizCount = catalog.quizzes.filter((quiz) => quiz.courseId === course.id).length;

          return (
            <Link
              key={course.id}
              href={`/mobile-quizzes?course=${encodeURIComponent(course.id)}`}
              className="flex min-h-28 items-center gap-4 rounded-2xl border border-border/70 bg-background/70 p-5 transition hover:bg-secondary/50"
            >
              <span className="bg-primary text-primary-foreground grid size-11 shrink-0 place-items-center rounded-full">
                <BookOpenIcon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-semibold tracking-tight">{course.title}</span>
                <span className="text-muted-foreground mt-1 block text-sm">{course.subject}</span>
                <span className="text-muted-foreground mt-2 block text-xs">
                  {topicCount} {topicCount === 1 ? "topic" : "topics"} · {quizCount} {quizCount === 1 ? "quiz" : "quizzes"}
                </span>
              </span>
              <ArrowRightIcon className="size-5" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function CourseTopicList({ catalog, courseId }: { catalog: LearnerCatalog; courseId: string }) {
  const course = catalog.courseById.get(courseId);
  const topics = catalog.lessons.filter(
    (lesson) => lesson.courseId === courseId && catalog.quizzes.some((quiz) => quiz.courseId === courseId && quiz.lessonId === lesson.id),
  );

  if (!course) return <MessageState title="Course unavailable" />;

  return (
    <section className="space-y-4">
      <Button asChild size="sm" variant="ghost" className="-ml-2">
        <Link href="/mobile-study">
          <ArrowLeftIcon className="size-4" />
          Home
        </Link>
      </Button>

      <div>
        <Badge variant="secondary">{course.subject}</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{course.title}</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">Choose a topic to see its quizzes.</p>
      </div>

      {topics.length === 0 ? (
        <MessageState title="No quiz topics published yet" description="This course has no published topic quizzes yet." />
      ) : (
        <div className="grid gap-3">
          {topics.map((topic) => {
            const count = catalog.quizzes.filter((quiz) => quiz.courseId === courseId && quiz.lessonId === topic.id).length;
            return (
              <Link
                key={topic.id}
                href={`/mobile-quizzes?course=${encodeURIComponent(courseId)}&topic=${encodeURIComponent(topic.id)}`}
                className="flex min-h-24 items-center gap-4 rounded-2xl border border-border/70 bg-background/70 p-4 transition hover:bg-secondary/50"
              >
                <span className="bg-secondary grid size-10 shrink-0 place-items-center rounded-full">
                  <ListChecksIcon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{topic.title}</span>
                  <span className="text-muted-foreground mt-1 block text-xs">
                    {count} {count === 1 ? "quiz" : "quizzes"} · {topic.duration}
                  </span>
                </span>
                <ArrowRightIcon className="size-5" />
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

function TopicQuizList({ catalog, courseId, topicId }: { catalog: LearnerCatalog; courseId: string; topicId: string }) {
  const topic = catalog.lessonById.get(topicId);
  const quizzes = catalog.quizzes.filter((quiz) => quiz.courseId === courseId && quiz.lessonId === topicId);

  if (!topic || topic.courseId !== courseId) {
    return <MessageState title="Topic unavailable" description="Return to the course and choose another topic." />;
  }

  return (
    <section className="space-y-4">
      <Button asChild size="sm" variant="ghost" className="-ml-2">
        <Link href={`/mobile-quizzes?course=${encodeURIComponent(courseId)}`}>
          <ArrowLeftIcon className="size-4" />
          Course
        </Link>
      </Button>
      <div>
        <Badge variant="secondary">Topic</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{topic.title}</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">{topic.summary}</p>
      </div>
      <QuizCards catalog={catalog} quizzes={quizzes} mobileContext={{ courseId, topicId }} />
    </section>
  );
}

function QuizCards({
  catalog,
  quizzes,
  mobileContext,
}: {
  catalog: LearnerCatalog;
  quizzes: LearnerCatalog["quizzes"];
  mobileContext?: { courseId: string; topicId: string };
}) {
  const [history, setHistory] = useState<QuizAttemptHistoryItem[]>([]);

  useEffect(() => {
    const syncHistory = () => setHistory(readQuizAttemptHistory());
    syncHistory();
    window.addEventListener(QUIZ_ATTEMPT_HISTORY_CHANGE_EVENT, syncHistory);
    window.addEventListener("storage", syncHistory);
    return () => {
      window.removeEventListener(QUIZ_ATTEMPT_HISTORY_CHANGE_EVENT, syncHistory);
      window.removeEventListener("storage", syncHistory);
    };
  }, []);

  const latestByQuizId = useMemo(() => summarizeQuizAttemptHistory(history).latestByQuizId, [history]);

  if (quizzes.length === 0) {
    return <MessageState title="No quizzes published for this topic" description="Choose another topic for now." />;
  }

  return (
    <div className="grid gap-3">
      {quizzes.map((quiz) => {
        const course = catalog.courseById.get(quiz.courseId);
        const attempt = latestByQuizId[quiz.id];
        const mobileHref = mobileContext
          ? `/quiz/${quiz.id}?from=mobile&course=${encodeURIComponent(mobileContext.courseId)}&topic=${encodeURIComponent(mobileContext.topicId)}`
          : `/quiz/${quiz.id}?from=mobile`;

        return (
          <article key={quiz.id} className="rounded-2xl border border-border/70 bg-background/70 p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="bg-primary text-primary-foreground grid size-10 place-items-center rounded-full">
                <BookOpenCheckIcon className="size-5" />
              </span>
              {attempt ? (
                <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                  <CheckCircle2Icon className="size-4" />
                  {attempt.score}/{attempt.totalQuestions} · {attempt.percentage}%
                </span>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary">{quiz.difficulty}</Badge>
              <Badge variant="outline">{quiz.estimatedTime}</Badge>
              <Badge variant="outline">
                {quiz.questions.length} {quiz.questions.length === 1 ? "question" : "questions"}
              </Badge>
            </div>
            <h2 className="mt-4 text-xl font-semibold tracking-tight">{quiz.title}</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              {course ? `${course.subject} · timed question practice` : "Timed question practice"}
            </p>
            <Button className="mt-5 min-h-12 w-full" asChild>
              <Link href={mobileHref}>
                {attempt ? "Try again" : "Start quiz"}
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </article>
        );
      })}
    </div>
  );
}

function MessageState({
  title,
  description = "Return to Home and choose another course.",
}: {
  title: string;
  description?: string;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-background/70 p-6 text-center">
      <BookOpenCheckIcon className="mx-auto size-6" />
      <h2 className="mt-4 text-xl font-semibold tracking-tight">{title}</h2>
      <p className="text-muted-foreground mt-2 text-sm leading-6">{description}</p>
    </section>
  );
}
