import type { MobilePastPaperProgress } from "@/lib/mobile-study-state";
import type { QuizAttemptHistoryItem } from "@/lib/quiz-attempt-history";

export type MobilePracticeSummary = {
  quizAttemptCount: number;
  quizAveragePercentage: number;
  pastPaperCount: number;
  completedPastPaperCount: number;
  inProgressPastPaperCount: number;
  revealedPastPaperAnswerCount: number;
  totalPracticeCount: number;
};

export function summarizeMobilePractice(
  quizAttempts: QuizAttemptHistoryItem[],
  pastPaperProgresses: MobilePastPaperProgress[],
): MobilePracticeSummary {
  const quizAttemptCount = quizAttempts.length;
  const quizAveragePercentage =
    quizAttemptCount > 0
      ? Math.round(quizAttempts.reduce((total, attempt) => total + attempt.percentage, 0) / quizAttemptCount)
      : 0;
  const completedPastPaperCount = pastPaperProgresses.filter((progress) => progress.finished).length;
  const inProgressPastPaperCount = pastPaperProgresses.length - completedPastPaperCount;
  const revealedPastPaperAnswerCount = pastPaperProgresses.reduce(
    (total, progress) => total + new Set(progress.revealedQuestionIds).size,
    0,
  );

  return {
    quizAttemptCount,
    quizAveragePercentage,
    pastPaperCount: pastPaperProgresses.length,
    completedPastPaperCount,
    inProgressPastPaperCount,
    revealedPastPaperAnswerCount,
    totalPracticeCount: quizAttemptCount + completedPastPaperCount,
  };
}
