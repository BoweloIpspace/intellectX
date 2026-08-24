import type { ContentAccessLevel } from "../lib/entitlements";

export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  diagramPath?: string;
  diagramAlt?: string;
};

export type Quiz = {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  difficulty: "Foundational" | "Applied" | "Challenge";
  estimatedTime: string;
  questions: QuizQuestion[];
  accessLevel?: ContentAccessLevel;
};

// Public fallback quiz data intentionally contains no real answer keys or
// explanations. Authoritative seed answers live under convex/ and are never
// shipped as pre-submission learner data.
export const quizzes: Quiz[] = [
  {
    id: "ai-study-systems-check",
    courseId: "ai-study-systems",
    lessonId: "prompting-for-learning",
    title: "AI Study Systems Check",
    difficulty: "Foundational",
    estimatedTime: "6 min",
    questions: [
      {
        id: "q1",
        prompt: "Which prompt pattern best supports learning?",
        choices: [
          "Give me the final answer only.",
          "Explain, question me, diagnose gaps, then suggest one next step.",
          "Rewrite my notes in a longer format.",
          "Summarize every topic with no follow-up.",
        ],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q2",
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
      {
        id: "q3",
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
    id: "critical-thinking-check",
    courseId: "critical-thinking",
    lessonId: "argument-maps",
    title: "Critical Thinking Check",
    difficulty: "Applied",
    estimatedTime: "7 min",
    questions: [
      {
        id: "q1",
        prompt: "What is the best first step when mapping an argument?",
        choices: [
          "Identify the main conclusion and the claims offered to support it.",
          "Decide whether you agree with the author.",
          "Rewrite every sentence in simpler words.",
          "Count how many examples appear.",
        ],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q2",
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
      {
        id: "q3",
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
    id: "exam-accelerator-check",
    courseId: "exam-accelerator",
    lessonId: "retrieval-loops",
    title: "Exam Accelerator Check",
    difficulty: "Challenge",
    estimatedTime: "8 min",
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
      {
        id: "q2",
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
      {
        id: "q3",
        prompt: "Which approach best improves weak topics after practice?",
        choices: [
          "Repeat the same easy questions until confidence rises.",
          "Diagnose the error, repair the concept, then retest under retrieval.",
          "Read the mark scheme without attempting again.",
          "Switch topics whenever a mistake feels uncomfortable.",
        ],
        answerIndex: -1,
        explanation: "",
      },
    ],
  },
];

export function getQuiz(id: string) {
  return quizzes.find((quiz) => quiz.id === id);
}

export function getQuizzesByCourse(courseId: string) {
  return quizzes.filter((quiz) => quiz.courseId === courseId);
}
