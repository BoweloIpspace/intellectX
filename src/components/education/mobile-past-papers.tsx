"use client";

import { useLearnerAuthRuntime } from "@/components/providers/learner-auth-runtime-provider";
import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isClerkAuthEnabled } from "@/lib/auth-mode";
import { convexApi } from "@/lib/convex-api";
import { convexEnv } from "@/lib/education-data";
import { isMobileAppRuntime } from "@/lib/feature-scope";
import { getLearnerSession } from "@/lib/learner-session";
import {
  MOBILE_STUDY_STATE_CHANGE_EVENT,
  clearMobilePastPaperProgress,
  readMobilePastPaperProgress,
  readMobilePastPaperProgresses,
  writeMobilePastPaperProgress,
  writeMobileStudyActivity,
} from "@/lib/mobile-study-state";
import { useQuery } from "convex/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  EyeIcon,
  FileTextIcon,
  RotateCcwIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type PastPaperSummary = {
  stableId: string;
  courseStableId: string;
  title: string;
  year: number;
  paperCode: string;
  session?: string;
  description?: string;
  estimatedTime?: string;
  order: number;
};

type PastPaperQuestion = {
  stableId: string;
  questionNumber: string;
  prompt: string;
  marks?: number;
  order: number;
};

type PastPaperDetail = PastPaperSummary & {
  questions: PastPaperQuestion[];
};

type PastPaperAnswer = {
  modelAnswer: string;
  explanation?: string;
};

function MobilePastPaperUnavailable() {
  return (
    <section className="rounded-lg border border-white/70 bg-white/60 p-6 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
      <FileTextIcon className="mx-auto size-6" />
      <h1 className="mt-4 text-xl font-semibold tracking-tight">Past papers are unavailable</h1>
      <p className="text-muted-foreground mt-2 text-sm leading-6">
        This build is not connected to the IntellectX learning database.
      </p>
      <Button asChild className="mt-5 w-full">
        <Link href="/mobile-study">Back to Home</Link>
      </Button>
    </section>
  );
}

function useNativeLearnerAccess() {
  const router = useRouter();
  const auth = useLearnerAuthRuntime();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isMobileAppRuntime()) {
      setReady(true);
      return;
    }

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

    setReady(true);
  }, [auth.isLoaded, auth.isSignedIn, router]);

  return ready;
}

export function MobilePastPaperList({ courseId }: { courseId: string }) {
  if (!convexEnv.isConfigured) {
    return <MobilePastPaperUnavailable />;
  }

  return <ConfiguredMobilePastPaperList courseId={courseId} />;
}

