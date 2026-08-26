"use client";

import { MobileFlashcardReview } from "@/components/education/mobile-flashcard-review";
import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { Button } from "@/components/ui/button";
import { COURSE_SELECTION_CHANGE_EVENT, loadCourseSelection } from "@/lib/course-selection";
import { isMobileAppRuntime } from "@/lib/feature-scope";
import { buildFlashcardReviewCards } from "@/lib/flashcard-review";
import { useLearnerCatalog } from "@/lib/learner-catalog-client";
import { Layers3Icon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export function MobileFlashcardsSection() {
  const catalog = useLearnerCatalog();
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[] | null>(null);
  const [nativeAppSurface, setNativeAppSurface] = useState<boolean | null>(null);

  useEffect(() => {
    setNativeAppSurface(isMobileAppRuntime());

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

  const cards = useMemo(() => {
    if (!selectedCourseIds || nativeAppSurface === null) return [];

    const lessons =
      selectedCourseIds.length > 0
        ? catalog.lessons.filter((lesson) => selectedCourseIds.includes(lesson.courseId))
        : nativeAppSurface
          ? []
          : catalog.lessons;

    return buildFlashcardReviewCards(lessons);
  }, [catalog.lessons, nativeAppSurface, selectedCourseIds]);

  if (catalog.isLoading || selectedCourseIds === null || nativeAppSurface === null) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <AppLoadingSpinner label="Loading mobile flashcards" showLabel />
      </div>
    );
  }

  if (nativeAppSurface && selectedCourseIds.length === 0) {
    return (
      <section className="grid min-h-[55dvh] place-items-center text-center">
        <div>
          <Layers3Icon className="mx-auto size-8" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Choose courses first</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Flashcards only use published lessons from the courses you selected in Profile.
          </p>
          <Button asChild className="mt-5">
            <Link href="/mobile-profile#course-selection">Choose courses in Profile</Link>
          </Button>
        </div>
      </section>
    );
  }

  return <MobileFlashcardReview cards={cards} />;
}
