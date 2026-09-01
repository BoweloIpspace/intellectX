"use client";

import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getMat111FeynmanPages,
  type Mat111FeynmanPage,
} from "@/data/mat111-feynman-pages";
import { COURSE_SELECTION_CHANGE_EVENT, loadCourseSelection } from "@/lib/course-selection";
import { useLearnerCatalog } from "@/lib/learner-catalog-client";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  GalleryVerticalEndIcon,
  LightbulbIcon,
  MessageCircleQuestionIcon,
  SparklesIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type InfographyCard = {
  id: string;
  courseId: string;
  courseTitle: string;
  subject: string;
  title: string;
  summary: string;
  posterUrl?: string;
  keyIdeas: string[];
  quizIds: string[];
  pages: Mat111FeynmanPage[];
};

type FocusedInfographySlide = {
  card: InfographyCard;
  page: Mat111FeynmanPage;
  pageIndex: number;
  topicIndex: number;
};

function getTopicPracticeHref(card: InfographyCard) {
  if (card.quizIds.length === 1) {
    return `/quiz/${card.quizIds[0]}?from=mobile&course=${encodeURIComponent(card.courseId)}&topic=${encodeURIComponent(card.id)}`;
  }

  if (card.quizIds.length > 1) {
    return `/mobile-quizzes?course=${encodeURIComponent(card.courseId)}&topic=${encodeURIComponent(card.id)}`;
  }

  return null;
}

function getTopicPracticeLabel(card: InfographyCard) {
  if (card.quizIds.length === 1) return "Start topic quiz";
  if (card.quizIds.length > 1) return `Choose ${card.quizIds.length} topic quizzes`;
  return null;
}

function getInfographyPages(title: string, summary: string, keyIdeas: string[], lessonId: string) {
  const mat111Pages = getMat111FeynmanPages(lessonId);
  if (mat111Pages.length > 0) return mat111Pages;

  const fallbackIdeas = keyIdeas.length > 0 ? keyIdeas : [summary];
  return fallbackIdeas.map((idea, index) => ({
    title: `${index + 1}. ${index === 0 ? "The big idea" : "Build the idea"}`,
    simpleExplanation: idea,
    workedExample: index === 0 ? summary : `Connect this idea back to ${title} and identify one example from your course material.`,
    teachBack: `Explain this part of ${title} in your own words without looking back at the infographic.`,
  }));
}

export function buildFocusedInfographySlides(cards: InfographyCard[], courseId: string): FocusedInfographySlide[] {
  return cards
    .filter((card) => card.courseId === courseId)
    .flatMap((card, topicIndex) =>
      card.pages.map((page, pageIndex) => ({
        card,
        page,
        pageIndex,
        topicIndex,
      })),
    );
}

