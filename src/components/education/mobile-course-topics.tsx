"use client";

import { useLearnerAuthRuntime } from "@/components/providers/learner-auth-runtime-provider";
import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { Button } from "@/components/ui/button";
import { MobileEmptyState, MobileListRow, MobilePageHeader, MobilePageStack } from "@/components/ui/mobile-app-primitives";
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
      <MobileEmptyState
        icon={GalleryVerticalEndIcon}
        title="Course unavailable"
        description="Only courses selected in Profile can be opened from Home."
        action={<Button asChild><Link href="/mobile-study">Back to Home</Link></Button>}
      />
    );
  }

  return (
    <MobilePageStack>
      <Button asChild size="sm" variant="ghost" className="-ml-2">
        <Link href="/mobile-study">
          <ArrowLeftIcon className="size-4" />
          Home
        </Link>
      </Button>

      <MobilePageHeader
        eyebrow={course.subject}
        title={course.title}
        description="Choose a topic to study its infographic before starting the topic quiz."
      />

      {topics.length === 0 ? (
        <MobileEmptyState
          icon={GalleryVerticalEndIcon}
          title="No study topics published yet"
          description="This course does not have a published topic infographic and quiz pair yet."
        />
      ) : (
        <div className="grid gap-3">
          {topics.map((topic) => {
            const quizCount = catalog.quizzes.filter(
              (quiz) => quiz.courseId === courseId && quiz.lessonId === topic.id,
            ).length;

            return (
              <MobileListRow
                key={topic.id}
                href={`/mobile-infographies?course=${encodeURIComponent(courseId)}&topic=${encodeURIComponent(topic.id)}`}
                icon={GalleryVerticalEndIcon}
                title={topic.title}
                meta={`Infographic · ${quizCount} ${quizCount === 1 ? "quiz" : "quizzes"} · ${topic.duration}`}
                trailing={<ArrowRightIcon className="size-5" />}
              />
            );
          })}
        </div>
      )}
    </MobilePageStack>
  );
}
