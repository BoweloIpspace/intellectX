"use client";

import { useLearnerAuthRuntime } from "@/components/providers/learner-auth-runtime-provider";
import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MobileEmptyState, MobileListRow, MobilePageHeader, MobilePageStack, MobileSurface } from "@/components/ui/mobile-app-primitives";
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
import Image from "next/image";
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
  totalMarks?: number;
  pageCount?: number;
  order: number;
};

type PastPaperQuestion = {
  stableId: string;
  questionNumber: string;
  sectionLabel?: string;
  prompt: string;
  marks?: number;
  stimulusTitle?: string;
  stimulusText?: string;
  stimulusAssetPath?: string;
  stimulusAssetAlt?: string;
  stimulusSourceStatus?: "source-text" | "reconstructed-visual";
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
    <MobileEmptyState
      icon={FileTextIcon}
      title="Past papers are unavailable"
      description="This build is not connected to the IntellectX learning database."
      action={<Button asChild><Link href="/mobile-past-papers">Back to Exams</Link></Button>}
    />
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
    <MobilePageStack>
      <Button asChild size="sm" variant="ghost" className="-ml-2">
        <Link href="/mobile-past-papers">
          <ArrowLeftIcon className="size-4" />
          Exams
        </Link>
      </Button>

      <MobilePageHeader
        eyebrow="Past papers"
        title="Exam practice"
        description="Work through a paper one question at a time, use the supplied source material, then reveal the model answer when you are ready. Unfinished papers resume on this device."
      />

      {papers.length === 0 ? (
        <MobileEmptyState
          icon={FileTextIcon}
          title="No past papers published yet"
          description="No past papers are published for this course yet."
        />
      ) : (
        <div className="grid gap-3">
          {papers.map((paper) => {
            const savedProgress = progressByPaperId.get(paper.stableId);
            const progressLabel = savedProgress
              ? savedProgress.finished
                ? "Completed on this device"
                : `Resume at question ${savedProgress.currentIndex + 1}`
              : null;
            const paperFacts = [
              paper.session ?? String(paper.year),
              paper.estimatedTime,
              typeof paper.totalMarks === "number" ? `${paper.totalMarks} marks` : null,
              typeof paper.pageCount === "number" ? `${paper.pageCount} pages` : null,
            ]
              .filter(Boolean)
              .join(" · ");

            return (
              <MobileListRow
                key={paper.stableId}
                href={`/mobile-past-papers/${paper.stableId}`}
                icon={FileTextIcon}
                title={paper.title}
                subtitle={paper.paperCode}
                meta={`${paperFacts}${progressLabel ? ` · ${progressLabel}` : ""}`}
                trailing={<ArrowRightIcon className="size-5" />}
                className="animate-widget"
              />
            );
          })}
        </div>
      )}
    </MobilePageStack>
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
      <MobileEmptyState
        icon={FileTextIcon}
        title="Paper unavailable"
        action={<Button asChild><Link href="/mobile-past-papers">Back to Exams</Link></Button>}
      />
    );
  }

  if (!current) {
    return (
      <MobileEmptyState
        icon={FileTextIcon}
        title="No questions published yet"
        action={<Button asChild><Link href={`/mobile-past-papers?course=${encodeURIComponent(paper.courseStableId)}`}>Back to Past Papers</Link></Button>}
      />
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
      <MobilePageStack>
        <MobileSurface className="p-6 text-center">
          <CheckCircle2Icon className="mx-auto size-10" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Paper complete</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            You worked through all {paper.questions.length} questions and revealed {revealedCount} model answers. This
            completion is saved on this device.
          </p>
          {typeof paper.totalMarks === "number" ? (
            <p className="text-muted-foreground mt-2 text-xs">Paper total: {paper.totalMarks} marks</p>
          ) : null}
        </MobileSurface>
        <Button className="min-h-12 w-full" onClick={restart}>
          <RotateCcwIcon className="size-4" />
          Try again
        </Button>
        <Button asChild variant="outline" className="min-h-12 w-full">
          <Link href={`/mobile-past-papers?course=${encodeURIComponent(paper.courseStableId)}`}>Back to Past Papers</Link>
        </Button>
      </MobilePageStack>
    );
  }

  const progress = Math.round(((currentIndex + 1) / paper.questions.length) * 100);
  const hasStimulus = Boolean(current.stimulusTitle || current.stimulusText || current.stimulusAssetPath);

  return (
    <MobilePageStack>
      <Button asChild size="sm" variant="ghost" className="-ml-2">
        <Link href={`/mobile-past-papers?course=${encodeURIComponent(paper.courseStableId)}`}>
          <ArrowLeftIcon className="size-4" />
          Past Papers
        </Link>
      </Button>

      <MobileSurface className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{paper.title}</Badge>
              {current.sectionLabel ? <Badge variant="outline">{current.sectionLabel}</Badge> : null}
            </div>
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

        {hasStimulus ? (
          <aside
            className="mt-5 rounded-lg border bg-background/70 p-4"
            aria-label={`Source material for question ${current.questionNumber}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-semibold">{current.stimulusTitle ?? "Source material"}</p>
              {current.stimulusSourceStatus ? (
                <Badge variant="outline" className="text-[10px]">
                  {current.stimulusSourceStatus === "reconstructed-visual"
                    ? "Reconstructed study visual"
                    : "Source information"}
                </Badge>
              ) : null}
            </div>
            {current.stimulusAssetPath && current.stimulusAssetAlt ? (
              <div className="mt-4 overflow-hidden rounded-md border bg-white p-2">
                <Image
                  src={current.stimulusAssetPath}
                  alt={current.stimulusAssetAlt}
                  width={760}
                  height={480}
                  unoptimized
                  className="h-auto w-full"
                />
              </div>
            ) : null}
            {current.stimulusText ? (
              <p className="text-muted-foreground mt-3 whitespace-pre-wrap text-sm leading-6">{current.stimulusText}</p>
            ) : null}
          </aside>
        ) : null}

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
      </MobileSurface>

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
    </MobilePageStack>
  );
}
