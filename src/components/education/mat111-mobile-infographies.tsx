"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mat111Lessons } from "@/data/mat111-lessons";
import { getMat111InfographyPages } from "@/data/mat111-mobile-study";
import { ArrowLeftIcon, ArrowRightIcon, BookOpenCheckIcon, ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

type Mat111MobileInfographiesProps = {
  requestedTopicId?: string;
};

export function Mat111MobileInfographies({ requestedTopicId }: Mat111MobileInfographiesProps) {
  const topicRefs = useRef<Record<string, HTMLElement | null>>({});
  const topics = useMemo(
    () =>
      mat111Lessons.map((lesson) => ({
        lesson,
        pages: getMat111InfographyPages(lesson.id),
      })),
    [],
  );

  useEffect(() => {
    const targetId = requestedTopicId && topicRefs.current[requestedTopicId] ? requestedTopicId : topics[0]?.lesson.id;
    if (!targetId) return;
    window.requestAnimationFrame(() => {
      topicRefs.current[targetId]?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "start" });
    });
  }, [requestedTopicId, topics]);

  return (
    <section className="space-y-3">
      <header className="rounded-2xl border border-border/70 bg-background/80 p-4">
        <Badge variant="secondary">MAT111 lecture-note infographics</Badge>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">10-page topic guides</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Scroll down through the 10 pages inside a week. Swipe sideways to move to the next or previous lecture week.
        </p>
      </header>

      <div
        className="flex h-[calc(100dvh-13rem)] snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="MAT111 lecture weeks"
      >
        {topics.map(({ lesson, pages }, topicIndex) => (
          <article
            key={lesson.id}
            ref={(node) => {
              topicRefs.current[lesson.id] = node;
            }}
            className="h-full min-w-full shrink-0 snap-start snap-always overflow-y-auto overscroll-y-contain px-1 pb-8"
          >
            <div className="sticky top-0 z-10 mb-3 rounded-2xl border border-border/70 bg-background/95 p-4 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Badge variant="outline">Week {lesson.id.replace("mat111-week-", "")}</Badge>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight">{lesson.title}</h2>
                </div>
                <span className="text-muted-foreground shrink-0 text-xs font-medium">
                  {topicIndex + 1}/{topics.length}
                </span>
              </div>
              <p className="text-muted-foreground mt-2 text-xs leading-5">
                Vertical: 10 infographic pages · Horizontal: change week
              </p>
            </div>

            <div className="space-y-4">
              {pages.map((page, pageIndex) => (
                <section
                  key={`${lesson.id}-${pageIndex}`}
                  className="flex min-h-[58dvh] flex-col justify-between rounded-2xl border border-border/70 bg-background/75 p-5"
                  aria-label={`Page ${pageIndex + 1} of 10: ${page.title}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="secondary">Page {pageIndex + 1}/10</Badge>
                      <BookOpenCheckIcon className="text-muted-foreground size-5" />
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">{page.title}</h3>
                    <p className="text-muted-foreground mt-4 text-base leading-7">{page.body}</p>
                  </div>
                  <div className="text-muted-foreground mt-8 flex items-center justify-center gap-2 text-xs">
                    {pageIndex < pages.length - 1 ? (
                      <>
                        <ChevronDownIcon className="size-4" />
                        Scroll down for page {pageIndex + 2}
                      </>
                    ) : (
                      <>
                        <ArrowLeftIcon className="size-4" />
                        Swipe sideways for another week
                        <ArrowRightIcon className="size-4" />
                      </>
                    )}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button asChild className="min-h-12">
                <Link href={`/mobile-quizzes?course=${encodeURIComponent(lesson.courseId)}&topic=${encodeURIComponent(lesson.id)}`}>
                  7 quizzes
                </Link>
              </Button>
              <Button asChild variant="outline" className="min-h-12">
                <Link href={`/mobile-past-papers?course=${encodeURIComponent(lesson.courseId)}&topic=${encodeURIComponent(lesson.id)}`}>
                  5 exam sets
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
