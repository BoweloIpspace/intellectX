"use client";

import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COURSE_SELECTION_CHANGE_EVENT, loadCourseSelection } from "@/lib/course-selection";
import { useLearnerCatalog } from "@/lib/learner-catalog-client";
import { BookOpenIcon, ChevronDownIcon, GalleryVerticalEndIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export function MobileInfographies() {
  const catalog = useLearnerCatalog();
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

  const cards = useMemo(() => {
    if (!hydrated || catalog.isLoading) return [];

    return catalog.lessons
      .filter((lesson) => selectedCourseIds.includes(lesson.courseId))
      .map((lesson) => {
        const course = catalog.courseById.get(lesson.courseId);
        const keyIdeas = lesson.content.map((item) => item.trim()).filter(Boolean).slice(0, 4);

        return {
          id: lesson.id,
          courseId: lesson.courseId,
          courseTitle: course?.title ?? lesson.courseId,
          subject: course?.subject ?? "Study",
          title: lesson.title,
          summary: lesson.summary,
          posterUrl: lesson.posterUrl,
          keyIdeas,
        };
      });
  }, [catalog, hydrated, selectedCourseIds]);

  if (!hydrated || catalog.isLoading) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <AppLoadingSpinner label="Loading infographies" showLabel />
      </div>
    );
  }

  if (selectedCourseIds.length === 0) {
    return (
      <section className="grid min-h-[60dvh] place-items-center text-center">
        <div>
          <GalleryVerticalEndIcon className="mx-auto size-8" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Choose courses first</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Infographies are built from the published topics in the courses you keep on Home.
          </p>
          <Button asChild className="mt-5">
            <Link href="/mobile-profile#course-selection">Choose courses in Profile</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (cards.length === 0) {
    return (
      <section className="grid min-h-[60dvh] place-items-center text-center">
        <div>
          <GalleryVerticalEndIcon className="mx-auto size-8" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">No infographies published yet</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            This feed only uses real published course and topic content; it does not fill gaps with mock study facts.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Infography feed"
      className="h-[calc(100dvh-10.25rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] snap-y snap-mandatory overflow-y-auto overscroll-y-contain rounded-3xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {cards.map((card, index) => (
        <article
          key={card.id}
          className="flex min-h-full snap-start snap-always flex-col justify-between overflow-hidden rounded-3xl border border-border/70 bg-background/80 p-6 shadow-sm"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge variant="secondary">{card.subject}</Badge>
                <p className="text-muted-foreground mt-3 text-xs font-medium uppercase tracking-[0.14em]">
                  {card.courseTitle}
                </p>
              </div>
              <span className="text-muted-foreground text-xs tabular-nums">
                {index + 1}/{cards.length}
              </span>
            </div>

            <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.045em]">{card.title}</h1>
            <p className="text-muted-foreground mt-3 text-sm leading-6">{card.summary}</p>

            {card.posterUrl ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-border/70 bg-white p-2 dark:bg-white">
                <Image
                  src={card.posterUrl}
                  alt={`${card.title} study diagram`}
                  width={800}
                  height={420}
                  unoptimized
                  className="h-auto max-h-44 w-full object-contain grayscale contrast-125"
                />
              </div>
            ) : null}

            {card.keyIdeas.length > 0 ? (
              <div className="mt-5 space-y-3">
                {card.keyIdeas.map((idea, ideaIndex) => (
                  <div key={`${card.id}-${ideaIndex}`} className="flex gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-foreground text-[11px] font-semibold text-background">
                      {ideaIndex + 1}
                    </span>
                    <p className="line-clamp-3 pt-0.5 text-xs leading-5 sm:text-sm sm:leading-6">{idea}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-5 flex items-end justify-between gap-4 border-t border-border/60 pt-4">
            <Button asChild variant="ghost" size="sm" className="-ml-3">
              <Link href={`/mobile-quizzes?course=${encodeURIComponent(card.courseId)}&topic=${encodeURIComponent(card.id)}`}>
                <BookOpenIcon className="size-4" />
                Open topic quizzes
              </Link>
            </Button>
            {index < cards.length - 1 ? (
              <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                Swipe
                <ChevronDownIcon className="size-4" />
              </span>
            ) : null}
          </div>
        </article>
      ))}
    </section>
  );
}
