"use client";

import { useLearnerAuthRuntime } from "@/components/providers/learner-auth-runtime-provider";
import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isClerkAuthEnabled } from "@/lib/auth-mode";
import { loadCourseSelection } from "@/lib/course-selection";
import { isMobileAppRuntime } from "@/lib/feature-scope";
import { useLearnerCatalog } from "@/lib/learner-catalog-client";
import { getLearnerSession } from "@/lib/learner-session";
import {
  ArrowRightIcon,
  BookOpenIcon,
  BookOpenTextIcon,
  Layers3Icon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function MobileStudyHome() {
  const router = useRouter();
  const auth = useLearnerAuthRuntime();
  const catalog = useLearnerCatalog();
  const [nativeAppSurface, setNativeAppSurface] = useState<boolean | null>(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[] | null>(null);

  useEffect(() => {
    const native = isMobileAppRuntime();
    setNativeAppSurface(native);

    if (!native) {
      return;
    }

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

    const selection = loadCourseSelection();
    if (selection.selectedCourseIds.length === 0) {
      router.replace("/mobile-quizzes?setup=1");
      return;
    }

    setSelectedCourseIds(selection.selectedCourseIds);
  }, [auth.isLoaded, auth.isSignedIn, router]);

  const selectedCourses = useMemo(() => {
    if (!selectedCourseIds) return [];
    return catalog.courses.filter((course) => selectedCourseIds.includes(course.id));
  }, [catalog.courses, selectedCourseIds]);

  if (nativeAppSurface === false) {
    return <WebMobileStudyPreview />;
  }

  if (nativeAppSurface === null || catalog.isLoading || selectedCourseIds === null) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <AppLoadingSpinner label="Loading your courses" showLabel />
      </div>
    );
  }

  if (selectedCourses.length === 0) {
    return (
      <section className="rounded-lg border border-white/70 bg-white/60 p-6 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
        <BookOpenIcon className="mx-auto size-6" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Choose your courses</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Pick the courses you want on your mobile Home screen before starting quizzes.
        </p>
        <Button asChild className="mt-5 w-full">
          <Link href="/mobile-quizzes?setup=1">Choose courses</Link>
        </Button>
      </section>
    );
  }

  return (
    <>
      <section className="mb-6 flex flex-col items-start gap-4">
        <Badge variant="secondary" className="uppercase">
          My courses
        </Badge>
        <h1 className="text-3xl leading-[1.08] font-medium tracking-tight">Your courses</h1>
        <p className="text-muted-foreground text-base leading-7">
          Open a course, choose a topic, then pick a quiz for that topic.
        </p>
      </section>

      <section className="grid gap-3">
        {selectedCourses.map((course) => {
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

        <Button asChild variant="outline" className="mt-1 min-h-11 w-full">
          <Link href="/mobile-quizzes?setup=1">Change courses</Link>
        </Button>
      </section>
    </>
  );
}

function WebMobileStudyPreview() {
  const studyItems = [
    {
      title: "Quizzes",
      description: "Test recall with focused knowledge checks and clear explanations after each answer.",
      href: "/mobile-quizzes",
      cta: "Open quizzes",
      icon: BookOpenTextIcon,
    },
    {
      title: "Flashcards",
      description: "Review key lesson concepts with quick tap-to-reveal cards built for focused repetition.",
      href: "/mobile-flashcards",
      cta: "Open flashcards",
      icon: Layers3Icon,
    },
  ];

  return (
    <>
      <section className="mb-6 flex flex-col items-start gap-4">
        <Badge variant="secondary" className="uppercase">
          Mobile study
        </Badge>
        <h1 className="text-3xl leading-[1.08] font-medium tracking-tight">Free mobile study tools</h1>
        <p className="text-muted-foreground text-base leading-7">
          Browser preview tools for quizzes and flashcards. The native IntellectX app itself is quiz-only.
        </p>
      </section>

      <section className="grid gap-3">
        {studyItems.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.href}
              className="animate-widget flex min-h-56 flex-col rounded-lg border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60"
            >
              <span className="bg-primary text-primary-foreground grid size-11 place-items-center rounded-full">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-5 text-xl font-semibold tracking-tight">{item.title}</h2>
              <p className="text-muted-foreground mt-3 flex-1 text-sm leading-6">{item.description}</p>
              <Button className="mt-6 min-h-12 w-full" asChild>
                <Link href={item.href}>{item.cta}</Link>
              </Button>
            </article>
          );
        })}
      </section>
    </>
  );
}
