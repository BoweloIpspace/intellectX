"use client";

import { LocalQuizPerformance } from "@/components/education/local-quiz-performance";
import { RecentQuizAttempts } from "@/components/education/recent-quiz-attempts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MOBILE_STUDY_STATE_CHANGE_EVENT,
  readMobilePastPaperProgresses,
  type MobilePastPaperProgress,
} from "@/lib/mobile-study-state";
import { summarizeMobilePractice } from "@/lib/mobile-practice-summary";
import {
  QUIZ_ATTEMPT_HISTORY_CHANGE_EVENT,
  readQuizAttemptHistory,
  type QuizAttemptHistoryItem,
} from "@/lib/quiz-attempt-history";
import { CheckCircle2Icon, FileTextIcon, ListChecksIcon, PlayCircleIcon, TrophyIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function formatUpdatedAt(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp));
}

export function MobileProgressContent() {
  const [quizAttempts, setQuizAttempts] = useState<QuizAttemptHistoryItem[]>([]);
  const [pastPapers, setPastPapers] = useState<MobilePastPaperProgress[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    function syncPractice() {
      setQuizAttempts(readQuizAttemptHistory());
      setPastPapers(readMobilePastPaperProgresses());
      setHydrated(true);
    }

    syncPractice();
    window.addEventListener(QUIZ_ATTEMPT_HISTORY_CHANGE_EVENT, syncPractice);
    window.addEventListener(MOBILE_STUDY_STATE_CHANGE_EVENT, syncPractice);
    window.addEventListener("storage", syncPractice);
    window.addEventListener("pageshow", syncPractice);

    return () => {
      window.removeEventListener(QUIZ_ATTEMPT_HISTORY_CHANGE_EVENT, syncPractice);
      window.removeEventListener(MOBILE_STUDY_STATE_CHANGE_EVENT, syncPractice);
      window.removeEventListener("storage", syncPractice);
      window.removeEventListener("pageshow", syncPractice);
    };
  }, []);

  const summary = useMemo(() => summarizeMobilePractice(quizAttempts, pastPapers), [pastPapers, quizAttempts]);

  return (
    <div className="grid gap-4">
      <section className="grid grid-cols-2 gap-3" aria-label="Practice overview">
        <Card className="rounded-lg border-white/70 bg-white/60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
          <CardContent className="pt-5">
            <TrophyIcon className="mb-3 size-5" />
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Quiz average</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">
              {hydrated && summary.quizAttemptCount > 0 ? `${summary.quizAveragePercentage}%` : "—"}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              {summary.quizAttemptCount} {summary.quizAttemptCount === 1 ? "attempt" : "attempts"}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-white/70 bg-white/60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
          <CardContent className="pt-5">
            <CheckCircle2Icon className="mb-3 size-5" />
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Past papers</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{hydrated ? summary.completedPastPaperCount : "—"}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              completed · {summary.inProgressPastPaperCount} in progress
            </p>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-lg border-white/70 bg-white/60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="size-5" />
            Past paper practice
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hydrated ? (
            <p className="text-muted-foreground text-sm" role="status">
              Loading past paper progress...
            </p>
          ) : pastPapers.length > 0 ? (
            <div className="grid gap-3">
              {pastPapers.slice(0, 5).map((paper) => (
                <article key={paper.paperId} className="rounded-lg border bg-secondary/30 p-4">
                  <div className="flex items-start gap-3">
                    {paper.finished ? (
                      <CheckCircle2Icon className="mt-0.5 size-5 shrink-0" />
                    ) : (
                      <PlayCircleIcon className="mt-0.5 size-5 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium">{paper.title}</h3>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {paper.finished ? "Completed" : `Resume at question ${paper.currentIndex + 1}`} · {paper.revealedQuestionIds.length}{" "}
                        {paper.revealedQuestionIds.length === 1 ? "answer" : "answers"} revealed
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">Updated {formatUpdatedAt(paper.updatedAt)}</p>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline" className="mt-3 min-h-10 w-full">
                    <Link href={`/mobile-past-papers/${encodeURIComponent(paper.paperId)}`}>
                      {paper.finished ? "Review completion" : "Resume paper"}
                    </Link>
                  </Button>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground grid gap-3 text-sm leading-6">
              <p>Past papers you start will appear here with their saved question position and completion state.</p>
              <Button asChild variant="outline" className="w-fit">
                <Link href="/mobile-study">Choose a course</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <RecentQuizAttempts />
      <LocalQuizPerformance />

      <Card className="rounded-lg border-white/70 bg-white/60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
        <CardContent className="flex items-start gap-3 pt-5 text-sm leading-6">
          <ListChecksIcon className="mt-0.5 size-5 shrink-0" />
          <p className="text-muted-foreground">
            Progress is based only on practice completed by this learner profile. Unfinished quizzes and papers remain resumable and are not counted as completed practice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
