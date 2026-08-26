"use client";

import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { Button } from "@/components/ui/button";
import { COURSE_SELECTION_CHANGE_EVENT, loadCourseSelection } from "@/lib/course-selection";
import { useLearnerCatalog } from "@/lib/learner-catalog-client";
import { BookOpenIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

type MobileSelectedCourseGuardProps = {
  courseId: string;
  children: ReactNode;
};

export function MobileSelectedCourseGuard({ courseId, children }: MobileSelectedCourseGuardProps) {
  const catalog = useLearnerCatalog();
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[] | null>(null);

  useEffect(() => {
    function syncSelection() {
      setSelectedCourseIds(loadCourseSelection().selectedCourseIds);
    }

    syncSelection();
    window.addEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSelection);
    window.addEventListener("storage", syncSelection);
    window.addEventListener("pageshow", syncSelection);

    return () => {
      window.removeEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSelection);
      window.removeEventListener("storage", syncSelection);
      window.removeEventListener("pageshow", syncSelection);
    };
  }, []);

  const availableCourseIds = useMemo(() => new Set(catalog.courses.map((course) => course.id)), [catalog.courses]);

  if (catalog.isLoading || selectedCourseIds === null) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <AppLoadingSpinner label="Checking your courses" showLabel />
      </div>
    );
  }

  const hasSelectedCourses = selectedCourseIds.length > 0;
  const courseSelected = selectedCourseIds.includes(courseId);
  const courseAvailable = availableCourseIds.has(courseId);

  if (!hasSelectedCourses || !courseSelected || !courseAvailable) {
    return (
      <section className="grid min-h-[55dvh] place-items-center text-center">
        <div>
          <BookOpenIcon className="mx-auto size-8" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            {hasSelectedCourses ? "Course unavailable" : "Choose courses first"}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            {hasSelectedCourses
              ? "This course is not part of your current Profile selection or is no longer published."
              : "Choose your published courses in Profile before opening course study content."}
          </p>
          <Button asChild className="mt-5">
            <Link href="/mobile-profile#course-selection">Choose courses in Profile</Link>
          </Button>
        </div>
      </section>
    );
  }

  return children;
}