function ConfiguredMobilePastPaperList({ courseId }: { courseId: string }) {
  const ready = useNativeLearnerAccess();
  const papers = useQuery(convexApi.pastPapers.getPastPapersByCourse, { courseStableId: courseId }) as
    | PastPaperSummary[]
    | undefined;
  const [, setProgressRevision] = useState(0);

  useEffect(() => {
    const syncProgress = () => setProgressRevision((value) => value + 1);
    window.addEventListener(MOBILE_STUDY_STATE_CHANGE_EVENT, syncProgress);
    window.addEventListener("storage", syncProgress);
    return () => {
      window.removeEventListener(MOBILE_STUDY_STATE_CHANGE_EVENT, syncProgress);
      window.removeEventListener("storage", syncProgress);
    };
  }, []);

  if (!ready || papers === undefined) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <AppLoadingSpinner label="Loading past papers" showLabel />
      </div>
    );
  }

  const progressByPaperId = new Map(readMobilePastPaperProgresses().map((progress) => [progress.paperId, progress]));

  return (
    <section className="space-y-4">
      <Button asChild size="sm" variant="ghost" className="-ml-2">
        <Link href={`/mobile-quizzes?course=${encodeURIComponent(courseId)}`}>
          <ArrowLeftIcon className="size-4" />
          Course
        </Link>
      </Button>

      <div className="rounded-lg border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
        <Badge variant="secondary">Past Papers</Badge>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Exam practice</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Work through a paper one question at a time, then reveal the model answer when you are ready. Unfinished papers
          resume on this device.
        </p>
      </div>

      {papers.length === 0 ? (
        <div className="rounded-lg border border-white/70 bg-white/60 p-5 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
          <p className="font-medium">No past papers are published for this course yet.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {papers.map((paper) => {
            const savedProgress = progressByPaperId.get(paper.stableId);
            const progressLabel = savedProgress
              ? savedProgress.finished
                ? "Completed on this device"
                : `Resume at question ${savedProgress.currentIndex + 1}`
              : null;

            return (
              <Link
                key={paper.stableId}
                href={`/mobile-past-papers/${paper.stableId}`}
                className="animate-widget flex min-h-32 items-center gap-4 rounded-lg border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur transition hover:bg-white/80 dark:border-white/10 dark:bg-card/60"
              >
                <span className="bg-primary text-primary-foreground grid size-11 shrink-0 place-items-center rounded-full">
                  <FileTextIcon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-semibold tracking-tight">{paper.title}</span>
                  <span className="text-muted-foreground mt-1 block text-sm">{paper.paperCode}</span>
                  <span className="text-muted-foreground mt-2 block text-xs">
                    {paper.session ?? paper.year}
                    {paper.estimatedTime ? ` · ${paper.estimatedTime}` : ""}
                  </span>
                  {progressLabel ? <span className="mt-2 block text-xs font-medium text-primary">{progressLabel}</span> : null}
                </span>
                <ArrowRightIcon className="size-5 shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function MobilePastPaperRunner({ paperId }: { paperId: string }) {
  if (!convexEnv.isConfigured) {
    return <MobilePastPaperUnavailable />;
  }

  return <ConfiguredMobilePastPaperRunner paperId={paperId} />;
}

function ConfiguredMobilePastPaperRunner({ paperId }: { paperId: string }) {
  const ready = useNativeLearnerAccess();
  const paper = useQuery(convexApi.pastPapers.getPastPaperById, { paperId }) as PastPaperDetail | null | undefined;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());
  const [finished, setFinished] = useState(false);
  const [progressHydrated, setProgressHydrated] = useState(false);
  const current = paper?.questions[currentIndex];
  const isRevealed = current ? revealed.has(current.stableId) : false;
  const answer = useQuery(
    convexApi.pastPapers.getPastPaperAnswer,
    current && isRevealed ? { paperId, questionId: current.stableId } : "skip",
  ) as PastPaperAnswer | null | undefined;

  const revealedCount = useMemo(
    () => paper?.questions.filter((question) => revealed.has(question.stableId)).length ?? 0,
    [paper?.questions, revealed],
  );

  useEffect(() => {
    if (!paper) return;

    const saved = readMobilePastPaperProgress(paper.stableId);
    if (saved) {
      const maxIndex = Math.max(0, paper.questions.length - 1);
      setCurrentIndex(Math.min(Math.max(0, saved.currentIndex), maxIndex));
      const validQuestionIds = new Set(paper.questions.map((question) => question.stableId));
      setRevealed(new Set(saved.revealedQuestionIds.filter((questionId) => validQuestionIds.has(questionId))));
      setFinished(saved.finished && paper.questions.length > 0);
    } else {
      setCurrentIndex(0);
      setRevealed(new Set());
      setFinished(false);
    }
    setProgressHydrated(true);
  }, [paper]);

  useEffect(() => {
    if (!paper || !progressHydrated || paper.questions.length === 0) return;

    writeMobilePastPaperProgress({
      paperId: paper.stableId,
      courseId: paper.courseStableId,
      title: paper.title,
      currentIndex,
      revealedQuestionIds: Array.from(revealed),
      finished,
      updatedAt: Date.now(),
    });

    if (!finished) {
      writeMobileStudyActivity({
        kind: "past-paper",
        href: `/mobile-past-papers/${paper.stableId}`,
        title: paper.title,
        subtitle: `Question ${currentIndex + 1} of ${paper.questions.length}`,
        courseId: paper.courseStableId,
        paperId: paper.stableId,
        updatedAt: Date.now(),
      });
    }
  }, [currentIndex, finished, paper, progressHydrated, revealed]);

  if (!ready || paper === undefined || (paper && !progressHydrated)) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <AppLoadingSpinner label="Loading paper" showLabel />
      </div>
    );
  }

  if (!paper) {
    return (
      <section className="rounded-lg border border-white/70 bg-white/60 p-6 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
        <h1 className="text-xl font-semibold tracking-tight">Paper unavailable</h1>
        <Button asChild className="mt-5 w-full">
          <Link href="/mobile-study">Back to Home</Link>
        </Button>
      </section>
    );
  }

  if (!current) {
    return (
      <section className="rounded-lg border border-white/70 bg-white/60 p-6 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
        <h1 className="text-xl font-semibold tracking-tight">No questions published yet</h1>
        <Button asChild className="mt-5 w-full">
          <Link href={`/mobile-past-papers?course=${encodeURIComponent(paper.courseStableId)}`}>Back to Past Papers</Link>
        </Button>
      </section>
    );
  }

  function restart() {
    if (!paper) return;
    clearMobilePastPaperProgress(paper.stableId);
    setCurrentIndex(0);
    setRevealed(new Set());
    setFinished(false);
  }

  if (finished) {
    return (
      <section className="space-y-5">
        <div className="rounded-lg border border-white/70 bg-white/60 p-6 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
          <CheckCircle2Icon className="mx-auto size-10" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Paper complete</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            You worked through all {paper.questions.length} questions and revealed {revealedCount} model answers. This
            completion is saved on this device.
          </p>
        </div>
        <Button className="min-h-12 w-full" onClick={restart}>
          <RotateCcwIcon className="size-4" />
          Try again
        </Button>
        <Button asChild variant="outline" className="min-h-12 w-full">
          <Link href={`/mobile-past-papers?course=${encodeURIComponent(paper.courseStableId)}`}>Back to Past Papers</Link>
        </Button>
      </section>
    );
  }

  const progress = Math.round(((currentIndex + 1) / paper.questions.length) * 100);

  return (
    <section className="space-y-4">
      <Button asChild size="sm" variant="ghost" className="-ml-2">
        <Link href={`/mobile-past-papers?course=${encodeURIComponent(paper.courseStableId)}`}>
          <ArrowLeftIcon className="size-4" />
          Past Papers
        </Link>
      </Button>

      <div className="rounded-lg border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant="secondary">{paper.title}</Badge>
            <h1 className="mt-3 text-xl font-semibold tracking-tight">Question {current.questionNumber}</h1>
          </div>
          {typeof current.marks === "number" ? (
            <span className="text-muted-foreground text-xs font-medium">{current.marks} marks</span>
          ) : null}
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          {currentIndex + 1} of {paper.questions.length}
        </p>

        <div className="mt-5 whitespace-pre-wrap text-base leading-7">{current.prompt}</div>

        {!isRevealed ? (
          <Button
            className="mt-6 min-h-12 w-full"
            onClick={() =>
              setRevealed((previous) => {
                const next = new Set(previous);
                next.add(current.stableId);
                return next;
              })
            }
          >
            <EyeIcon className="size-5" />
            Reveal answer
          </Button>
        ) : answer === undefined ? (
          <div className="mt-6 flex min-h-24 items-center justify-center rounded-lg border bg-secondary/30">
            <AppLoadingSpinner label="Loading answer" showLabel />
          </div>
        ) : answer ? (
          <div className="mt-6 space-y-3">
            <div className="rounded-lg border bg-secondary/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide">Model answer</p>
              <div className="mt-2 whitespace-pre-wrap text-sm leading-6">{answer.modelAnswer}</div>
            </div>
            {answer.explanation ? (
              <div className="rounded-lg border p-4">
                <p className="text-xs font-semibold uppercase tracking-wide">Explanation</p>
                <div className="text-muted-foreground mt-2 whitespace-pre-wrap text-sm leading-6">
                  {answer.explanation}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-destructive mt-6 text-sm" role="alert">
            The model answer could not be loaded.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="min-h-12"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
        >
          <ArrowLeftIcon className="size-4" />
          Previous
        </Button>
        {currentIndex < paper.questions.length - 1 ? (
          <Button
            variant="outline"
            className="min-h-12"
            onClick={() => setCurrentIndex((index) => Math.min(paper.questions.length - 1, index + 1))}
          >
            Next
            <ArrowRightIcon className="size-4" />
          </Button>
        ) : (
          <Button className="min-h-12" onClick={() => setFinished(true)}>
            Finish
            <CheckCircle2Icon className="size-4" />
          </Button>
        )}
      </div>
    </section>
  );
}
