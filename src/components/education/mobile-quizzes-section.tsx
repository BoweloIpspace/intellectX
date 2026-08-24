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
import { convexApi } from "@/lib/convex-api";
import { convexEnv } from "@/lib/education-data";
import { isMobileAppRuntime } from "@/lib/feature-scope";
import { buildLearnerCatalog, type LearnerCatalog, useLearnerCatalog } from "@/lib/learner-catalog-client";
import { getLearnerSession } from "@/lib/learner-session";
import { useQuery } from "convex/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenCheckIcon,
  BookOpenIcon,
  CheckIcon,
  FileTextIcon,
  ListChecksIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type PastPaperCourseSummary = {
  courseStableId: string;
  paperCount: number;
};

function getCourseQuizCount(catalog: LearnerCatalog, courseId: string) {
  return catalog.quizzes.filter((quiz) => quiz.courseId === courseId).length;
}

function getCourseTopicCount(catalog: LearnerCatalog, courseId: string) {
  return catalog.lessons.filter(
    (lesson) =>
      lesson.courseId === courseId &&
      catalog.quizzes.some((quiz) => quiz.courseId === courseId && quiz.lessonId === lesson.id),
  ).length;
}

function getCoursePaperCount(summaries: PastPaperCourseSummary[], courseId: string) {
  return summaries.find((summary) => summary.courseStableId === courseId)?.paperCount ?? 0;
}

