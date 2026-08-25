"use client";

import { useLearnerAuthRuntime } from "@/components/providers/learner-auth-runtime-provider";
import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getMat111ExamPaper,
  getMat111ExamPapersByCourse,
  type Mat111ExamPaper,
  type Mat111ExamQuestion,
} from "@/data/mat111-exams";
import { MAT111_COURSE_ID } from "@/data/mat111-course";
import { isClerkAuthEnabled } from "@/lib/auth-mode";
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
import { ArrowLeftIcon, ArrowRightIcon, CheckCircle2Icon, EyeIcon, FileTextIcon, RotateCcwIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ExamAnswer = { modelAnswer: string; explanation?: string };

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

export function MobileMat111ExamList() {
  const ready = useNativeLearnerAccess();
  const [, setRevision] = useState(0);
  const papers = getMat111ExamPapersByCourse(MAT111_COURSE_ID);

  useEffect(() => {
    const sync = () => setRevision((value) => value + 1);
    window.addEventListener(MOBILE_STUDY_STATE_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(MOBILE_STUDY_STATE_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <AppLoadingSpinner label="Loading MAT111 exams" showLabel />
      </div>
    );
  }

  const progressByPaperId = new Map(readMobilePastPaperProgresses().map((progress) => [progress.paperId, progress]));

  return (
    <section className="space-y-4">
      <Button asChild size="sm" variant="ghost" className="-ml-2">
        <Link href="/mobile-past-papers">
          <ArrowLeftIcon className="size-4" />
          Exams
        </Link>
      </Button>

      <div className="rounded-lg border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
        <Badge variant="secondary">MAT111</Badge>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Practice papers</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          These structured papers are built from the supplied MAT111 lecture notes. They are course practice papers, not
          claimed as official university past papers.
        </p>
      </div>

      <div className="grid gap-3">
        {papers.map((paper) => {
          const progress = progressByPaperId.get(paper.stableId);
          const progressLabel = progress
            ? progress.finished
              ? "Completed on this device"
              : `Resume at question ${progress.currentIndex + 1}`
            : null;

          return (
            <Link
              key={paper.stableId}
              href={`/mobile-mat111-exams/${paper.stableId}`}
              className="animate-widget flex min-h-32 items-center gap-4 rounded-lg border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur transition hover:bg-white/80 dark:border-white/10 dark:bg-card/60"
            >
              <span className="bg-primary text-primary-foreground grid size-11 shrink-0 place-items-center rounded-full">
                <FileTextIcon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-semibold tracking-tight">{paper.title}</span>
                <span className="text-muted-foreground mt-1 block text-sm">{paper.paperCode}</span>
                <span className="text-muted-foreground mt-2 block text-xs">
                  {paper.estimatedTime} · {paper.totalMarks} marks · {paper.questions.length} questions
                </span>
                {progressLabel ? <span className="mt-2 block text-xs font-medium text-primary">{progressLabel}</span> : null}
              </span>
              <ArrowRightIcon className="size-5 shrink-0" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function QuestionStimulus({ question }: { question: Mat111ExamQuestion }) {
  const hasStimulus = Boolean(question.stimulusTitle || question.stimulusText || question.stimulusAssetPath);
  if (!hasStimulus) return null;

  return (
    <aside className="mt-5 rounded-lg border bg-background/70 p-4" aria-label={`Source material for question ${question.questionNumber}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-semibold">{question.stimulusTitle ?? "Source material"}</p>
        {question.stimulusSourceStatus ? (
          <Badge variant="outline" className="text-[10px]">
            {question.stimulusSourceStatus === "reconstructed-visual" ? "Reconstructed study visual" : "Source information"}
          </Badge>
        ) : null}
      </div>
      {question.stimulusAssetPath && question.stimulusAssetAlt ? (
        <div className="mt-4 overflow-hidden rounded-md border bg-white p-2">
          <Image
            src={question.stimulusAssetPath}
            alt={question.stimulusAssetAlt}
            width={800}
            height={420}
            unoptimized
            className="h-auto w-full object-contain grayscale contrast-125"
          />
        </div>
      ) : null}
      {question.stimulusText ? (
        <p className="text-muted-foreground mt-3 whitespace-pre-wrap text-sm leading-6">{question.stimulusText}</p>
      ) : null}
    </aside>
  );
}

export function MobileMat111ExamRunner({ paperId }: { paperId: string }) {
  const ready = useNativeLearnerAccess();
  const paper = getMat111ExamPaper(paperId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());
  const [answers, setAnswers] = useState<Record<string, ExamAnswer>>({});
  const [loadingAnswer, setLoadingAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const current = paper?.questions[currentIndex];

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
      const validIds = new Set(paper.questions.map((question) => question.stableId));
      setRevealed(new Set(saved.revealedQuestionIds.filter((id) => validIds.has(id))));
      setFinished(saved.finished && paper.questions.length > 0);
    } else {
      setCurrentIndex(0);
      setRevealed(new Set());
      setFinished(false);
    }
    setAnswers({});
    setError(null);
    setHydrated(true);
  }, [paper]);

  useEffect(() => {
    if (!paper || !hydrated || paper.questions.length === 0) return;
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
        href: `/mobile-mat111-exams/${paper.stableId}`,
        title: paper.title,
        subtitle: `Question ${currentIndex + 1} of ${paper.questions.length}`,
        courseId: paper.courseStableId,
        paperId: paper.stableId,
        updatedAt: Date.now(),
      });
    }
  }, [currentIndex, finished, hydrated, paper, revealed]);

  async function revealAnswer() {
    if (!paper || !current || loadingAnswer) return;
    setLoadingAnswer(current.stableId);
    setError(null);
    try {
      const response = await fetch("/api/mat111-exam-answer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ paperId: paper.stableId, questionId: current.stableId }),
      });
      const payload = (await response.json().catch(() => ({}))) as ExamAnswer & { error?: unknown };
      if (!response.ok || typeof payload.modelAnswer !== "string") {
        throw new Error(typeof payload.error === "string" ? payload.error : "Unable to load this model answer.");
      }
      setAnswers((existing) => ({ ...existing, [current.stableId]: payload }));
      setRevealed((existing) => new Set(existing).add(current.stableId));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load this model answer.");
    } finally {
      setLoadingAnswer(null);
    }
  }

  if (!ready || (paper && !hydrated)) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <AppLoadingSpinner label="Loading MAT111 practice paper" showLabel />
      </div>
    );
  }

  if (!paper || !current) {
    return (
      <section className="rounded-lg border border-white/70 bg-white/60 p-6 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
        <h1 className="text-xl font-semibold tracking-tight">Practice paper unavailable</h1>
        <Button asChild className="mt-5 w-full">
          <Link href="/mobile-mat111-exams">Back to MAT111 Exams</Link>
        </Button>
      </section>
    );
  }

  function restart() {
    clearMobilePastPaperProgress(paperId);
    setCurrentIndex(0);
    setRevealed(new Set());
    setAnswers({});
    setFinished(false);
    setError(null);
  }

  if (finished) {
    return (
      <section className="space-y-5">
        <div className="rounded-lg border border-white/70 bg-white/60 p-6 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
          <CheckCircle2Icon className="mx-auto size-10" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Practice paper complete</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            You worked through all {paper.questions.length} questions and revealed {revealedCount} model answers. Progress is saved on this device.
          </p>
          <p className="text-muted-foreground mt-2 text-xs">Paper total: {paper.totalMarks} marks</p>
        </div>
        <Button className="min-h-12 w-full" onClick={restart}>
          <RotateCcwIcon className="size-4" />
          Try again
        </Button>
        <Button asChild variant="outline" className="min-h-12 w-full">
          <Link href="/mobile-mat111-exams">Back to MAT111 Exams</Link>
        </Button>
      </section>
    );
  }

  const answer = answers[current.stableId];
  const progress = Math.round(((currentIndex + 1) / paper.questions.length) * 100);

  return (
    <section className="space-y-4">
      <Button asChild size="sm" variant="ghost" className="-ml-2">
        <Link href="/mobile-mat111-exams">
          <ArrowLeftIcon className="size-4" />
          MAT111 Exams
        </Link>
      </Button>

      <div className="rounded-lg border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{paper.paperCode}</Badge>
              {current.sectionLabel ? <Badge variant="outline">{current.sectionLabel}</Badge> : null}
            </div>
            <h1 className="mt-3 text-xl font-semibold tracking-tight">Question {current.questionNumber}</h1>
          </div>
          <span className="text-muted-foreground text-xs font-medium">{current.marks} marks</span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-muted-foreground mt-2 text-xs">{currentIndex + 1} of {paper.questions.length}</p>

        <QuestionStimulus question={current} />
        <div className="mt-5 whitespace-pre-wrap text-base leading-7">{current.prompt}</div>

        {!revealed.has(current.stableId) ? (
          <Button className="mt-6 min-h-12 w-full" disabled={loadingAnswer === current.stableId} onClick={() => void revealAnswer()}>
            <EyeIcon className="size-5" />
            {loadingAnswer === current.stableId ? "Loading answer..." : "Reveal answer"}
          </Button>
        ) : answer ? (
          <div className="mt-6 space-y-3">
            <div className="rounded-lg border bg-secondary/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide">Model answer</p>
              <div className="mt-2 whitespace-pre-wrap text-sm leading-6">{answer.modelAnswer}</div>
            </div>
            {answer.explanation ? (
              <div className="rounded-lg border p-4">
                <p className="text-xs font-semibold uppercase tracking-wide">Explanation</p>
                <div className="text-muted-foreground mt-2 whitespace-pre-wrap text-sm leading-6">{answer.explanation}</div>
              </div>
            ) : null}
          </div>
        ) : null}

        {error ? <p className="text-destructive mt-4 text-sm" role="alert">{error}</p> : null}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="min-h-12" disabled={currentIndex === 0} onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}>
          <ArrowLeftIcon className="size-4" />
          Previous
        </Button>
        {currentIndex < paper.questions.length - 1 ? (
          <Button variant="outline" className="min-h-12" onClick={() => setCurrentIndex((index) => Math.min(paper.questions.length - 1, index + 1))}>
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

export function getMat111PracticePaperCount() {
  return getMat111ExamPapersByCourse(MAT111_COURSE_ID).length;
}

export function getMat111PracticePaperSummaries(): Pick<Mat111ExamPaper, "stableId" | "title" | "paperCode" | "estimatedTime" | "totalMarks">[] {
  return getMat111ExamPapersByCourse(MAT111_COURSE_ID);
}
