"use client";

import { useLearnerAuthRuntime } from "@/components/providers/learner-auth-runtime-provider";
import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ACADEMIC_PROFILE_CHANGE_EVENT,
  type AcademicProfile,
  courseMatchesAcademicProfile,
  loadAcademicProfile,
} from "@/lib/academic-profile";
import { isClerkAuthEnabled } from "@/lib/auth-mode";
import {
  COURSE_SELECTION_CHANGE_EVENT,
  COURSE_SELECTION_LIMIT,
  type CourseSelection,
  loadCourseSelection,
  toggleSelectedCourse,
} from "@/lib/course-selection";
import { convexEnv } from "@/lib/education-data";
import { isMobileAppRuntime } from "@/lib/feature-scope";
import { buildLearnerCatalog, type LearnerCatalog, useLearnerCatalog } from "@/lib/learner-catalog-client";
import { getLearnerSession } from "@/lib/learner-session";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenCheckIcon,
  BookOpenIcon,
  CheckIcon,
  ListChecksIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function MobileQuizzesSection() {
  if (!convexEnv.isConfigured) {
    return <MobileQuizzesContent catalog={buildLearnerCatalog()} />;
  }

  return <ConvexMobileQuizzesSection />;
}

function ConvexMobileQuizzesSection() {
  const catalog = useLearnerCatalog();
  return <MobileQuizzesContent catalog={catalog} />;
}

function MobileQuizzesContent({ catalog }: { catalog: LearnerCatalog }) {
  const [nativeAppSurface, setNativeAppSurface] = useState(true);

  useEffect(() => {
    setNativeAppSurface(isMobileAppRuntime());
  }, []);

  if (catalog.isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <AppLoadingSpinner label="Loading mobile study catalog" showLabel />
      </div>
    );
  }

  if (!nativeAppSurface) {
    return <FlatQuizLibrary catalog={catalog} />;
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
  const [profile, setProfile] = useState<AcademicProfile | null>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [selectingCourses, setSelectingCourses] = useState(setupRequested);

  useEffect(() => {
    if (isClerkAuthEnabled()) {
      if (!auth.isLoaded) {
        return;
      }

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

    function syncSelection() {
      setSelection(loadCourseSelection());
    }

    function syncProfile() {
      setProfile(loadAcademicProfile());
    }

    syncSelection();
    syncProfile();
    window.addEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSelection);
    window.addEventListener(ACADEMIC_PROFILE_CHANGE_EVENT, syncProfile);
    window.addEventListener("storage", syncSelection);

    return () => {
      window.removeEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSelection);
      window.removeEventListener(ACADEMIC_PROFILE_CHANGE_EVENT, syncProfile);
      window.removeEventListener("storage", syncSelection);
    };
  }, [accessReady]);

  const quizCourses = useMemo(
    () => catalog.courses.filter((course) => catalog.lessons.some((lesson) => lesson.courseId === course.id)),
    [catalog.courses, catalog.lessons],
  );

  const selectableCourses = useMemo(() => {
    if (!profile) return quizCourses;
    const matchedCourses = quizCourses.filter((course) => courseMatchesAcademicProfile(course, profile));
    return matchedCourses.length > 0 ? matchedCourses : quizCourses;
  }, [profile, quizCourses]);

  if (!accessReady || !selection) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <AppLoadingSpinner label="Loading your courses" showLabel />
      </div>
    );
  }

  const selectedCourses = quizCourses.filter((course) => selection.selectedCourseIds.includes(course.id));
  const needsCourseSelection = selectingCourses || setupRequested || selectedCourses.length === 0;

  function toggleCourse(courseId: string) {
    setSelectingCourses(true);
    const update = toggleSelectedCourse(courseId, selection ?? undefined);
    setSelection(update.selection);
    setSelectionError(update.error ?? null);
  }

  function continueWithCourses() {
    setSelectingCourses(false);
    setSelectionError(null);
    router.replace("/mobile-study");
  }

  if (needsCourseSelection) {
    return (
      <CourseSelectionStep
        courses={selectableCourses}
        catalog={catalog}
        selection={selection}
        error={selectionError}
        onToggle={toggleCourse}
        onContinue={continueWithCourses}
      />
    );
  }

  const selectedCourse = requestedCourseId
    ? selectedCourses.find((course) => course.id === requestedCourseId) ?? null
    : null;

  if (selectedCourse && requestedTopicId) {
    return <TopicQuizList catalog={catalog} courseId={selectedCourse.id} topicId={requestedTopicId} />;
  }

  if (selectedCourse) {
    return <CourseTopicList catalog={catalog} courseId={selectedCourse.id} />;
  }

  return <SelectedCourseList catalog={catalog} courses={selectedCourses} selection={selection} />;
}