export function MobileInfographies() {
  const catalog = useLearnerCatalog();
  const searchParams = useSearchParams();
  const requestedCourseId = searchParams.get("course");
  const requestedTopicId = searchParams.get("topic");
  const focusedRequest = requestedCourseId !== null || requestedTopicId !== null;
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
    window.addEventListener("pageshow", syncSelection);
    return () => {
      window.removeEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSelection);
      window.removeEventListener("storage", syncSelection);
      window.removeEventListener("pageshow", syncSelection);
    };
  }, []);

  const cards = useMemo<InfographyCard[]>(() => {
    if (!hydrated || catalog.isLoading) return [];

    return catalog.lessons
      .filter((lesson) => selectedCourseIds.includes(lesson.courseId))
      .map((lesson) => {
        const course = catalog.courseById.get(lesson.courseId);
        const keyIdeas = lesson.content.map((item) => item.trim()).filter(Boolean).slice(0, 4);
        const quizIds = catalog.quizzes
          .filter((quiz) => quiz.courseId === lesson.courseId && quiz.lessonId === lesson.id)
          .map((quiz) => quiz.id);

        return {
          id: lesson.id,
          courseId: lesson.courseId,
          courseTitle: course?.title ?? lesson.courseId,
          subject: course?.subject ?? "Study",
          title: lesson.title,
          summary: lesson.summary,
          posterUrl: lesson.posterUrl,
          keyIdeas,
          quizIds,
          pages: getInfographyPages(lesson.title, lesson.summary, keyIdeas, lesson.id),
        };
      });
  }, [catalog.courseById, catalog.isLoading, catalog.lessons, catalog.quizzes, hydrated, selectedCourseIds]);

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

  if (focusedRequest) {
    const focusedCard =
      requestedCourseId && requestedTopicId
        ? cards.find((card) => card.courseId === requestedCourseId && card.id === requestedTopicId) ?? null
        : null;

    if (!focusedCard) {
      const returnHref = requestedCourseId
        ? `/mobile-study/${encodeURIComponent(requestedCourseId)}`
        : "/mobile-study";

      return (
        <section className="rounded-2xl border border-border/70 bg-background/70 p-6 text-center">
          <GalleryVerticalEndIcon className="mx-auto size-6" />
          <h1 className="mt-4 text-xl font-semibold tracking-tight">Topic infographic unavailable</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            This topic is not available inside one of your selected courses.
          </p>
          <Button asChild className="mt-5 w-full">
            <Link href={returnHref}>Back to course</Link>
          </Button>
        </section>
      );
    }

    return <FocusedInfography card={focusedCard} cards={cards} />;
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
      {cards.map((card, index) => {
        const practiceHref = getTopicPracticeHref(card);
        const practiceLabel = getTopicPracticeLabel(card);

        return (
          <article
            key={card.id}
            className="flex min-h-full snap-start snap-always flex-col justify-between overflow-hidden rounded-3xl border border-border/70 bg-background/80 p-6 shadow-sm"
          >
            <InfographyContent card={card} counter={`${index + 1}/${cards.length}`} />

            <div className="mt-5 flex items-end justify-between gap-4 border-t border-border/60 pt-4">
              {practiceHref && practiceLabel ? (
                <Button asChild variant="ghost" size="sm" className="-ml-3">
                  <Link href={practiceHref}>
                    <BookOpenIcon className="size-4" />
                    {practiceLabel}
                  </Link>
                </Button>
              ) : (
                <span className="text-muted-foreground text-xs">No topic quiz published yet</span>
              )}
              {index < cards.length - 1 ? (
                <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                  Swipe
                  <ChevronDownIcon className="size-4" />
                </span>
              ) : null}
            </div>
          </article>
        );
      })}
    </section>
  );
}

