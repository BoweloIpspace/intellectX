"use client";

import { useLearnerAuthRuntime } from "@/components/providers/learner-auth-runtime-provider";
import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { Badge } from "@/components/ui/badge";
import { MobileEmptyState, MobileListRow, MobilePageHeader, MobilePageStack, MobileSurface } from "@/components/ui/mobile-app-primitives";
import { Button } from "@/components/ui/button";
import { isClerkAuthEnabled } from "@/lib/auth-mode";
import { COURSE_SELECTION_CHANGE_EVENT, loadCourseSelection } from "@/lib/course-selection";
import { convexApi } from "@/lib/convex-api";
import { convexEnv } from "@/lib/education-data";
import { isMobileAppRuntime } from "@/lib/feature-scope";
import { useLearnerCatalog } from "@/lib/learner-catalog-client";
import { getLearnerSession } from "@/lib/learner-session";
import {
  MOBILE_STUDY_STATE_CHANGE_EVENT,
  readMobilePastPaperProgresses,
  readMobileQuizProgress,
  readMobileStudyActivity,
  type MobileStudyActivity,
} from "@/lib/mobile-study-state";
import { useQuery } from "convex/react";
import {
  ArrowRightIcon,
  BookOpenCheckIcon,
  BookOpenIcon,
  BookOpenTextIcon,
  FileTextIcon,
  Layers3Icon,
  PlayCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type PastPaperCourseSummary = {
  courseStableId: string;
  paperCount: number;
};

export function MobileStudyHome() {
  if (!convexEnv.isConfigured) {
    return <MobileStudyHomeContent pastPaperSummaries={[]} />;
  }

  return <ConfiguredMobileStudyHome />;
}

function ConfiguredMobileStudyHome() {
  const summaries = useQuery(convexApi.pastPapers.listPastPaperCourseSummaries, {}) as
    | PastPaperCourseSummary[]
    | undefined;

  return <MobileStudyHomeContent pastPaperSummaries={summaries ?? []} pastPapersLoading={summaries === undefined} />;
}

function MobileStudyHomeContent({
  pastPaperSummaries,
  pastPapersLoading = false,
}: {
  pastPaperSummaries: PastPaperCourseSummary[];
  pastPapersLoading?: boolean;
}) {
  const router = useRouter();
  const auth = useLearnerAuthRuntime();
  const catalog = useLearnerCatalog();
  const [nativeAppSurface, setNativeAppSurface] = useState<boolean | null>(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[] | null>(null);
  const [lastActivity, setLastActivity] = useState<MobileStudyActivity | null>(null);

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
      router.replace("/mobile-profile#course-selection");
      return;
    }

    setSelectedCourseIds(selection.selectedCourseIds);
  }, [auth.isLoaded, auth.isSignedIn, router]);

  useEffect(() => {
    if (nativeAppSurface !== true) return;

    function syncSelection() {
      const selection = loadCourseSelection();
      setSelectedCourseIds(selection.selectedCourseIds);
    }

    window.addEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSelection);
    window.addEventListener("storage", syncSelection);
    window.addEventListener("pageshow", syncSelection);

    return () => {
      window.removeEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSelection);
      window.removeEventListener("storage", syncSelection);
      window.removeEventListener("pageshow", syncSelection);
    };
  }, [nativeAppSurface]);

  useEffect(() => {
    function syncActivity() {
      setLastActivity(readMobileStudyActivity());
    }

    syncActivity();
    window.addEventListener(MOBILE_STUDY_STATE_CHANGE_EVENT, syncActivity);
    window.addEventListener("storage", syncActivity);
    return () => {
      window.removeEventListener(MOBILE_STUDY_STATE_CHANGE_EVENT, syncActivity);
      window.removeEventListener("storage", syncActivity);
    };
  }, []);

  const paperCountByCourse = useMemo(
    () => new Map(pastPaperSummaries.map((summary) => [summary.courseStableId, summary.paperCount])),
    [pastPaperSummaries],
  );
  const selectedCourses = useMemo(() => {
    if (!selectedCourseIds) return [];
    return catalog.courses.filter((course) => selectedCourseIds.includes(course.id));
  }, [catalog.courses, selectedCourseIds]);

  const resumableActivity = useMemo(() => {
    if (!selectedCourseIds) return null;

    if (lastActivity?.courseId && !selectedCourseIds.includes(lastActivity.courseId)) {
      return null;
    }

    if (lastActivity?.kind === "quiz" && lastActivity.quizId) {
      return readMobileQuizProgress(lastActivity.quizId) ? lastActivity : null;
    }

    if (lastActivity?.kind === "past-paper" && lastActivity.paperId) {
      const progress = readMobilePastPaperProgresses().find((item) => item.paperId === lastActivity.paperId);
      return progress && !progress.finished ? lastActivity : null;
    }

    const unfinishedPaper = readMobilePastPaperProgresses().find(
      (progress) => !progress.finished && selectedCourseIds.includes(progress.courseId),
    );
    if (!unfinishedPaper) return null;

    return {
      kind: "past-paper" as const,
      href: `/mobile-past-papers/${unfinishedPaper.paperId}`,
      title: unfinishedPaper.title,
      subtitle: `Resume at question ${unfinishedPaper.currentIndex + 1}`,
      courseId: unfinishedPaper.courseId,
      paperId: unfinishedPaper.paperId,
      updatedAt: unfinishedPaper.updatedAt,
    };
  }, [lastActivity, selectedCourseIds]);

  if (nativeAppSurface === false) {
    return <WebMobileStudyPreview />;
  }

  if (nativeAppSurface === null || catalog.isLoading || pastPapersLoading || selectedCourseIds === null) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <AppLoadingSpinner label="Loading your courses" showLabel />
      </div>
    );
  }

  if (selectedCourses.length === 0) {
    return (
      <MobileEmptyState
        icon={BookOpenIcon}
        title="Choose your courses"
        description="Home only shows courses you selected in Profile. Choose from the currently published learner catalog to continue."
        action={<Button asChild><Link href="/mobile-profile#course-selection">Choose courses in Profile</Link></Button>}
      />
    );
  }

  return (
    <MobilePageStack>
      <MobilePageHeader
        eyebrow="My courses"
        title="Your courses"
        description="These are the courses you chose in Profile. Open one to continue with its published study content."
      />

      {resumableActivity ? (
        <MobileSurface className="border-primary/20 bg-primary/5 p-5" aria-label="Resume study">
          <div className="flex items-start gap-3">
            <span className="bg-primary text-primary-foreground grid size-10 shrink-0 place-items-center rounded-full">
              <PlayCircleIcon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Resume study</p>
              <h2 className="mt-1 font-semibold tracking-tight">{resumableActivity.title}</h2>
              {resumableActivity.subtitle ? (
                <p className="text-muted-foreground mt-1 text-sm">{resumableActivity.subtitle}</p>
              ) : null}
            </div>
          </div>
          <Button asChild className="mt-4 min-h-11 w-full">
            <Link href={resumableActivity.href}>Continue</Link>
          </Button>
        </MobileSurface>
      ) : null}

      <section className="grid gap-3">
        {selectedCourses.map((course) => {
          const topicIds = new Set(
            catalog.lessons
              .filter(
                (lesson) =>
                  lesson.courseId === course.id &&
                  catalog.quizzes.some((quiz) => quiz.courseId === course.id && quiz.lessonId === lesson.id),
              )
              .map((lesson) => lesson.id),
          );
          const quizCount = catalog.quizzes.filter((quiz) => quiz.courseId === course.id).length;
          const paperCount = paperCountByCourse.get(course.id) ?? 0;
          const contentSummary = [
            quizCount > 0 ? `${quizCount} ${quizCount === 1 ? "quiz" : "quizzes"}` : null,
            paperCount > 0 ? `${paperCount} past ${paperCount === 1 ? "paper" : "papers"}` : null,
          ]
            .filter(Boolean)
            .join(" · ");
          const Icon = paperCount > 0 && quizCount === 0 ? FileTextIcon : quizCount > 0 ? BookOpenCheckIcon : BookOpenIcon;

          return (
            <MobileListRow
              key={course.id}
              href={`/mobile-study/${encodeURIComponent(course.id)}`}
              icon={Icon}
              title={course.title}
              subtitle={course.subject}
              meta={`${contentSummary || "No published study content"}${topicIds.size > 0 ? ` · ${topicIds.size} ${topicIds.size === 1 ? "topic" : "topics"}` : ""}`}
              trailing={<ArrowRightIcon className="size-5" />}
            />
          );
        })}

        <Button asChild variant="outline" className="mt-1 min-h-11 w-full">
          <Link href="/mobile-profile#course-selection">Change courses in Profile</Link>
        </Button>
      </section>
    </MobilePageStack>
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
          Browser preview tools include quizzes and flashcards. The native IntellectX learner app uses selected courses,
          quizzes, past papers, Progress, and Profile.
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
