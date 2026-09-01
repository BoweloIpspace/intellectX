"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getMat111MobileExamPaper,
  getMat111MobileExamPapersByLesson,
  mat111MobileExamPapers,
} from "@/data/mat111-mobile-study";
import type { Mat111MobileExamPaper } from "@/data/mat111-mobile-study-types";
import {
  MOBILE_STUDY_STATE_CHANGE_EVENT,
  clearMobilePastPaperProgress,
  readMobilePastPaperProgress,
  readMobilePastPaperProgresses,
  writeMobilePastPaperProgress,
  writeMobileStudyActivity,
} from "@/lib/mobile-study-state";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  EyeIcon,
  FileTextIcon,
  RotateCcwIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export function Mat111MobileExamPracticeList({ topicId }: { topicId?: string }) {
  const papers = topicId ? getMat111MobileExamPapersByLesson(topicId) : mat111MobileExamPapers;
  const [progressByPaperId, setProgressByPaperId] = useState<
    Map<string, ReturnType<typeof readMobilePastPaperProgresses>[number]>
  >(() => new Map());

  useEffect(() => {
    const syncProgress = () => {
      setProgressByPaperId(
        new Map(readMobilePastPaperProgresses().map((progress) => [progress.paperId, progress])),
      );
    };
    syncProgress();
    window.addEventListener(MOBILE_STUDY_STATE_CHANGE_EVENT, syncProgress);
    window.addEventListener("storage", syncProgress);
    return () => {
      window.removeEventListener(MOBILE_STUDY_STATE_CHANGE_EVENT, syncProgress);
      window.removeEventListener("storage", syncProgress);
    };
  }, []);

  const groups = useMemo(() => {
    const grouped = new Map<string, Mat111MobileExamPaper[]>();
    for (const paper of papers) {
      const current = grouped.get(paper.lessonId) ?? [];
      current.push(paper);
      grouped.set(paper.lessonId, current);
    }
    return Array.from(grouped.values());
  }, [papers]);

  return (
    <section className="space-y-5">
      <Button asChild size="sm" variant="ghost" className="-ml-2">
        <Link href={topicId ? `/mobile-quizzes?course=${encodeURIComponent(papers[0]?.courseStableId ?? "")}&topic=${encodeURIComponent(topicId)}` : "/mobile-study"}>
          <ArrowLeftIcon className="size-4" />
          {topicId ? "Topic quizzes" : "Home"}
        </Link>
      </Button>

      <div className="rounded-2xl border border-border/70 bg-background/80 p-5">
        <Badge variant="secondary">MAT111 exam practice</Badge>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          {topicId && papers[0] ? `Week ${papers[0].week}: 5 exam practice sets` : "5 exam practice sets per lecture topic"}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          These are source-backed practice sets derived from the supplied lecture notes. They are not represented as
          archived institutional past papers.
        </p>
      </div>

      {groups.map((group) => (
        <section key={group[0].lessonId} className="space-y-3">
          {!topicId ? (
            <div>
              <Badge variant="outline">Week {group[0].week}</Badge>
              <h2 className="mt-2 text-lg font-semibold">{group[0].topicTitle}</h2>
            </div>
          ) : null}
          <div className="grid gap-3">
            {group.map((paper) => {
              const saved = progressByPaperId.get(paper.stableId);
              const progressLabel = saved
                ? saved.finished
                  ? "Completed on this device"
                  : `Resume at question ${saved.currentIndex + 1}`
                : null;
              return (
                <Link
                  key={paper.stableId}
                  href={`/mobile-past-papers/${encodeURIComponent(paper.stableId)}`}
                  className="flex min-h-28 items-center gap-4 rounded-2xl border border-border/70 bg-background/70 p-4"
                >
                  <span className="bg-primary text-primary-foreground grid size-10 shrink-0 place-items-center rounded-full">
                    <FileTextIcon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{paper.title}</span>
                    <span className="text-muted-foreground mt-1 block text-xs">
                      {paper.paperCode} · {paper.questions.length} questions · {paper.totalMarks} marks
                    </span>
                    {progressLabel ? <span className="mt-2 block text-xs font-medium text-primary">{progressLabel}</span> : null}
                  </span>
                  <ArrowRightIcon className="size-5" />
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </section>
  );
}

export function Mat111MobileExamPracticeRunner({ paperId }: { paperId: string }) {
  const paper = getMat111MobileExamPaper(paperId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());
  const [finished, setFinished] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!paper) return;
    const saved = readMobilePastPaperProgress(paper.stableId);
    if (saved) {
      setCurrentIndex(Math.min(saved.currentIndex, Math.max(0, paper.questions.length - 1)));
      setRevealed(new Set(saved.revealedQuestionIds));
      setFinished(saved.finished);
    }
    setHydrated(true);
  }, [paper]);

  useEffect(() => {
    if (!paper || !hydrated) return;
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
  }, [currentIndex, finished, hydrated, paper, revealed]);

  if (!paper) {
    return (
      <section className="rounded-2xl border border-border/70 bg-background/70 p-6 text-center">
        <h1 className="text-xl font-semibold">Practice set unavailable</h1>
        <Button asChild className="mt-5">
          <Link href="/mobile-past-papers">Back to exams</Link>
        </Button>
      </section>
    );
  }

  if (!hydrated) {
    return <div className="min-h-48" aria-label="Loading exam practice" />;
  }

  const current = paper.questions[currentIndex];
  const answerVisible = current ? revealed.has(current.stableId) : false;

  if (finished || !current) {
    return (
      <section className="space-y-4">
        <div className="rounded-2xl border border-border/70 bg-background/80 p-6 text-center">
          <CheckCircle2Icon className="mx-auto size-10" />
          <h1 className="mt-4 text-2xl font-semibold">Practice set complete</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            You completed {paper.questions.length} source-backed questions from Week {paper.week}.
          </p>
        </div>
        <Button
          className="min-h-12 w-full"
          onClick={() => {
            clearMobilePastPaperProgress(paper.stableId);
            setCurrentIndex(0);
            setRevealed(new Set());
            setFinished(false);
          }}
        >
          <RotateCcwIcon className="size-4" />
          Try again
        </Button>
        <Button asChild variant="outline" className="min-h-12 w-full">
          <Link href={`/mobile-past-papers?course=${encodeURIComponent(paper.courseStableId)}&topic=${encodeURIComponent(paper.lessonId)}`}>
            Back to 5 exam sets
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <Button asChild size="sm" variant="ghost" className="-ml-2">
        <Link href={`/mobile-past-papers?course=${encodeURIComponent(paper.courseStableId)}&topic=${encodeURIComponent(paper.lessonId)}`}>
          <ArrowLeftIcon className="size-4" />
          5 exam sets
        </Link>
      </Button>

      <div className="rounded-2xl border border-border/70 bg-background/80 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="secondary">{paper.title}</Badge>
          <span className="text-muted-foreground text-xs">{current.marks} marks</span>
        </div>
        <h1 className="mt-4 text-xl font-semibold">Question {current.questionNumber}</h1>
        <p className="mt-4 text-base leading-7">{current.prompt}</p>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-[width]"
            style={{ width: `${Math.round(((currentIndex + 1) / paper.questions.length) * 100)}%` }}
          />
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          {currentIndex + 1} of {paper.questions.length}
        </p>
      </div>

      {answerVisible ? (
        <div className="rounded-2xl border border-border/70 bg-secondary/40 p-5">
          <Badge variant="outline">Model answer</Badge>
          <p className="mt-3 text-sm leading-6">{current.modelAnswer}</p>
        </div>
      ) : (
        <Button
          variant="outline"
          className="min-h-12 w-full"
          onClick={() => setRevealed((currentSet) => new Set([...currentSet, current.stableId]))}
        >
          <EyeIcon className="size-4" />
          Reveal model answer
        </Button>
      )}

      <Button
        className="min-h-12 w-full"
        onClick={() => {
          if (currentIndex >= paper.questions.length - 1) {
            setFinished(true);
          } else {
            setCurrentIndex((value) => value + 1);
          }
        }}
      >
        {currentIndex >= paper.questions.length - 1 ? "Finish practice set" : "Next question"}
        <ArrowRightIcon className="size-4" />
      </Button>
    </section>
  );
}
