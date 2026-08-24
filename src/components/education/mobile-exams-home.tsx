"use client";

import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { Badge } from "@/components/ui/badge";
import { COURSE_SELECTION_CHANGE_EVENT, loadCourseSelection } from "@/lib/course-selection";
import { convexApi } from "@/lib/convex-api";
import { convexEnv } from "@/lib/education-data";
import { useLearnerCatalog } from "@/lib/learner-catalog-client";
import { useQuery } from "convex/react";
import { ArrowRightIcon, FileTextIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PastPaperCourseSummary = {
  courseStableId: string;
  paperCount: number;
};

export function MobileExamsHome() {
  const catalog = useLearnerCatalog();
  const summaries = convexEnv.isConfigured
    ? (useQuery(convexApi.pastPapers.listPastPaperCourseSummaries, {}) as PastPaperCourseSummary[] | undefined)
    : [];
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const syncSelection = () => {
      setSelectedCourseIds(loadCourseSelection().selectedCourseIds);
      setHydrated(true);
    };
    syncSelection();
    window.addEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSelection);
    window.addEventListener("storage", syncSelection);
    return () => {
      window.removeEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSelection);
      window.removeEventListener("storage", syncSelection);
    };
  }, []);

  const available = useMemo(() => {
    if (!summaries) return [];
    const paperCountByCourse = new Map(summaries.map((item) => [item.courseStableId, item.paperCount]));
    return catalog.courses
      .filter((course) => selectedCourseIds.includes(course.id) && (paperCountByCourse.get(course.id) ?? 0) > 0)
      .map((course) => ({ course, paperCount: paperCountByCourse.get(course.id) ?? 0 }));
  }, [catalog.courses, selectedCourseIds, summaries]);

  if (!hydrated || catalog.isLoading || summaries === undefined) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <AppLoadingSpinner label="Loading exams" showLabel />
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <Badge variant="secondary">Exams</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Long-form exam practice</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Choose one of your courses, then work through its published structured papers question by question.
        </p>
      </div>

      {available.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-background/70 p-6 text-center">
          <FileTextIcon className="mx-auto size-7" />
          <h2 className="mt-4 text-xl font-semibold">No exams for your selected courses yet</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Only real published exam content appears here. No mock papers are inserted to fill empty courses.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {available.map(({ course, paperCount }) => (
            <Link
              key={course.id}
              href={`/mobile-past-papers?course=${encodeURIComponent(course.id)}`}
              className="flex min-h-24 items-center gap-4 rounded-2xl border border-border/70 bg-background/70 p-4 transition hover:bg-secondary/50"
            >
              <span className="bg-primary text-primary-foreground grid size-10 shrink-0 place-items-center rounded-full">
                <FileTextIcon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{course.title}</span>
                <span className="text-muted-foreground mt-1 block text-sm">{course.subject}</span>
                <span className="text-muted-foreground mt-2 block text-xs">
                  {paperCount} {paperCount === 1 ? "exam paper" : "exam papers"}
                </span>
              </span>
              <ArrowRightIcon className="size-5" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
