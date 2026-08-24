"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COURSE_SELECTION_CHANGE_EVENT, loadCourseSelection } from "@/lib/course-selection";
import { summarizeMobilePractice } from "@/lib/mobile-practice-summary";
import { MOBILE_STUDY_STATE_CHANGE_EVENT, readMobilePastPaperProgresses } from "@/lib/mobile-study-state";
import { QUIZ_ATTEMPT_HISTORY_CHANGE_EVENT, readQuizAttemptHistory } from "@/lib/quiz-attempt-history";
import { BookOpenCheckIcon, FileTextIcon, ListChecksIcon, SmartphoneIcon } from "lucide-react";
import { useEffect, useState } from "react";

type ProfileStudySnapshot = {
  selectedCourseCount: number;
  quizAttemptCount: number;
  quizAveragePercentage: number;
  completedPastPaperCount: number;
  inProgressPastPaperCount: number;
  revealedPastPaperAnswerCount: number;
};

const emptySnapshot: ProfileStudySnapshot = {
  selectedCourseCount: 0,
  quizAttemptCount: 0,
  quizAveragePercentage: 0,
  completedPastPaperCount: 0,
  inProgressPastPaperCount: 0,
  revealedPastPaperAnswerCount: 0,
};

export function MobileProfileStudySummary() {
  const [snapshot, setSnapshot] = useState<ProfileStudySnapshot | null>(null);

  useEffect(() => {
    function syncSnapshot() {
      const selection = loadCourseSelection();
      const practice = summarizeMobilePractice(readQuizAttemptHistory(), readMobilePastPaperProgresses());

      setSnapshot({
        selectedCourseCount: selection.selectedCourseIds.length,
        quizAttemptCount: practice.quizAttemptCount,
        quizAveragePercentage: practice.quizAveragePercentage,
        completedPastPaperCount: practice.completedPastPaperCount,
        inProgressPastPaperCount: practice.inProgressPastPaperCount,
        revealedPastPaperAnswerCount: practice.revealedPastPaperAnswerCount,
      });
    }

    syncSnapshot();
    window.addEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSnapshot);
    window.addEventListener(QUIZ_ATTEMPT_HISTORY_CHANGE_EVENT, syncSnapshot);
    window.addEventListener(MOBILE_STUDY_STATE_CHANGE_EVENT, syncSnapshot);
    window.addEventListener("storage", syncSnapshot);
    window.addEventListener("pageshow", syncSnapshot);

    return () => {
      window.removeEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSnapshot);
      window.removeEventListener(QUIZ_ATTEMPT_HISTORY_CHANGE_EVENT, syncSnapshot);
      window.removeEventListener(MOBILE_STUDY_STATE_CHANGE_EVENT, syncSnapshot);
      window.removeEventListener("storage", syncSnapshot);
      window.removeEventListener("pageshow", syncSnapshot);
    };
  }, []);

  const data = snapshot ?? emptySnapshot;

  return (
    <Card className="rounded-lg border-white/70 bg-white/60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SmartphoneIcon className="size-5" />
          Study data on this device
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border bg-secondary/30 p-3">
            <BookOpenCheckIcon className="size-4" />
            <p className="mt-2 text-xl font-semibold">{snapshot ? data.selectedCourseCount : "—"}</p>
            <p className="text-muted-foreground text-xs">Selected courses</p>
          </div>
          <div className="rounded-lg border bg-secondary/30 p-3">
            <ListChecksIcon className="size-4" />
            <p className="mt-2 text-xl font-semibold">{snapshot ? data.quizAttemptCount : "—"}</p>
            <p className="text-muted-foreground text-xs">
              Quiz attempts{data.quizAttemptCount > 0 ? ` · ${data.quizAveragePercentage}% avg` : ""}
            </p>
          </div>
          <div className="rounded-lg border bg-secondary/30 p-3">
            <FileTextIcon className="size-4" />
            <p className="mt-2 text-xl font-semibold">{snapshot ? data.completedPastPaperCount : "—"}</p>
            <p className="text-muted-foreground text-xs">Past papers completed</p>
          </div>
          <div className="rounded-lg border bg-secondary/30 p-3">
            <FileTextIcon className="size-4" />
            <p className="mt-2 text-xl font-semibold">{snapshot ? data.inProgressPastPaperCount : "—"}</p>
            <p className="text-muted-foreground text-xs">Past papers in progress</p>
          </div>
        </div>
        <p className="text-muted-foreground text-xs leading-5">
          {data.revealedPastPaperAnswerCount > 0
            ? `${data.revealedPastPaperAnswerCount} past-paper model ${data.revealedPastPaperAnswerCount === 1 ? "answer has" : "answers have"} been revealed for this profile. `
            : ""}
          Logging out keeps this profile&apos;s saved study data isolated on this device. Deleting the local profile removes its selected courses, quiz history, unfinished quiz state, and past-paper progress.
        </p>
      </CardContent>
    </Card>
  );
}
