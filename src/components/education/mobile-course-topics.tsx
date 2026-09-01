"use client";

import { useLearnerAuthRuntime } from "@/components/providers/learner-auth-runtime-provider";
import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MAT111_COURSE_ID } from "@/data/mat111-course";
import { isClerkAuthEnabled } from "@/lib/auth-mode";
import { COURSE_SELECTION_CHANGE_EVENT, loadCourseSelection } from "@/lib/course-selection";
import { useLearnerCatalog } from "@/lib/learner-catalog-client";
import { getLearnerSession } from "@/lib/learner-session";
import { ArrowLeftIcon, ArrowRightIcon, GalleryVerticalEndIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function MobileCourseTopics({ courseId }: { courseId: string }) {
  const router = useRouter();
  const auth = useLearnerAuthRuntime();
  const catalog = useLearnerCatalog();
  const [accessReady, setAccessReady] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[] | null>(null);

  useEffect(() => {
    if (isClerkAuthEnabled()) {
      if (!auth.isLoaded) return;
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

    const syncSelection = () => setSelectedCourseIds(loadCourseSelection().selectedCourseIds);
    syncSelection();
    window.addEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSelection);
    window.addEventListener("storage", syncSelection);
    window.addEventListener("pageshow", syncSelection);
    return () => {
      window.removeEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSelection);
      window.removeEventListener("storage", syncSelection);
      window.removeEventListener("pageshow", syncSelection);
    };
  }, [accessReady]);

  useEffect(() => {
    if (!accessReady || selectedCourseIds === null) return;
    if (selectedCourseIds.length === 0) {
      router.replace("/mobile-profile#course-selection");
    }
  }, [accessReady, router, selectedCourseIds]);

  const course = catalog.courseById.get(courseId);
  const topics = useMemo(
    () =>
      catalog.lessons.filter(
        (lesson) =>
          lesson.courseId === courseId &&
          catalog.quizzes.some((quiz) => quiz.courseId === courseId && quiz.lessonId === lesson.id),
      ),
    [catalog.lessons, catalog.quizzes, courseId],
  );

  if (!accessReady || catalog.isLoading || selectedCourseIds === null || selectedCourseIds.length === 0) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <AppLoadingSpinner label="Loading course topics" showLabel />
      </div>
    );
  }

  if (!course || !selectedCourseIds.includes(courseId)) {
    return (
      <section className="rounded-2xl border border-border/70 bg-background/70 p-6 text-center">
        <GalleryVerticalEndIcon className="mx-auto size-6" />
        <h1 className="mt-4 text-xl font-semibold tracking-tight">Course unavailable</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Only courses selected in Profile can be opened from Home.
        </p>
        <Button asChild className="mt-5 w-full">
          <Link href="/mobile-study">Back to Home</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <Button asChild size="sm" variant="ghost" className="-ml-2">
        <Link href="/mobile-study">
          <ArrowLeftIcon className="size-4" />
          Home
        </Link>
      </Button>

      <div>
        <Badge variant="secondary">{course.subject}</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{course.title}</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Choose a topic to study its infographic before starting the topic quiz.
        </p>
      </div>

      {topics.length === 0 ? (
        <section className="rounded-2xl border border-border/70 bg-background/70 p-6 text-center">
          <GalleryVerticalEndIcon className="mx-auto size-6" />
          <h2 className="mt-4 text-xl font-semibold tracking-tight">No study topics published yet</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            This course does not have a published topic infographic and quiz pair yet.
          </p>
        </section>
      ) : (
        <div className="grid gap-3">
          {topics.map((topic) => {
            const catalogQuizCount = catalog.quizzes.filter(
              (quiz) => quiz.courseId === courseId && quiz.lessonId === topic.id,
            ).length;
            const quizCount = courseId === MAT111_COURSE_ID ? 7 : catalogQuizCount;

            return (
              <Link
                key={topic.id}
                href={`/mobile-infographies?course=${encodeURIComponent(courseId)}&topic=${encodeURIComponent(topic.id)}`}
                className="flex min-h-24 items-center gap-4 rounded-2xl border border-border/70 bg-background/70 p-4 transition hover:bg-secondary/50"
              >
                <span className="bg-secondary grid size-10 shrink-0 place-items-center rounded-full">
                  <GalleryVerticalEndIcon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{topic.title}</span>
                  <span className="text-muted-foreground mt-1 block text-xs">
                    {courseId === MAT111_COURSE_ID ? "10-page infographic" : "Infographic"} · {quizCount}{" "}
                    {quizCount === 1 ? "quiz" : "quizzes"} · {topic.duration}
                  </span>
                </span>
                <ArrowRightIcon className="size-5" />
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