function FocusedInfography({ card, cards }: { card: InfographyCard; cards: InfographyCard[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const courseCards = useMemo(() => cards.filter((candidate) => candidate.courseId === card.courseId), [card.courseId, cards]);
  const slides = useMemo(() => buildFocusedInfographySlides(courseCards, card.courseId), [card.courseId, courseCards]);
  const initialSlideIndex = Math.max(
    0,
    slides.findIndex((slide) => slide.card.id === card.id && slide.pageIndex === 0),
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const scroller = scrollerRef.current;
      if (!scroller || scroller.clientWidth <= 0) return;
      scroller.scrollLeft = initialSlideIndex * scroller.clientWidth;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [initialSlideIndex]);

  return (
    <section className="space-y-3" aria-label="Topic infographic">
      <div className="flex items-center justify-between gap-3">
        <Button asChild size="sm" variant="ghost" className="-ml-2">
          <Link href={`/mobile-study/${encodeURIComponent(card.courseId)}`}>
            <ArrowLeftIcon className="size-4" />
            Course topics
          </Link>
        </Button>
        <span className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.12em]">Swipe pages sideways</span>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-3xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label={`${card.courseTitle} infographic pages`}
      >
        {slides.map((slide, slideIndex) => {
          const pageCount = slide.card.pages.length;
          const lastPageOfTopic = slide.pageIndex === pageCount - 1;
          const nextSlide = slides[slideIndex + 1] ?? null;
          const nextTopic = lastPageOfTopic && nextSlide?.card.id !== slide.card.id ? nextSlide.card : null;
          const practiceHref = getTopicPracticeHref(slide.card);
          const practiceLabel = getTopicPracticeLabel(slide.card);

          return (
            <article
              key={`${slide.card.id}-page-${slide.pageIndex + 1}`}
              className="w-full shrink-0 snap-start snap-always overflow-hidden rounded-3xl border border-border/70 bg-background/85 p-5 shadow-sm sm:p-6"
              aria-label={`${slide.card.title}, page ${slide.pageIndex + 1} of ${pageCount}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{slide.card.subject}</Badge>
                    <Badge variant="outline" className="gap-1">
                      <SparklesIcon className="size-3" />
                      Feynman method
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-3 text-[11px] font-medium uppercase tracking-[0.13em]">
                    Topic {slide.topicIndex + 1}/{courseCards.length} · Page {slide.pageIndex + 1}/{pageCount}
                  </p>
                </div>
                <span className="text-muted-foreground text-xs tabular-nums">{slide.pageIndex + 1}/{pageCount}</span>
              </div>

              <p className="text-muted-foreground mt-5 text-xs font-medium uppercase tracking-[0.12em]">{slide.card.title}</p>
              <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.035em]">{slide.page.title}</h1>

              {slide.pageIndex === 0 && slide.card.posterUrl ? (
                <div className="mt-5 overflow-hidden rounded-2xl border border-border/70 bg-white p-2 dark:bg-white">
                  <Image
                    src={slide.card.posterUrl}
                    alt={`${slide.card.title} study diagram`}
                    width={800}
                    height={420}
                    unoptimized
                    className="h-auto max-h-40 w-full object-contain grayscale contrast-125"
                  />
                </div>
              ) : null}

              <div className="mt-5 space-y-4">
                <section className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <LightbulbIcon className="size-4" />
                    Say it simply
                  </div>
                  <p className="mt-2 text-sm leading-6">{slide.page.simpleExplanation}</p>
                </section>

                <section className="rounded-2xl border border-border/70 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <BookOpenIcon className="size-4" />
                    Work it through
                  </div>
                  <p className="mt-2 text-sm leading-6">{slide.page.workedExample}</p>
                </section>

                <section className="rounded-2xl border border-border/70 bg-foreground/[0.035] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <MessageCircleQuestionIcon className="size-4" />
                    Teach it back
                  </div>
                  <p className="mt-2 text-sm leading-6">{slide.page.teachBack}</p>
                </section>
              </div>

              <div className="mt-5 border-t border-border/60 pt-4">
                {lastPageOfTopic && practiceHref && practiceLabel ? (
                  <Button asChild className="min-h-12 w-full">
                    <Link href={practiceHref}>
                      {practiceLabel}
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  </Button>
                ) : null}

                <div className="text-muted-foreground mt-3 flex items-center justify-end gap-1 text-xs">
                  {lastPageOfTopic ? (
                    nextTopic ? (
                      <>
                        Swipe for next topic: {nextTopic.title}
                        <ChevronRightIcon className="size-4 shrink-0" />
                      </>
                    ) : (
                      <span>Final MAT111 topic page</span>
                    )
                  ) : (
                    <>
                      Swipe to page {slide.pageIndex + 2}
                      <ChevronRightIcon className="size-4" />
                    </>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function InfographyContent({ card, counter }: { card: InfographyCard; counter?: string }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge variant="secondary">{card.subject}</Badge>
          <p className="text-muted-foreground mt-3 text-xs font-medium uppercase tracking-[0.14em]">{card.courseTitle}</p>
        </div>
        {counter ? <span className="text-muted-foreground text-xs tabular-nums">{counter}</span> : null}
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
  );
}
