"use client";

import { elevatedGlassCardClassName } from "@/components/education/glass-card";
import { ProgressBar } from "@/components/education/progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Quiz } from "@/data/quizzes";
import { readQuizAttemptHistory, writeQuizAttemptHistory } from "@/lib/quiz-attempt-history";
import { cn } from "@/lib/utils";
import { CheckCircle2Icon, CircleIcon, RotateCcwIcon, XCircleIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type MixedQuizQuestion = Quiz["questions"][number] & {
  diagramPath?: string;
  diagramAlt?: string;
};

type QuizQuestionFeedback = {
  questionId: string;
  answerIndex: number;
  explanation: string;
  correct: boolean;
};

type StructuredAnswer = {
  questionId: string;
  modelAnswer: string;
};

type QuizAttemptResult = {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: number;
  answers: number[];
  questionResults: QuizQuestionFeedback[];
};

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 250;

function isStructuredQuestion(question: MixedQuizQuestion) {
  return question.choices.length === 0;
}

function parseEstimatedTimeInSeconds(value: string) {
  const minutes = value.match(/(\d+(?:\.\d+)?)\s*(?:m|min|minute|minutes)/i);
  if (minutes) return Math.max(1, Math.round(Number(minutes[1]) * 60));

  const seconds = value.match(/(\d+(?:\.\d+)?)\s*(?:s|sec|second|seconds)/i);
  if (seconds) return Math.max(1, Math.round(Number(seconds[1])));

  return 5 * 60;
}

function formatQuizTime(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  return `${Math.floor(safe / 60)}:${(safe % 60).toString().padStart(2, "0")}`;
}

function createSubmissionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `quiz-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function postGrading<TResult>(body: Record<string, unknown>): Promise<TResult> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    let response: Response;
    try {
      response = await fetch("/api/quiz-grading", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      if (attempt === MAX_ATTEMPTS) throw new Error("Connection problem. Your quiz progress is still on this device.");
      await new Promise((resolve) => window.setTimeout(resolve, RETRY_DELAY_MS * attempt));
      continue;
    }

    const payload = (await response.json().catch(() => ({}))) as { error?: unknown } & TResult;
    if (response.ok) return payload;

    const message = typeof payload.error === "string" ? payload.error : "Unable to continue this quiz right now.";
    if (response.status < 500 && response.status !== 429) throw new Error(message);
    if (attempt === MAX_ATTEMPTS) throw new Error(message);
    await new Promise((resolve) => window.setTimeout(resolve, RETRY_DELAY_MS * attempt));
  }

  throw new Error("Unable to continue this quiz right now.");
}

export function MixedQuizPlayer({ quiz }: { quiz: Quiz }) {
  const questions = quiz.questions as MixedQuizQuestion[];
  const initialTime = useMemo(() => parseEstimatedTimeInSeconds(quiz.estimatedTime), [quiz.estimatedTime]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() => questions.map(() => -1));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<QuizQuestionFeedback | null>(null);
  const [structuredAnswer, setStructuredAnswer] = useState<StructuredAnswer | null>(null);
  const [results, setResults] = useState<QuizAttemptResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const submissionIdRef = useRef(createSubmissionId());
  const deadlineRef = useRef(Date.now() + initialTime * 1000);
  const completionGuard = useRef(false);

  const question = questions[currentIndex];
  const structured = question ? isStructuredQuestion(question) : false;
  const progress = questions.length > 0 ? ((currentIndex + (results ? 1 : 0)) / questions.length) * 100 : 0;

  const finishQuiz = useCallback(
    async (timedOut = false) => {
      if (completionGuard.current || results || questions.length === 0) return;
      completionGuard.current = true;
      setBusy(true);
      setErrorMessage(null);

      try {
        const result = await postGrading<QuizAttemptResult>({
          action: "submit",
          quizId: quiz.id,
          submissionId: submissionIdRef.current,
          answers,
        });
        writeQuizAttemptHistory([
          {
            quizId: result.quizId,
            quizTitle: result.quizTitle,
            score: result.score,
            totalQuestions: result.totalQuestions,
            percentage: result.percentage,
            completedAt: new Date(result.completedAt).toISOString(),
          },
          ...readQuizAttemptHistory(),
        ]);
        setResults(result);
        if (timedOut) setErrorMessage("Time expired. Your completed work was saved.");
      } catch (error) {
        completionGuard.current = false;
        setErrorMessage(error instanceof Error ? error.message : "Unable to save this quiz attempt.");
      } finally {
        setBusy(false);
      }
    },
    [answers, questions.length, quiz.id, results],
  );

  useEffect(() => {
    if (results) return;
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        window.clearInterval(timer);
        void finishQuiz(true);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [finishQuiz, results]);

  async function checkAnswer() {
    if (!question || structured || selectedIndex === null || busy) return;
    setBusy(true);
    setErrorMessage(null);
    try {
      const checked = await postGrading<QuizQuestionFeedback>({
        action: "check",
        quizId: quiz.id,
        questionId: question.id,
        answer: selectedIndex,
      });
      setFeedback(checked);
      setAnswers((current) => current.map((value, index) => (index === currentIndex ? selectedIndex : value)));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to check this answer.");
    } finally {
      setBusy(false);
    }
  }

  async function revealAnswer() {
    if (!question || !structured || busy) return;
    setBusy(true);
    setErrorMessage(null);
    try {
      setStructuredAnswer(
        await postGrading<StructuredAnswer>({
          action: "reveal",
          quizId: quiz.id,
          questionId: question.id,
        }),
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to reveal this model answer.");
    } finally {
      setBusy(false);
    }
  }

  function goNext() {
    if (!question || busy) return;
    if (!structured && !feedback) return;

    if (currentIndex === questions.length - 1) {
      void finishQuiz();
      return;
    }

    setCurrentIndex((value) => value + 1);
    setSelectedIndex(null);
    setFeedback(null);
    setStructuredAnswer(null);
    setErrorMessage(null);
  }

  function restart() {
    setCurrentIndex(0);
    setAnswers(questions.map(() => -1));
    setSelectedIndex(null);
    setFeedback(null);
    setStructuredAnswer(null);
    setResults(null);
    setErrorMessage(null);
    setBusy(false);
    submissionIdRef.current = createSubmissionId();
    deadlineRef.current = Date.now() + initialTime * 1000;
    completionGuard.current = false;
    setTimeLeft(initialTime);
  }

  if (!question) {
    return (
      <Card className={`rounded-lg ${elevatedGlassCardClassName}`}>
        <CardContent className="py-6 text-sm text-muted-foreground">No questions are published for this quiz yet.</CardContent>
      </Card>
    );
  }

  if (results) {
    const hasMcq = results.totalQuestions > 0;
    return (
      <Card className={`rounded-lg ${elevatedGlassCardClassName}`}>
        <CardHeader>
          <p className="text-sm text-muted-foreground">Final results</p>
          <h2 className="text-3xl font-semibold tracking-tight">
            {hasMcq ? `${results.percentage}% score` : "Structured review complete"}
          </h2>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm leading-6 text-muted-foreground">
            {hasMcq
              ? `You answered ${results.score} of ${results.totalQuestions} multiple-choice questions correctly. Structured questions are reviewed separately and are not auto-graded.`
              : "This quiz contained structured review questions only. Model answers are available on demand rather than auto-graded."}
          </p>
          <div className="grid gap-3">
            {questions.map((item) => {
              const itemStructured = isStructuredQuestion(item);
              const result = results.questionResults.find((entry) => entry.questionId === item.id);
              const answer = results.answers[questions.findIndex((entry) => entry.id === item.id)];
              return (
                <div key={item.id} className="rounded-lg bg-secondary/40 p-4 text-sm">
                  <p className="font-medium">{item.prompt}</p>
                  {itemStructured ? (
                    <p className="mt-2 text-muted-foreground">Structured question · reviewed on demand</p>
                  ) : (
                    <div className="mt-2 space-y-1">
                      <p className={result?.correct ? "text-success" : "text-destructive"}>
                        {result?.correct ? "Correct" : "Not quite"}
                      </p>
                      <p className="text-muted-foreground">
                        Your answer: {answer >= 0 ? item.choices[answer] : "No answer selected"}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <Button variant="outline" onClick={restart}>
            <RotateCcwIcon className="size-4" />
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`rounded-lg ${elevatedGlassCardClassName}`}>
      <CardHeader>
        <div className="mb-2 space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span className={cn("font-medium", timeLeft <= 60 && "text-destructive")}>Time left: {formatQuizTime(timeLeft)}</span>
          </div>
          <ProgressBar value={progress} />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">{question.prompt}</h2>
        {question.diagramPath ? (
          <Image
            src={question.diagramPath}
            alt={question.diagramAlt?.trim() || "Question diagram"}
            width={1200}
            height={800}
            unoptimized
            className="mt-5 h-auto w-full object-contain grayscale contrast-125 dark:invert"
          />
        ) : null}
      </CardHeader>
      <CardContent className="space-y-5">
        {structured ? (
          <div className="space-y-4">
            <p className="text-sm leading-6 text-muted-foreground">
              Work out your response first. Reveal the model answer only when you are ready to compare.
            </p>
            {structuredAnswer ? (
              <div className="border-l-2 border-foreground/70 pl-4 text-sm leading-6">
                <p className="font-semibold">Model answer</p>
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{structuredAnswer.modelAnswer}</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-3" role="radiogroup" aria-label={`Question ${currentIndex + 1} choices`}>
            {question.choices.map((choice, index) => {
              const selected = selectedIndex === index;
              const correct = Boolean(feedback && feedback.answerIndex === index);
              const incorrect = Boolean(feedback && selected && feedback.answerIndex !== index);
              return (
                <button
                  key={`${question.id}-${choice}`}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={Boolean(feedback) || busy}
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "flex min-h-14 w-full items-center gap-3 rounded-lg border bg-white/70 px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-card/70",
                    selected && "border-primary bg-secondary/70",
                    correct && "border-success bg-success/10",
                    incorrect && "border-destructive bg-destructive/10",
                  )}
                >
                  {correct ? <CheckCircle2Icon className="size-5 shrink-0 text-success" /> : incorrect ? <XCircleIcon className="size-5 shrink-0 text-destructive" /> : <CircleIcon className="size-5 shrink-0 text-muted-foreground" />}
                  <span>{choice}</span>
                </button>
              );
            })}
          </div>
        )}

        {feedback ? (
          <div className="rounded-lg bg-secondary/60 p-4 text-sm leading-6">
            <p className="font-semibold">{feedback.correct ? "Correct" : "Not quite yet"}</p>
            {feedback.explanation ? <p className="mt-1 text-muted-foreground">{feedback.explanation}</p> : null}
          </div>
        ) : null}

        {errorMessage ? <p className="text-sm text-destructive" role="alert">{errorMessage}</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          {structured && !structuredAnswer ? (
            <Button variant="outline" className="min-h-12" disabled={busy} onClick={() => void revealAnswer()}>
              {busy ? "Loading answer..." : "Reveal answer"}
            </Button>
          ) : null}
          {!structured && !feedback ? (
            <Button className="min-h-12" disabled={selectedIndex === null || busy} onClick={() => void checkAnswer()}>
              {busy ? "Checking..." : "Submit answer"}
            </Button>
          ) : null}
          {(structured || feedback) ? (
            <Button className="min-h-12" disabled={busy} onClick={goNext}>
              {currentIndex === questions.length - 1 ? (busy ? "Saving..." : "See results") : "Next question"}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
