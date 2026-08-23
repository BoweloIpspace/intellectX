import type { Quiz } from "@/data/quizzes";

// These small checks exist only to give the native course -> topic -> quiz flow
// a focused quiz for every seeded topic. They are intentionally kept out of
// the shared web quiz catalog so mobile navigation work cannot change web
// search, dashboard, or course behavior.
export const mobileTopicQuizzes: Quiz[] = [
  {
    id: "memory-systems-check",
    courseId: "ai-study-systems",
    lessonId: "memory-systems",
    title: "Memory Systems Check",
    difficulty: "Foundational",
    estimatedTime: "3 min",
    questions: [
      {
        id: "q1",
        prompt: "What should stay central when using AI-generated practice questions?",
        choices: [
          "The original source material and your own retrieval attempt.",
          "The longest possible AI response.",
          "Avoiding correction until the end of the term.",
          "Using only summaries instead of questions.",
        ],
        answerIndex: -1,
        explanation: "",
      },
    ],
  },
  {
    id: "weekly-review-check",
    courseId: "ai-study-systems",
    lessonId: "weekly-review",
    title: "Weekly Review Check",
    difficulty: "Foundational",
    estimatedTime: "3 min",
    questions: [
      {
        id: "q1",
        prompt: "What is the best output of a weekly review?",
        choices: [
          "A vague promise to study more.",
          "A small plan with priority topics, practice format, and protected time.",
          "A full rewrite of every note.",
          "Skipping topics that felt difficult.",
        ],
        answerIndex: -1,
        explanation: "",
      },
    ],
  },
  {
    id: "source-quality-check",
    courseId: "critical-thinking",
    lessonId: "source-quality",
    title: "Source Quality Check",
    difficulty: "Applied",
    estimatedTime: "3 min",
    questions: [
      {
        id: "q1",
        prompt: "Which source-checking habit matters most for high-stakes claims?",
        choices: [
          "Trust whichever summary is shortest.",
          "Check primary sources and dates.",
          "Ignore incentives if the writing sounds polished.",
          "Use only social proof.",
        ],
        answerIndex: -1,
        explanation: "",
      },
    ],
  },
  {
    id: "counterexamples-check",
    courseId: "critical-thinking",
    lessonId: "counterexamples",
    title: "Counterexamples Check",
    difficulty: "Applied",
    estimatedTime: "3 min",
    questions: [
      {
        id: "q1",
        prompt: "Why are counterexamples useful?",
        choices: [
          "They reveal where a claim needs boundaries or revision.",
          "They prove every claim is false.",
          "They replace evidence.",
          "They make arguments less precise.",
        ],
        answerIndex: -1,
        explanation: "",
      },
    ],
  },
  {
    id: "active-recall-check",
    courseId: "exam-accelerator",
    lessonId: "active-recall",
    title: "Active Recall Check",
    difficulty: "Challenge",
    estimatedTime: "3 min",
    questions: [
      {
        id: "q1",
        prompt: "What does active recall force you to do?",
        choices: [
          "Recognize familiar wording.",
          "Produce an answer before reviewing the explanation.",
          "Avoid mistakes entirely.",
          "Study only when confidence is high.",
        ],
        answerIndex: -1,
        explanation: "",
      },
    ],
  },
  {
    id: "timed-practice-check",
    courseId: "exam-accelerator",
    lessonId: "timed-practice",
    title: "Timed Practice Check",
    difficulty: "Challenge",
    estimatedTime: "3 min",
    questions: [
      {
        id: "q1",
        prompt: "What should you review after a timed practice set?",
        choices: [
          "Only the final score.",
          "Decisions, pacing, accuracy, and alternate paths.",
          "Nothing until exam day.",
          "Only questions you answered correctly.",
        ],
        answerIndex: -1,
        explanation: "",
      },
    ],
  },
];

export function getMobileTopicQuiz(id: string) {
  return mobileTopicQuizzes.find((quiz) => quiz.id === id);
}

export function isMobileTopicQuizId(id: string) {
  return mobileTopicQuizzes.some((quiz) => quiz.id === id);
}
