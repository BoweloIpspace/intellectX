"use client";

import { MixedQuizPlayer } from "@/components/education/mixed-quiz-player";
import { PageShell } from "@/components/education/page-shell";
import { SecureQuizPlayer } from "@/components/education/secure-quiz-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Quiz } from "@/data/quizzes";
import { isMobileAppRuntime } from "@/lib/feature-scope";
import { writeMobileStudyActivity } from "@/lib/mobile-study-state";
import Link from "next/link";
import { useEffect, useState } from "react";

type QuizPageContentProps = {
  quiz: Quiz;
  courseId: string;
  mobileRequested: boolean;
  mobileReturnHref?: string;
  mobileReturnLabel?: string;
};

export function QuizPageContent({
  quiz,
  courseId,
  mobileRequested,
  mobileReturnHref,
  mobileReturnLabel,
}: QuizPageContentProps) {
  const [nativeMobile, setNativeMobile] = useState(false);

  useEffect(() => {
    setNativeMobile(isMobileAppRuntime());
  }, []);

  const mobileSurface = mobileRequested || nativeMobile;
  const hasStructuredQuestions = quiz.questions.some((question) => question.choices.length === 0);

  useEffect(() => {
    if (!mobileSurface) return;

    writeMobileStudyActivity({
      kind: "quiz",
      href: `${window.location.pathname}${window.location.search}`,
      title: quiz.title,
      subtitle: "Continue your in-progress quiz",
      courseId,
      quizId: quiz.id,
      updatedAt: Date.now(),
    });
  }, [courseId, mobileSurface, quiz.id, quiz.title]);

  const returnHref = mobileSurface
    ? mobileReturnHref ?? `/mobile-study/${encodeURIComponent(courseId)}`
    : `/courses/${courseId}`;
  const returnLabel = mobileReturnLabel ?? "Back to course";

  return (
    <PageShell surface={mobileSurface ? "mobile" : "web"}>
      <section className={mobileSurface ? "w-full" : "mx-auto max-w-3xl"}>
        <Badge variant="secondary" className={mobileSurface ? "mb-3" : "mb-5"}>
          Quiz
        </Badge>
        <h1
          className={
            mobileSurface
              ? "mb-2 text-2xl leading-[1.1] font-medium tracking-tight"
              : "mb-4 text-4xl leading-[1.1] font-medium tracking-tight md:text-6xl"
          }
        >
          {quiz.title}
        </h1>
        <p className={mobileSurface ? "text-muted-foreground mb-4 text-sm leading-5" : "text-muted-foreground mb-8 leading-6"}>
          {mobileSurface
            ? hasStructuredQuestions
              ? "Multiple-choice questions use the timed quiz flow. Structured questions let you reveal the model answer after working them out."
              : "Choose an answer, use the timer, check your result, then continue to the next question."
            : "Select an answer, check your result, and use the feedback to close the learning loop. Completed attempts are saved so your scores and learning activity can appear across IntellectX."}
        </p>
        <div className={mobileSurface ? "mobile-quiz-player" : undefined}>
          {mobileSurface && hasStructuredQuestions ? (
            <MixedQuizPlayer quiz={quiz} />
          ) : (
            <SecureQuizPlayer quiz={quiz} surface={mobileSurface ? "mobile" : "web"} />
          )}
        </div>
        <Button className="mt-4 min-h-11" variant="ghost" asChild>
          <Link href={returnHref}>{returnLabel}</Link>
        </Button>
      </section>
    </PageShell>
  );
}
