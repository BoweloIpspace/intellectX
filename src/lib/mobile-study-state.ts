"use client";

export const MOBILE_STUDY_ACTIVITY_KEY = "intellectx:mobile-study-activity";
export const MOBILE_PAST_PAPER_PROGRESS_KEY = "intellectx:past-paper-progress";
export const MOBILE_QUIZ_PROGRESS_KEY = "intellectx:quiz-progress";
export const MOBILE_STUDY_STATE_CHANGE_EVENT = "intellectx:mobile-study-state-change";

export type MobileStudyActivity = {
  kind: "quiz" | "past-paper";
  href: string;
  title: string;
  subtitle?: string;
  courseId?: string;
  quizId?: string;
  paperId?: string;
  updatedAt: number;
};

export type MobilePastPaperProgress = {
  paperId: string;
  courseId: string;
  title: string;
  currentIndex: number;
  revealedQuestionIds: string[];
  finished: boolean;
  updatedAt: number;
};

export type MobileQuizFeedback = {
  questionId: string;
  answerIndex: number;
  explanation: string;
  correct: boolean;
};

export type MobileQuizProgress = {
  quizId: string;
  currentIndex: number;
  selectedIndex: number | null;
  submitted: boolean;
  answers: number[];
  feedback: MobileQuizFeedback | null;
  deadlineAt: number;
  submissionId: string;
  updatedAt: number;
};

function safeParse(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function dispatchStudyStateChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(MOBILE_STUDY_STATE_CHANGE_EVENT));
  }
}

export function readMobileStudyActivity(storage: Storage = window.localStorage): MobileStudyActivity | null {
  const parsed = safeParse(storage.getItem(MOBILE_STUDY_ACTIVITY_KEY));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

  const candidate = parsed as Partial<MobileStudyActivity>;
  if (
    (candidate.kind !== "quiz" && candidate.kind !== "past-paper") ||
    typeof candidate.href !== "string" ||
    typeof candidate.title !== "string" ||
    typeof candidate.updatedAt !== "number"
  ) {
    storage.removeItem(MOBILE_STUDY_ACTIVITY_KEY);
    return null;
  }

  return candidate as MobileStudyActivity;
}

export function writeMobileStudyActivity(activity: MobileStudyActivity, storage: Storage = window.localStorage) {
  storage.setItem(MOBILE_STUDY_ACTIVITY_KEY, JSON.stringify(activity));
  dispatchStudyStateChange();
}

export function clearMobileStudyActivity(storage: Storage = window.localStorage) {
  storage.removeItem(MOBILE_STUDY_ACTIVITY_KEY);
  dispatchStudyStateChange();
}

function readPastPaperProgressMap(storage: Storage): Record<string, MobilePastPaperProgress> {
  const parsed = safeParse(storage.getItem(MOBILE_PAST_PAPER_PROGRESS_KEY));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

  const valid: Record<string, MobilePastPaperProgress> = {};
  for (const [paperId, value] of Object.entries(parsed as Record<string, unknown>)) {
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    const candidate = value as Partial<MobilePastPaperProgress>;
    if (
      candidate.paperId === paperId &&
      typeof candidate.courseId === "string" &&
      typeof candidate.title === "string" &&
      typeof candidate.currentIndex === "number" &&
      Array.isArray(candidate.revealedQuestionIds) &&
      candidate.revealedQuestionIds.every((item) => typeof item === "string") &&
      typeof candidate.finished === "boolean" &&
      typeof candidate.updatedAt === "number"
    ) {
      valid[paperId] = candidate as MobilePastPaperProgress;
    }
  }
  return valid;
}

export function readMobilePastPaperProgress(
  paperId: string,
  storage: Storage = window.localStorage,
): MobilePastPaperProgress | null {
  return readPastPaperProgressMap(storage)[paperId] ?? null;
}

export function readMobilePastPaperProgresses(storage: Storage = window.localStorage) {
  return Object.values(readPastPaperProgressMap(storage)).sort((left, right) => right.updatedAt - left.updatedAt);
}

export function writeMobilePastPaperProgress(
  progress: MobilePastPaperProgress,
  storage: Storage = window.localStorage,
) {
  const map = readPastPaperProgressMap(storage);
  map[progress.paperId] = progress;
  storage.setItem(MOBILE_PAST_PAPER_PROGRESS_KEY, JSON.stringify(map));
  dispatchStudyStateChange();
}

export function clearMobilePastPaperProgress(paperId: string, storage: Storage = window.localStorage) {
  const map = readPastPaperProgressMap(storage);
  delete map[paperId];
  if (Object.keys(map).length === 0) {
    storage.removeItem(MOBILE_PAST_PAPER_PROGRESS_KEY);
  } else {
    storage.setItem(MOBILE_PAST_PAPER_PROGRESS_KEY, JSON.stringify(map));
  }
  dispatchStudyStateChange();
}

export function readMobileQuizProgress(quizId: string, storage: Storage = window.localStorage): MobileQuizProgress | null {
  const parsed = safeParse(storage.getItem(MOBILE_QUIZ_PROGRESS_KEY));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

  const candidate = parsed as Partial<MobileQuizProgress>;
  if (
    candidate.quizId !== quizId ||
    typeof candidate.currentIndex !== "number" ||
    !(candidate.selectedIndex === null || typeof candidate.selectedIndex === "number") ||
    typeof candidate.submitted !== "boolean" ||
    !Array.isArray(candidate.answers) ||
    !candidate.answers.every((item) => typeof item === "number") ||
    typeof candidate.deadlineAt !== "number" ||
    typeof candidate.submissionId !== "string" ||
    typeof candidate.updatedAt !== "number"
  ) {
    return null;
  }

  if (candidate.feedback !== null && candidate.feedback !== undefined) {
    const feedback = candidate.feedback as Partial<MobileQuizFeedback>;
    if (
      typeof feedback.questionId !== "string" ||
      typeof feedback.answerIndex !== "number" ||
      typeof feedback.explanation !== "string" ||
      typeof feedback.correct !== "boolean"
    ) {
      return null;
    }
  }

  return candidate as MobileQuizProgress;
}

export function writeMobileQuizProgress(progress: MobileQuizProgress, storage: Storage = window.localStorage) {
  storage.setItem(MOBILE_QUIZ_PROGRESS_KEY, JSON.stringify(progress));
  dispatchStudyStateChange();
}

export function clearMobileQuizProgress(storage: Storage = window.localStorage) {
  storage.removeItem(MOBILE_QUIZ_PROGRESS_KEY);
  dispatchStudyStateChange();
}
