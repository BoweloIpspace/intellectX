"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Mat111ExpandedQuiz } from "@/data/mat111-mobile-study-types";
import { writeMobileStudyActivity } from "@/lib/mobile-study-state";
import { ArrowLeftIcon, ArrowRightIcon, CheckCircle2Icon, EyeIcon, RotateCcwIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Mat111MobileExpandedQuizPlayer({ quiz }: { quiz: Mat111ExpandedQuiz }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());
  const [finished, setFinished] = useState(false);
  const current = quiz.questions[currentIndex];
  const currentRevealed = current ? revealed.has(current.id) : false;

  useEffect(() => {
    if (finished) return;
    writeMobileStudyActivity({
      kind: "quiz",
      href: `/mobile-quizzes/${quiz.id}?course=${encodeURIComponent(quiz.courseId)}&topic=${encodeURIComponent(quiz.lessonId)}`,
      title: quiz.title,
      subtitle: `Question ${Math.min(currentIndex + 1, quiz.questions.length)} of ${quiz.questions.length}`,
      courseId: quiz.courseId,
      quizId: quiz.id,
      updatedAt: Date.now(),
    });
  }, [currentIndex, finished, quiz]);

  const topicHref = `/mobile-quizzes?course=${encodeURIComponent(quiz.courseId)}&topic=${encodeURIComponent(quiz.lessonId)}`;

  if (finished || !current) {
    return (
      <section className="space-y-4">
        <div className="rounded-2xl border border-border/70 bg-background/80 p-6 text-center">
          <CheckCircle2Icon className="mx-auto size-10" />
          <Badge variant="secondary" className="mt-4">Further questions complete</Badge>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">{quiz.title}</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            You worked through all {quiz.questions.length} source-grounded recall questions in this set.
          </p>
        </div>
        <Button
          className="min-h-12 w-full"
          onClick={() => {
            setCurrentIndex(0);
            setRevealed(new Set());
            setFinished(false);
          }}
        >
          <RotateCcwIcon className="size-4" />
          Try again
        </Button>
        <Button asChild variant="outline" className="min-h-12 w-full">
          <Link href={topicHref}>Back to 7 quizzes</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <Button asChild size="sm" variant="ghost" className="-ml-2">
        <Link href={topicHref}>
          <ArrowLeftIcon className="size-4" />
          7 quizzes
        </Link>
      </Button>

      <div className="rounded-2xl border border-border/70 bg-background/80 p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary">{quiz.difficulty}</Badge>
          <span className="text-muted-foreground text-xs font-medium">
            {currentIndex + 1}/{quiz.questions.length}
          </span>
        </div>
        <h1 className="mt-4 text-xl font-semibold tracking-tight">{quiz.title}</h1>
        <p className="mt-5 text-base leading-7">{current.prompt}</p>
        <p className="text-muted-foreground mt-4 text-sm leading-6">
          Work it out or say the rule from memory before revealing the lecture-note answer.
        </p>
      </div>

      {currentRevealed ? (
        <div className="rounded-2xl border border-border/70 bg-secondary/40 p-5">
          <Badge variant="outline">Lecture-note answer</Badge>
          <p className="mt-3 text-sm leading-6">{current.explanation}</p>
        </div>
      ) : (
        <Button
          variant="outline"
          className="min-h-12 w-full"
          onClick={() => setRevealed((items) => new Set([...items, current.id]))}
        >
          <EyeIcon className="size-4" />
          Reveal answer
        </Button>
      )}

      <Button
        className="min-h-12 w-full"
        disabled={!currentRevealed}
        onClick={() => {
          if (currentIndex >= quiz.questions.length - 1) {
            setFinished(true);
          } else {
            setCurrentIndex((value) => value + 1);
          }
        }}
      >
        {currentIndex >= quiz.questions.length - 1 ? "Finish quiz" : "Next question"}
        <ArrowRightIcon className="size-4" />
      </Button>
    </section>
  );
}