function CourseSelectionStep({
  courses,
  catalog,
  selection,
  error,
  onToggle,
  onContinue,
}: {
  courses: LearnerCatalog["courses"];
  catalog: LearnerCatalog;
  selection: CourseSelection;
  error: string | null;
  onToggle: (courseId: string) => void;
  onContinue: () => void;
}) {
  const selectedAvailableCount = courses.filter((course) => selection.selectedCourseIds.includes(course.id)).length;

  if (courses.length === 0) {
    return (
      <section className="animate-widget rounded-lg border border-white/70 bg-white/60 p-6 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
        <BookOpenIcon className="mx-auto size-6" />
        <h2 className="mt-4 text-xl font-semibold tracking-tight">No quiz courses available yet</h2>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          Courses will appear here as soon as they have learner topics and quizzes available.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
        <Badge variant="secondary">Course setup</Badge>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">Choose your courses</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Pick the courses you want on Home. You can select up to {COURSE_SELECTION_LIMIT} courses.
        </p>
        <p className="mt-3 text-sm font-medium">
          {selection.selectedCourseIds.length} / {COURSE_SELECTION_LIMIT} selected
        </p>
      </div>

      <div className="grid gap-3">
        {courses.map((course) => {
          const selected = selection.selectedCourseIds.includes(course.id);
          const topicCount = catalog.lessons.filter((lesson) => lesson.courseId === course.id).length;

          return (
            <button
              key={course.id}
              type="button"
              aria-pressed={selected}
              disabled={selection.locked}
              onClick={() => onToggle(course.id)}
              className="animate-widget flex min-h-28 w-full touch-manipulation items-start gap-4 rounded-lg border border-white/70 bg-white/60 p-4 text-left shadow-sm backdrop-blur transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:bg-card/60"
            >
              <span
                className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border ${
                  selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                }`}
              >
                {selected ? <CheckIcon className="size-4" /> : <BookOpenIcon className="size-4" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">{course.title}</span>
                <span className="text-muted-foreground mt-1 block text-sm">{course.subject}</span>
                <span className="text-muted-foreground mt-2 block text-xs">
                  {topicCount} {topicCount === 1 ? "topic" : "topics"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {selection.locked ? (
        <p className="text-muted-foreground text-sm" role="status">
          Your course selection is locked.
        </p>
      ) : null}
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <Button className="min-h-12 w-full" disabled={selectedAvailableCount === 0} onClick={onContinue}>
        Continue to Home
        <ArrowRightIcon className="size-4" />
      </Button>
    </section>
  );
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
          <Badge variant="secondary">My courses</Badge>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Choose a course</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">Tap a course to open its topics.</p>
        </div>
        {!selection.locked ? (
          <Button asChild size="sm" variant="outline">
            <Link href="/mobile-quizzes?setup=1">Change</Link>
          </Button>
        ) : null}
      </div>

      <div className="grid gap-3">
        {courses.map((course) => {
          const topicCount = catalog.lessons.filter((lesson) => lesson.courseId === course.id).length;
          return (
            <Link
              key={course.id}
              href={`/mobile-quizzes?course=${encodeURIComponent(course.id)}`}
              className="animate-widget flex min-h-36 items-center gap-4 rounded-lg border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur transition hover:bg-white/80 dark:border-white/10 dark:bg-card/60"
            >
              <span className="bg-primary text-primary-foreground grid size-11 shrink-0 place-items-center rounded-full">
                <BookOpenIcon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-semibold tracking-tight text-foreground">{course.title}</span>
                <span className="text-muted-foreground mt-1 block text-sm">{course.subject}</span>
                <span className="text-muted-foreground mt-2 block text-xs">
                  {topicCount} {topicCount === 1 ? "topic" : "topics"}
                </span>
              </span>
              <ArrowRightIcon className="size-5 shrink-0" />
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
    (lesson) =>
      lesson.courseId === courseId &&
      catalog.quizzes.some((quiz) => quiz.courseId === courseId && quiz.lessonId === lesson.id),
  );

  if (!course || topics.length === 0) {
    return <SelectedCourseFallback />;
  }

  return (
    <section className="space-y-4">
      <Button asChild size="sm" variant="ghost" className="-ml-2">
        <Link href="/mobile-study">
          <ArrowLeftIcon className="size-4" />
          Home
        </Link>
      </Button>

      <div className="rounded-lg border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
        <Badge variant="secondary">{course.subject}</Badge>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">{course.title}</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-6">Choose a topic to see its quizzes.</p>
      </div>

      <div className="grid gap-3">
        {topics.map((topic) => {
          const quizCount = catalog.quizzes.filter(
            (quiz) => quiz.courseId === courseId && quiz.lessonId === topic.id,
          ).length;

          return (
            <Link
              key={topic.id}
              href={`/mobile-quizzes?course=${encodeURIComponent(courseId)}&topic=${encodeURIComponent(topic.id)}`}
              className="animate-widget flex min-h-28 items-center gap-4 rounded-lg border border-white/70 bg-white/60 p-4 shadow-sm backdrop-blur transition hover:bg-white/80 dark:border-white/10 dark:bg-card/60"
            >
              <span className="bg-secondary grid size-10 shrink-0 place-items-center rounded-full">
                <ListChecksIcon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">{topic.title}</span>
                <span className="text-muted-foreground mt-1 block text-xs">{topic.duration}</span>
                <span className="text-muted-foreground mt-2 block text-xs">
                  {quizCount} {quizCount === 1 ? "quiz" : "quizzes"}
                </span>
              </span>
              <ArrowRightIcon className="size-5 shrink-0" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function TopicQuizList({
  catalog,
  courseId,
  topicId,
}: {
  catalog: LearnerCatalog;
  courseId: string;
  topicId: string;
}) {
  const course = catalog.courseById.get(courseId);
  const topic = catalog.lessonById.get(topicId);
  const quizzes = catalog.quizzes.filter((quiz) => quiz.courseId === courseId && quiz.lessonId === topicId);

  if (!course || !topic || topic.courseId !== courseId || quizzes.length === 0) {
    return <SelectedCourseFallback />;
  }

  return (
    <section className="space-y-4">
      <Button asChild size="sm" variant="ghost" className="-ml-2">
        <Link href={`/mobile-quizzes?course=${encodeURIComponent(courseId)}`}>
          <ArrowLeftIcon className="size-4" />
          Topics
        </Link>
      </Button>

      <div className="rounded-lg border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
        <Badge variant="secondary">Topic</Badge>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">{topic.title}</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-6">{topic.summary}</p>
      </div>

      <QuizCards catalog={catalog} quizzes={quizzes} />
    </section>
  );
}

function SelectedCourseFallback() {
  return (
    <section className="animate-widget rounded-lg border border-white/70 bg-white/60 p-6 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
      <BookOpenCheckIcon className="mx-auto size-6" />
      <h2 className="mt-4 text-xl font-semibold tracking-tight">Course content unavailable</h2>
      <p className="text-muted-foreground mt-3 text-sm leading-6">Return Home and choose another course.</p>
      <Button asChild className="mt-5">
        <Link href="/mobile-study">Back to Home</Link>
      </Button>
    </section>
  );
}

function FlatQuizLibrary({ catalog }: { catalog: LearnerCatalog }) {
  if (catalog.quizzes.length === 0) {
    return <NoQuizzes />;
  }

  return <QuizCards catalog={catalog} quizzes={catalog.quizzes} />;
}

function NoQuizzes() {
  return (
    <section className="animate-widget rounded-lg border border-white/70 bg-white/60 p-6 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
      <span className="bg-primary text-primary-foreground mx-auto grid size-11 place-items-center rounded-full">
        <BookOpenCheckIcon className="size-5" />
      </span>
      <h2 className="mt-5 text-xl font-semibold tracking-tight">No quizzes available yet</h2>
      <p className="text-muted-foreground mt-3 text-sm leading-6">
        New knowledge checks will appear here when they are ready for learners.
      </p>
    </section>
  );
}

function QuizCards({ catalog, quizzes }: { catalog: LearnerCatalog; quizzes: LearnerCatalog["quizzes"] }) {
  if (quizzes.length === 0) {
    return <NoQuizzes />;
  }

  return (
    <div className="grid gap-3">
      {quizzes.map((quiz) => {
        const course = catalog.courseById.get(quiz.courseId);

        return (
          <article
            key={quiz.id}
            className="animate-widget flex min-h-56 flex-col rounded-lg border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60"
          >
            <span className="bg-primary text-primary-foreground grid size-11 place-items-center rounded-full">
              <BookOpenCheckIcon className="size-5" />
            </span>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge variant="secondary">{quiz.difficulty}</Badge>
              <Badge variant="outline">{quiz.estimatedTime}</Badge>
              <Badge variant="outline">
                {quiz.questions.length} {quiz.questions.length === 1 ? "question" : "questions"}
              </Badge>
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight">{quiz.title}</h3>
            <p className="text-muted-foreground mt-3 flex-1 text-sm leading-6">
              {course ? `${course.subject} practice from ${course.title}.` : "Practice with an available knowledge check."}
            </p>
            <Button className="mt-6 min-h-12 w-full" asChild>
              <Link href={`/quiz/${quiz.id}?from=mobile`}>
                Start quiz
                <ArrowRightIcon />
              </Link>
            </Button>
          </article>
        );
      })}
    </div>
  );
}
