"use client";

import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  COURSE_SELECTION_CHANGE_EVENT,
  COURSE_SELECTION_LIMIT,
  type CourseSelection,
  loadCourseSelection,
  reconcileCourseSelectionWithCatalog,
  toggleSelectedCourse,
} from "@/lib/course-selection";
import { useLearnerCatalog } from "@/lib/learner-catalog-client";
import { BookOpenIcon, CheckIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type CourseSelectionCardProps = {
  onContinue?: (selection: CourseSelection) => void;
  continueLabel?: string;
  showContinue?: boolean;
};

export function CourseSelectionCard({
  onContinue,
  continueLabel = "Continue to Home",
  showContinue = false,
}: CourseSelectionCardProps) {
  const catalog = useLearnerCatalog();
  const [selection, setSelection] = useState<CourseSelection | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (catalog.isLoading) return;

    function syncSelection() {
      const current = loadCourseSelection();
      setSelection(reconcileCourseSelectionWithCatalog(current, catalog.courses.map((course) => course.id)));
    }

    syncSelection();
    window.addEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSelection);
    window.addEventListener("storage", syncSelection);

    return () => {
      window.removeEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSelection);
      window.removeEventListener("storage", syncSelection);
    };
  }, [catalog.courses, catalog.isLoading]);

  const selectedCourses = useMemo(() => {
    if (!selection) return [];
    return catalog.courses.filter((course) => selection.selectedCourseIds.includes(course.id));
  }, [catalog.courses, selection]);

  function toggleCourse(courseId: string) {
    if (!selection) return;
    const update = toggleSelectedCourse(courseId, selection);
    setSelection(update.selection);
    setError(update.error ?? null);
  }

  if (catalog.isLoading || !selection) {
    return (
      <Card id="course-selection" className="rounded-lg">
        <CardContent className="flex min-h-40 items-center justify-center py-6">
          <AppLoadingSpinner label="Loading available courses" showLabel />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="course-selection" className="rounded-lg border-white/70 bg-white/60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Badge variant="secondary">Choose courses</Badge>
            <h2 className="mt-3 leading-none font-semibold">Your courses</h2>
          </div>
          <span className="text-muted-foreground text-sm font-medium">
            {selectedCourses.length} / {COURSE_SELECTION_LIMIT}
          </span>
        </div>
        <p className="text-muted-foreground text-sm leading-6">
          Every published course appears here automatically. Pick the courses you study; only those courses will appear on Home and drive your mobile study filters.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {showContinue ? (
          <Button
            type="button"
            className="min-h-12 w-full"
            disabled={selectedCourses.length === 0}
            onClick={() => onContinue?.(selection)}
          >
            {continueLabel}
          </Button>
        ) : null}

        {catalog.courses.length === 0 ? (
          <div className="rounded-lg border border-dashed p-5 text-center">
            <BookOpenIcon className="mx-auto size-6" />
            <p className="mt-3 font-medium">No published courses yet</p>
            <p className="text-muted-foreground mt-1 text-sm">Courses will appear here after they are published to the learner catalog.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {catalog.courses.map((course) => {
              const selected = selection.selectedCourseIds.includes(course.id);
              const topicCount = catalog.lessons.filter((lesson) => lesson.courseId === course.id).length;
              const quizCount = catalog.quizzes.filter((quiz) => quiz.courseId === course.id).length;

              return (
                <button
                  key={course.id}
                  type="button"
                  aria-pressed={selected}
                  disabled={selection.locked}
                  onClick={() => toggleCourse(course.id)}
                  className="flex min-h-24 w-full items-start gap-4 rounded-lg border border-border/70 bg-background/70 p-4 text-left transition hover:bg-secondary/50 disabled:cursor-default disabled:opacity-60"
                >
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-full border ${
                      selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                    }`}
                  >
                    {selected ? <CheckIcon className="size-4" /> : <BookOpenIcon className="size-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{course.title}</span>
                    <span className="text-muted-foreground mt-1 block text-sm">{course.subject}</span>
                    <span className="text-muted-foreground mt-2 block text-xs">
                      {topicCount} {topicCount === 1 ? "topic" : "topics"} · {quizCount} {quizCount === 1 ? "quiz" : "quizzes"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {selection.locked ? (
          <p className="text-muted-foreground text-sm">Your saved course selection is locked under the existing course-selection policy.</p>
        ) : null}
        {error ? <p className="text-destructive text-sm" role="alert">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
