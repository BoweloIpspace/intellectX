import type { ContentAccessLevel } from "../lib/entitlements";
import {
  BGCSE_MATHS_COURSE_ID,
  BGCSE_MATHS_TOPIC_1_ID,
  BGCSE_MATHS_TOPIC_2_ID,
  BGCSE_MATHS_TOPIC_3_ID,
  BGCSE_MATHS_TOPIC_4_ID,
} from "./bgcse-maths-course";
import { bgcseMathsTopic4And5Lessons } from "./bgcse-maths-topic4-5-lessons";
import { bgcseMathsTopic6To8Lessons } from "./bgcse-maths-topic6-8-lessons";
import { bgcseMathsTopic9To11Lessons } from "./bgcse-maths-topic9-11-lessons";

export type LessonBlock =
  | { type: "text"; body: string }
  | { type: "keyTerm"; term: string; definition: string }
  | { type: "visualMemoryCard"; title: string; cue: string; detail: string }
  | { type: "tapReveal"; prompt: string; explanation: string }
  | { type: "checkpoint"; prompt: string; answer: string }
  | { type: "diagram"; title: string; description: string };

export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  videoUrl?: string;
  posterUrl?: string;
  summary: string;
  content: string[];
  blocks?: LessonBlock[];
  nextLessonId?: string;
  quizId?: string;
  accessLevel?: ContentAccessLevel;
};