function formatCourseContentSummary(quizCount: number, paperCount: number) {
  return [
    quizCount > 0 ? `${quizCount} ${quizCount === 1 ? "quiz" : "quizzes"}` : null,
    paperCount > 0 ? `${paperCount} past ${paperCount === 1 ? "paper" : "papers"}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function MobileQuizzesSection() {
  if (!convexEnv.isConfigured) {
    return <MobileQuizzesContent catalog={buildLearnerCatalog()} pastPaperSummaries={[]} />;
  }

  return <ConvexMobileQuizzesSection />;
}

function ConvexMobileQuizzesSection() {
  const catalog = useLearnerCatalog();
  const pastPaperSummaries = useQuery(convexApi.pastPapers.listPastPaperCourseSummaries, {}) as
    | PastPaperCourseSummary[]
    | undefined;

  return (
    <MobileQuizzesContent
      catalog={catalog}
      pastPaperSummaries={pastPaperSummaries ?? []}
      pastPapersLoading={pastPaperSummaries === undefined}
    />
  );
}

function MobileQuizzesContent({
  catalog,
  pastPaperSummaries,
  pastPapersLoading = false,
}: {
  catalog: LearnerCatalog;
  pastPaperSummaries: PastPaperCourseSummary[];
  pastPapersLoading?: boolean;
}) {
  const [nativeAppSurface, setNativeAppSurface] = useState<boolean | null>(null);

  useEffect(() => {
    setNativeAppSurface(isMobileAppRuntime());
  }, []);

  if (catalog.isLoading || pastPapersLoading || nativeAppSurface === null) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <AppLoadingSpinner label="Loading mobile study catalog" showLabel />
      </div>
    );
  }

  if (!nativeAppSurface) {
    return <FlatQuizLibrary catalog={catalog} />;
  }

  return <NativeCourseTopicQuizFlow catalog={catalog} pastPaperSummaries={pastPaperSummaries} />;
}

function NativeCourseTopicQuizFlow({
  catalog,
  pastPaperSummaries,
}: {
  catalog: LearnerCatalog;
  pastPaperSummaries: PastPaperCourseSummary[];
}) {
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

  const availableCourses = useMemo(
    () =>
      catalog.courses.filter(
        (course) => getCourseQuizCount(catalog, course.id) > 0 || getCoursePaperCount(pastPaperSummaries, course.id) > 0,
      ),
    [catalog, pastPaperSummaries],
  );

  const selectableCourses = useMemo(() => {
    if (!profile) return availableCourses;
    const matchedCourses = availableCourses.filter((course) => courseMatchesAcademicProfile(course, profile));
    return matchedCourses.length > 0 ? matchedCourses : availableCourses;
  }, [profile, availableCourses]);

  if (!accessReady || !selection) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <AppLoadingSpinner label="Loading your courses" showLabel />
      </div>
    );
  }

  const selectedCourses = availableCourses.filter((course) => selection.selectedCourseIds.includes(course.id));
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
        pastPaperSummaries={pastPaperSummaries}
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

  if (requestedCourseId && !selectedCourse) {
    return (
      <SelectedCourseFallback
        title="Course is not available in your current selection"
        description="Return Home or change your selected courses to continue."
      />
    );
  }

  if (selectedCourse && requestedTopicId) {
    return <TopicQuizList catalog={catalog} courseId={selectedCourse.id} topicId={requestedTopicId} />;
  }

  if (selectedCourse) {
    return (
      <CourseTopicList
        catalog={catalog}
        courseId={selectedCourse.id}
        paperCount={getCoursePaperCount(pastPaperSummaries, selectedCourse.id)}
      />
    );
  }

  return (
    <SelectedCourseList
      catalog={catalog}
      courses={selectedCourses}
      selection={selection}
      pastPaperSummaries={pastPaperSummaries}
    />
  );
}

function CourseSelectionStep({
  courses,
  catalog,
  pastPaperSummaries,
  selection,
  error,
  onToggle,
  onContinue,
}: {
  courses: LearnerCatalog["courses"];
  catalog: LearnerCatalog;
  pastPaperSummaries: PastPaperCourseSummary[];
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
        <h2 className="mt-4 text-xl font-semibold tracking-tight">No study courses available yet</h2>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          No learner quizzes or past papers are currently published for your mobile catalog.
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
          const quizCount = getCourseQuizCount(catalog, course.id);
          const paperCount = getCoursePaperCount(pastPaperSummaries, course.id);
          const topicCount = getCourseTopicCount(catalog, course.id);

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
                  {formatCourseContentSummary(quizCount, paperCount)}
                  {topicCount > 0 ? ` · ${topicCount} ${topicCount === 1 ? "topic" : "topics"}` : ""}
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
  pastPaperSummaries,
}: {
  catalog: LearnerCatalog;
  courses: LearnerCatalog["courses"];
  selection: CourseSelection;
  pastPaperSummaries: PastPaperCourseSummary[];
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <Badge variant="secondary">My courses</Badge>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Choose a course</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">Tap a course to open its available study content.</p>
        </div>
        {!selection.locked ? (
          <Button asChild size="sm" variant="outline">
            <Link href="/mobile-quizzes?setup=1">Change</Link>
          </Button>
        ) : null}
      </div>

      <div className="grid gap-3">
        {courses.map((course) => {
          const quizCount = getCourseQuizCount(catalog, course.id);
          const paperCount = getCoursePaperCount(pastPaperSummaries, course.id);
          const topicCount = getCourseTopicCount(catalog, course.id);
          return (
            <Link
              key={course.id}
              href={`/mobile-quizzes?course=${encodeURIComponent(course.id)}`}
              className="animate-widget flex min-h-36 items-center gap-4 rounded-lg border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur transition hover:bg-white/80 dark:border-white/10 dark:bg-card/60"
            >
              <span className="bg-primary text-primary-foreground grid size-11 shrink-0 place-items-center rounded-full">
                {paperCount > 0 && quizCount === 0 ? <FileTextIcon className="size-5" /> : <BookOpenIcon className="size-5" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-semibold tracking-tight text-foreground">{course.title}</span>
                <span className="text-muted-foreground mt-1 block text-sm">{course.subject}</span>
                <span className="text-muted-foreground mt-2 block text-xs">
                  {formatCourseContentSummary(quizCount, paperCount)}
                  {topicCount > 0 ? ` · ${topicCount} ${topicCount === 1 ? "topic" : "topics"}` : ""}
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

function CourseTopicList({
  catalog,
  courseId,
  paperCount,
}: {
  catalog: LearnerCatalog;
  courseId: string;
  paperCount: number;
}) {
  const course = catalog.courseById.get(courseId);
  const topics = catalog.lessons.filter(
    (lesson) =>
      lesson.courseId === courseId &&
      catalog.quizzes.some((quiz) => quiz.courseId === courseId && quiz.lessonId === lesson.id),
  );
  const quizCount = getCourseQuizCount(catalog, courseId);
  const hasPastPapers = paperCount > 0;

  if (!course) {
    return <SelectedCourseFallback />;
  }

  if (topics.length === 0 && !hasPastPapers) {
    return <EmptyCourseContent courseTitle={course.title} />;
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
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          {hasPastPapers && topics.length > 0
            ? `Choose a quiz topic or open ${paperCount === 1 ? "the available past paper" : `${paperCount} past papers`}.`
            : hasPastPapers
              ? `Open ${paperCount === 1 ? "the past paper" : `${paperCount} past papers`} to practice published exam questions.`
              : `Choose a topic to open one of ${quizCount} ${quizCount === 1 ? "quiz" : "quizzes"}.`}
        </p>
      </div>

      <div className="grid gap-3">
        {hasPastPapers ? (
          <Link
            href={`/mobile-past-papers?course=${encodeURIComponent(courseId)}`}
            className="animate-widget flex min-h-28 items-center gap-4 rounded-lg border border-white/70 bg-white/60 p-4 shadow-sm backdrop-blur transition hover:bg-white/80 dark:border-white/10 dark:bg-card/60"
          >
            <span className="bg-primary text-primary-foreground grid size-10 shrink-0 place-items-center rounded-full">
              <FileTextIcon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-foreground">Past Papers</span>
              <span className="text-muted-foreground mt-1 block text-xs">
                {paperCount} {paperCount === 1 ? "paper" : "papers"} · reveal-answer revision
              </span>
            </span>
            <ArrowRightIcon className="size-5 shrink-0" />
          </Link>
        ) : null}

        {topics.map((topic) => {
          const topicQuizCount = catalog.quizzes.filter(
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
                  {topicQuizCount} {topicQuizCount === 1 ? "quiz" : "quizzes"}
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

  if (!course) {
    return <SelectedCourseFallback />;
  }

  if (!topic || topic.courseId !== courseId) {
    return (
      <SelectedCourseFallback
        title="Topic unavailable"
        description="This topic is not available in the selected course. Return to the course and choose another topic."
        backHref={`/mobile-quizzes?course=${encodeURIComponent(courseId)}`}
        backLabel="Back to course"
      />
    );
  }

  if (quizzes.length === 0) {
    return (
      <SelectedCourseFallback
        title="No quizzes published for this topic"
        description="Return to the course and choose another topic or study mode."
        backHref={`/mobile-quizzes?course=${encodeURIComponent(courseId)}`}
        backLabel="Back to course"
      />
    );
  }

  return (
    <section className="space-y-4">
      <Button asChild size="sm" variant="ghost" className="-ml-2">
        <Link href={`/mobile-quizzes?course=${encodeURIComponent(courseId)}`}>
          <ArrowLeftIcon className="size-4" />
          Course
        </Link>
      </Button>

      <div className="rounded-lg border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
        <Badge variant="secondary">Topic</Badge>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">{topic.title}</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-6">{topic.summary}</p>
      </div>

      <QuizCards catalog={catalog} quizzes={quizzes} mobileContext={{ courseId, topicId }} />
    </section>
  );
}

function EmptyCourseContent({ courseTitle }: { courseTitle: string }) {
  return (
    <section className="space-y-4">
      <Button asChild size="sm" variant="ghost" className="-ml-2">
        <Link href="/mobile-study">
          <ArrowLeftIcon className="size-4" />
          Home
        </Link>
      </Button>
      <div className="animate-widget rounded-lg border border-white/70 bg-white/60 p-6 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
        <BookOpenCheckIcon className="mx-auto size-6" />
        <h2 className="mt-4 text-xl font-semibold tracking-tight">No published study content</h2>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          {courseTitle} is selected, but it currently has no published quizzes or past papers. Nothing has been lost from your device.
        </p>
      </div>
    </section>
  );
}

function SelectedCourseFallback({
  title = "Course content unavailable",
  description = "Return Home and choose another course.",
  backHref = "/mobile-study",
  backLabel = "Back to Home",
}: {
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <section className="animate-widget rounded-lg border border-white/70 bg-white/60 p-6 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
      <BookOpenCheckIcon className="mx-auto size-6" />
      <h2 className="mt-4 text-xl font-semibold tracking-tight">{title}</h2>
      <p className="text-muted-foreground mt-3 text-sm leading-6">{description}</p>
      <Button asChild className="mt-5">
        <Link href={backHref}>{backLabel}</Link>
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

function QuizCards({
  catalog,
  quizzes,
  mobileContext,
}: {
  catalog: LearnerCatalog;
  quizzes: LearnerCatalog["quizzes"];
  mobileContext?: { courseId: string; topicId: string };
}) {
  if (quizzes.length === 0) {
    return <NoQuizzes />;
  }

  return (
    <div className="grid gap-3">
      {quizzes.map((quiz) => {
        const course = catalog.courseById.get(quiz.courseId);
        const mobileHref = mobileContext
          ? `/quiz/${quiz.id}?from=mobile&course=${encodeURIComponent(mobileContext.courseId)}&topic=${encodeURIComponent(mobileContext.topicId)}`
          : `/quiz/${quiz.id}?from=mobile`;

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
              <Link href={mobileHref}>
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
