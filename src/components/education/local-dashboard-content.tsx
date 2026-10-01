"use client";

import { CourseCard } from "@/components/education/course-card";
import { EmptyState } from "@/components/education/empty-state";
import { LocalQuizPerformance } from "@/components/education/local-quiz-performance";
import { RecentQuizAttempts } from "@/components/education/recent-quiz-attempts";
import { StatCard } from "@/components/education/stat-card";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppListRow, AppSurface } from "@/components/ui/app-page-primitives";
import type { Course } from "@/data/courses";
import {
  COURSE_SELECTION_CHANGE_EVENT,
  type CourseSelection,
  loadCourseSelection,
} from "@/lib/course-selection";
import {
  LESSON_PROGRESS_HISTORY_CHANGE_EVENT,
  readLessonProgressHistory,
  summarizeLessonProgressHistory,
  type LessonProgressHistorySummary,
} from "@/lib/lesson-progress-history";
import {
  QUIZ_ATTEMPT_HISTORY_CHANGE_EVENT,
  readQuizAttemptHistory,
  summarizeQuizAttemptHistory,
} from "@/lib/quiz-attempt-history";
import { useLearnerCatalog } from "@/lib/learner-catalog-client";
import {
  emptyStudyActivitySummary,
  formatStudyStreakValue,
  readStudyActivitySummary,
  type StudyActivitySummary,
} from "@/lib/study-activity-summary";
import {
  BookOpenCheckIcon,
  BookOpenIcon,
  CalendarCheckIcon,
  FlameIcon,
  Layers3Icon,
  TargetIcon,
  TrophyIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const emptyLessonProgressSummary: LessonProgressHistorySummary = {
  lessonCount: 0,
  inProgressCount: 0,
  completedCount: 0,
  latestLessons: [],
};

export function LocalDashboardContent() {
  const catalog = useLearnerCatalog();
  const [selection, setSelection] = useState<CourseSelection | null>(null);
  const [lessonSummary, setLessonSummary] = useState<LessonProgressHistorySummary>(emptyLessonProgressSummary);
  const [studyActivity, setStudyActivity] = useState<StudyActivitySummary>(emptyStudyActivitySummary);
  const [quizAttemptCount, setQuizAttemptCount] = useState(0);
  const [averageQuizScore, setAverageQuizScore] = useState<number | null>(null);

  useEffect(() => {
    function syncSelection() {
      setSelection(loadCourseSelection());
    }

    function syncLessons() {
      setLessonSummary(summarizeLessonProgressHistory(readLessonProgressHistory()));
    }

    function syncAttempts() {
      const summary = summarizeQuizAttemptHistory(readQuizAttemptHistory());
      setQuizAttemptCount(summary.attemptCount);
      setAverageQuizScore(summary.attemptCount > 0 ? summary.averagePercentage : null);
    }

    function syncActivity() {
      setStudyActivity(readStudyActivitySummary());
    }

    function syncAll() {
      syncSelection();
      syncLessons();
      syncAttempts();
      syncActivity();
    }

    function syncAllWhenVisible() {
      if (!document.hidden) {
        syncAll();
      }
    }

    syncAll();
    window.addEventListener(COURSE_SELECTION_CHANGE_EVENT, syncAll);
    window.addEventListener(LESSON_PROGRESS_HISTORY_CHANGE_EVENT, syncAll);
    window.addEventListener(QUIZ_ATTEMPT_HISTORY_CHANGE_EVENT, syncAll);
    window.addEventListener("storage", syncAll);
    window.addEventListener("focus", syncAll);
    window.addEventListener("pageshow", syncAll);
    document.addEventListener("visibilitychange", syncAllWhenVisible);

    return () => {
      window.removeEventListener(COURSE_SELECTION_CHANGE_EVENT, syncAll);
      window.removeEventListener(LESSON_PROGRESS_HISTORY_CHANGE_EVENT, syncAll);
      window.removeEventListener(QUIZ_ATTEMPT_HISTORY_CHANGE_EVENT, syncAll);
      window.removeEventListener("storage", syncAll);
      window.removeEventListener("focus", syncAll);
      window.removeEventListener("pageshow", syncAll);
      document.removeEventListener("visibilitychange", syncAllWhenVisible);
    };
  }, []);

  const selectedCourses = useMemo(() => {
    const selectedIds = selection?.selectedCourseIds ?? [];
    return selectedIds
      .map((courseId) => catalog.courseById.get(courseId))
      .filter((course): course is Course => Boolean(course));
  }, [catalog.courseById, selection]);

  const recentLessons = useMemo(
    () =>
      lessonSummary.latestLessons
        .map((item) => {
          const lesson = catalog.lessonById.get(item.lessonId);
          return lesson || item.lessonTitle
            ? { lesson, lessonTitle: lesson?.title ?? item.lessonTitle ?? item.lessonId, progress: item }
            : null;
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [catalog.lessonById, lessonSummary.latestLessons],
  );

  return (
    <>
      <section className="mb-8 grid gap-4 md:grid-cols-4">
        <StatCard label="Study streak" value={formatStudyStreakValue(studyActivity)} icon={FlameIcon} />
        <StatCard label="Last studied" value={studyActivity.lastStudiedLabel} icon={CalendarCheckIcon} />
        <StatCard
          label="Lessons viewed"
          value={lessonSummary.lessonCount === 0 ? "No lessons recorded" : `${lessonSummary.lessonCount}`}
          icon={BookOpenCheckIcon}
        />
        <StatCard
          label="Avg. quiz score"
          value={averageQuizScore === null ? "No attempts yet" : `${averageQuizScore}%`}
          icon={TrophyIcon}
        />
      </section>
      <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Selected courses</h2>
            <Link href="/courses" className="text-muted-foreground text-sm underline underline-offset-4">
              Manage
            </Link>
          </div>
          {selectedCourses.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {selectedCourses.map((course) => (
                <CourseCard key={course.id} course={course} showProgress={false} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No selected courses yet"
              description="Choose courses to make this dashboard reflect your current study plan."
              actionHref="/courses"
              actionLabel="Choose courses"
              icon={BookOpenIcon}
            />
          )}
        </div>
        <div className="grid gap-5">
          <AppSurface>
            <CardHeader>
              <CardTitle>Study shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <AppListRow
                href="/quizzes"
                aria-label="Open quizzes"
                icon={BookOpenCheckIcon}
                title="Quizzes"
                subtitle="Start your next knowledge check."
              />
              <AppListRow
                href="/flashcards"
                aria-label="Open flashcards"
                icon={Layers3Icon}
                title="Flashcards"
                subtitle="Review flashcard-style lesson cards."
              />
            </CardContent>
          </AppSurface>
          <AppSurface>
            <CardHeader>
              <CardTitle>Recent lessons</CardTitle>
            </CardHeader>
            <CardContent>
              {recentLessons.length > 0 ? (
                <div className="grid gap-3">
                  {recentLessons.map(({ lesson, lessonTitle, progress }) => (
                    <AppListRow
                      key={progress.lessonId}
                      href={`/learn/${lesson?.id ?? progress.lessonId}`}
                      title={lessonTitle}
                      subtitle={`${progress.progress}% ${progress.status.replace("_", " ")}`}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-secondary/40 rounded-lg p-4 text-sm text-muted-foreground">
                  Recent lessons will appear after lesson activity is recorded.
                </div>
              )}
            </CardContent>
          </AppSurface>
          <LocalQuizPerformance />
          <RecentQuizAttempts />
          <AppSurface>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TargetIcon className="size-5" />
                Next step
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4 text-sm leading-6">
              <p>
                {selectedCourses.length > 0
                  ? lessonSummary.lessonCount > 0 || quizAttemptCount > 0
                    ? "Review your recent activity or continue with a selected course."
                    : "Start with one quiz or lesson from your selected courses to build real activity here."
                  : "Choose courses first, then complete lessons or quizzes to build your dashboard."}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/courses">Courses</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/quizzes">Quizzes</Link>
                </Button>
              </div>
            </CardContent>
          </AppSurface>
        </div>
      </section>
    </>
  );
}