export const lessons: Lesson[] = [
  {
    id: "prompting-for-learning",
    courseId: "ai-study-systems",
    title: "Prompting for Learning",
    duration: "18 min",
    posterUrl: "/app-image-1.png",
    summary: "Use AI prompts that explain, challenge, and test instead of simply producing answers.",
    content: [
      "A strong learning prompt gives the AI a role, a target outcome, and a constraint. Ask it to behave like a tutor who checks your understanding before moving on.",
      "Replace broad requests with focused loops: explain the concept, ask me two questions, identify my misconception, then give one next step.",
      "The goal is not faster answers. The goal is faster feedback, better practice, and a clearer view of what you still need to learn.",
    ],
    blocks: [
      { type: "text", body: "Before asking AI for help, write down what you already understand. This keeps the session anchored in your thinking." },
      { type: "keyTerm", term: "Learning loop", definition: "A prompt pattern that asks AI to explain, question, diagnose, and suggest one next practice step." },
      { type: "visualMemoryCard", title: "Tutor, not answer machine", cue: "Explain -> Ask -> Diagnose -> Practice", detail: "Use the loop whenever you catch yourself asking for final answers too quickly." },
      { type: "tapReveal", prompt: "Why should the AI ask you questions before giving more explanation?", explanation: "Questions reveal what you can retrieve, which makes feedback more accurate and memorable." },
      { type: "checkpoint", prompt: "Write one prompt that asks AI to test your understanding of this lesson.", answer: "A strong answer includes a tutor role, two questions, misconception detection, and one next step." },
      { type: "diagram", title: "Prompt flow", description: "Start with the goal, add constraints, request questions, then review the feedback." },
    ],
    nextLessonId: "memory-systems",
    quizId: "ai-study-systems-check",
  },
  {
    id: "memory-systems",
    courseId: "ai-study-systems",
    title: "Memory Systems",
    duration: "22 min",
    posterUrl: "/app-image-1.png",
    summary: "Combine spaced repetition and active recall into a weekly routine.",
    content: [
      "Memory improves when retrieval is effortful. Close the notes, answer from memory, then compare your answer against the source.",
      "Use AI to generate varied recall questions from your notes, but keep the final judgment with the source material.",
      "Schedule reviews before confidence drops too far. A light review at the right time beats a long review after forgetting everything.",
    ],
    nextLessonId: "weekly-review",
    quizId: "ai-study-systems-check",
  },
  {
    id: "weekly-review",
    courseId: "ai-study-systems",
    title: "Weekly Review",
    duration: "16 min",
    posterUrl: "/app-image-1.png",
    summary: "Convert study activity into decisions for the next week.",
    content: [
      "Your weekly review should answer three questions: what improved, what stayed difficult, and what deserves deliberate practice next.",
      "Look for patterns rather than isolated scores. Repeated hesitation on the same concept is a signal to revisit the foundation.",
      "End with a small plan. Pick two priority topics, one practice format, and a time block you can realistically protect.",
    ],
    quizId: "ai-study-systems-check",
  },
  {
    id: "argument-maps",
    courseId: "critical-thinking",
    title: "Argument Maps",
    duration: "24 min",
    posterUrl: "/app-image-1.png",
    summary: "Break claims into evidence, assumptions, objections, and implications.",
    content: [
      "An argument map separates the main claim from the reasons that support it. This makes weak links easier to spot.",
      "Ask AI to restate an argument as claim, evidence, assumption, and possible objection. Then inspect whether the restatement is fair.",
      "Good critical thinking is not reflexive disagreement. It is disciplined curiosity about how a conclusion is being supported.",
    ],
    nextLessonId: "source-quality",
    quizId: "critical-thinking-check",
  },
  {
    id: "source-quality",
    courseId: "critical-thinking",
    title: "Source Quality",
    duration: "20 min",
    posterUrl: "/app-image-1.png",
    summary: "Evaluate credibility, incentive, recency, and evidence strength.",
    content: [
      "Source quality depends on expertise, transparency, incentives, and whether the claim is backed by evidence you can inspect.",
      "AI can help compare sources, but it can also smooth over uncertainty. Ask for confidence levels and reasons for uncertainty.",
      "When stakes are high, use primary sources and check dates. A polished summary is not a substitute for reliable evidence.",
    ],
    nextLessonId: "counterexamples",
    quizId: "critical-thinking-check",
  },
  {
    id: "counterexamples",
    courseId: "critical-thinking",
    title: "Counterexamples",
    duration: "19 min",
    posterUrl: "/app-image-1.png",
    summary: "Stress-test ideas by searching for cases that would make them false.",
    content: [
      "A counterexample is useful because it reveals the boundary of a rule. It shows where a claim needs revision.",
      "Ask AI for the strongest counterexample to your current answer, then decide whether it actually applies.",
      "This habit makes your conclusions more precise and your confidence better calibrated.",
    ],
    quizId: "critical-thinking-check",
  },
  {
    id: "diagnostic-review",
    courseId: "exam-accelerator",
    title: "Diagnostic Review",
    duration: "26 min",
    posterUrl: "/app-image-1.png",
    summary: "Find the highest-value gaps before building an exam plan.",
    content: [
      "Start with a timed diagnostic, not a reread. Performance under realistic conditions shows where attention should go.",
      "Group misses by cause: knowledge gap, careless error, time pressure, or misunderstood wording.",
      "Your study plan should spend the most time where improvement is both likely and valuable.",
    ],
    nextLessonId: "active-recall",
    quizId: "exam-accelerator-check",
  },
  {
    id: "active-recall",
    courseId: "exam-accelerator",
    title: "Active Recall",
    duration: "28 min",
    posterUrl: "/app-image-1.png",
    summary: "Practice producing answers before reviewing explanations.",
    content: [
      "Active recall works because it forces the brain to retrieve, not recognize. Recognition feels fluent but can hide weak memory.",
      "Use short sessions with immediate correction. The cycle is attempt, compare, explain the miss, and retry later.",
      "AI is best used as a practice generator and feedback partner, not as a shortcut around the attempt.",
    ],
    nextLessonId: "timed-practice",
    quizId: "exam-accelerator-check",
  },
  {
    id: "timed-practice",
    courseId: "exam-accelerator",
    title: "Timed Practice",
    duration: "31 min",
    posterUrl: "/app-image-1.png",
    summary: "Build accuracy and pacing with deliberate timed sets.",
    content: [
      "Timed practice reveals tradeoffs between speed and accuracy. Track both, because either one can limit your score.",
      "After each set, review decisions rather than only answers. Ask why you chose a path and where another path was faster.",
      "Raise difficulty gradually. Confidence grows when challenge is real but still within reach.",
    ],
    quizId: "exam-accelerator-check",
  },
  {
    id: BGCSE_MATHS_TOPIC_1_ID,
    courseId: BGCSE_MATHS_COURSE_ID,
    title: "Number, Money, Fractions, Percentages, Ratio & Proportion",
    duration: "4 quizzes",
    summary: "Practice the core number skills used throughout BGCSE Mathematics Topic 1.",
    content: [
      "Convert between fractions, decimals and percentages, and simplify fractions and ratios before calculating.",
      "Solve percentage and money problems including discounts, profit, loss, percentage change and reverse percentages.",
      "Use ratio and direct proportion to share quantities, compare amounts and scale real-world rates.",
      "Apply number skills in BGCSE exam-style contexts while keeping units, rounding and the size of the answer sensible.",
    ],
    nextLessonId: BGCSE_MATHS_TOPIC_2_ID,
  },
  {
    id: BGCSE_MATHS_TOPIC_2_ID,
    courseId: BGCSE_MATHS_COURSE_ID,
    title: "Approximation, Accuracy, Bounds & Units",
    duration: "2 quizzes",
    summary: "Round, estimate, convert units and use upper and lower bounds in BGCSE-style calculations.",
    content: [
      "Round values to decimal places and significant figures, and use sensible rounded values to estimate calculations.",
      "Convert common metric units accurately before combining quantities in a calculation.",
      "Translate a rounded measurement into its lower and upper bounds, remembering that the upper boundary is not included.",
      "Use the correct combination of bounds to find maximum or minimum possible values for speed, area and volume.",
    ],
    nextLessonId: BGCSE_MATHS_TOPIC_3_ID,
  },
  {
    id: BGCSE_MATHS_TOPIC_3_ID,
    courseId: BGCSE_MATHS_COURSE_ID,
    title: "Algebraic Manipulation & Formulae",
    duration: "3 quizzes",
    summary: "Simplify and manipulate algebraic expressions, substitute into formulae, rearrange formulae and work with algebraic fractions.",
    content: [
      "Collect like terms, expand brackets and factorise common factors before substituting numerical values.",
      "Substitute carefully into formulae, keeping negative values and powers inside brackets where needed.",
      "Change the subject of a formula by applying inverse operations in a clear order, including square roots when the subject is squared.",
      "Combine and simplify algebraic fractions using common denominators and cancellation while keeping denominator restrictions in mind.",
    ],
    nextLessonId: BGCSE_MATHS_TOPIC_4_ID,
  },
  ...bgcseMathsTopic4And5Lessons,
  ...bgcseMathsTopic6To8Lessons,
  ...bgcseMathsTopic9To11Lessons,
];

export function getLesson(id: string) {
  return lessons.find((lesson) => lesson.id === id);
}

export function getLessonsByCourse(courseId: string) {
  return lessons.filter((lesson) => lesson.courseId === courseId);
}
