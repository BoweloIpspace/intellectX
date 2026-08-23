"use client";

import type { LearnerPastPaper } from "@/lib/past-paper-catalog";
import { ArrowLeftIcon, ArrowRightIcon, CheckCircle2Icon, EyeIcon, RotateCcwIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type PastPaperRunnerProps = {
  paper: LearnerPastPaper;
};

export function PastPaperRunner({ paper }: PastPaperRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());
  const [finished, setFinished] = useState(false);
  const current = paper.questions[currentIndex];

  const revealedCount = useMemo(
    () => paper.questions.filter((question) => revealed.has(question.stableId)).length,
    [paper.questions, revealed],
  );

  if (!current) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <p className="font-medium">This paper does not have any questions yet.</p>
      </div>
    );
  }

  const isRevealed = revealed.has(current.stableId);
  const progress = Math.round(((currentIndex + 1) / paper.questions.length) * 100);

  function revealCurrent() {
    setRevealed((previous) => {
      const next = new Set(previous);
      next.add(current.stableId);
      return next;
    });
  }

  function restart() {
    setCurrentIndex(0);
    setRevealed(new Set());
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <CheckCircle2Icon className="mb-4 size-10" />
        <h2 className="text-2xl font-semibold">Paper complete</h2>
        <p className="text-muted-foreground mt-2 leading-7">
          You worked through all {paper.questions.length} questions and revealed {revealedCount} model answers.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={restart}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <RotateCcwIcon className="size-4" />
            Try again
          </button>
          <Link
            href={`/courses/${paper.courseStableId}`}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium"
          >
            Back to Biology
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-4 text-sm">
          <span className="font-medium">
            Question {current.questionNumber} · {currentIndex + 1} of {paper.questions.length}
          </span>
          {typeof current.marks === "number" ? (
            <span className="text-muted-foreground">{current.marks} marks</span>
          ) : null}
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-6 whitespace-pre-wrap text-base leading-8 sm:text-lg">{current.prompt}</div>

        {!isRevealed ? (
          <button
            type="button"
            onClick={revealCurrent}
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground sm:w-auto"
          >
            <EyeIcon className="size-5" />
            Reveal answer
          </button>
        ) : (
          <div className="mt-7 space-y-4">
            <div className="rounded-xl border bg-secondary/40 p-4 sm:p-5">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide">Model answer</p>
              <div className="whitespace-pre-wrap leading-7">{current.modelAnswer}</div>
            </div>
            {current.explanation ? (
              <div className="rounded-xl border p-4 sm:p-5">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide">Why this works</p>
                <div className="whitespace-pre-wrap text-muted-foreground leading-7">{current.explanation}</div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeftIcon className="size-4" />
          Previous
        </button>

        {currentIndex < paper.questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentIndex((index) => Math.min(paper.questions.length - 1, index + 1))}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium"
          >
            Next
            <ArrowRightIcon className="size-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setFinished(true)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Finish paper
            <CheckCircle2Icon className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
