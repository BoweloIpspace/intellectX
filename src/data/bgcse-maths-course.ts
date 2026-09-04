import type { Course } from "./courses";
import { APPROVED, PUBLISHED } from "../lib/course-workflow-policy";

export const BGCSE_MATHS_COURSE_ID = "bgcse-mathematics";

export const bgcseMathsCourse: Course = {
  id: BGCSE_MATHS_COURSE_ID,
  slug: BGCSE_MATHS_COURSE_ID,
  title: "BGCSE Mathematics",
  description:
    "BGCSE Mathematics practice. Topic 1 covers number, money, fractions, percentages, ratio and proportion with four exam-style quizzes.",
  subject: "Mathematics",
  level: "Beginner",
  duration: "4 quizzes",
  progress: 0,
  lessonIds: [],
  quizIds: [
    "bgcse-maths-t01-q1",
    "bgcse-maths-t01-q2",
    "bgcse-maths-t01-q3",
    "bgcse-maths-t01-q4",
  ],
  accent: "from-cyan-500/20 via-white to-blue-400/20",
  reviewStatus: APPROVED,
  publicationStatus: PUBLISHED,
};
