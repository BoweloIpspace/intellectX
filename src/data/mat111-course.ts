import type { Course } from "./courses";
import { APPROVED, PUBLISHED } from "../lib/course-workflow-policy";

export const MAT111_COURSE_ID = "mat111-introductory-mathematics-i";

export const mat111Course: Course = {
  id: MAT111_COURSE_ID,
  slug: MAT111_COURSE_ID,
  title: "MAT111 Introductory Mathematics I",
  description:
    "Lecture-note test course covering exponential and logarithmic functions, trigonometric functions of any angle, and complex numbers.",
  subject: "Mathematics",
  level: "Beginner",
  duration: "3 lecture notes",
  progress: 0,
  lessonIds: ["mat111-week-9", "mat111-week-11", "mat111-week-14"],
  quizIds: [
    "mat111-week9-exponential-foundations",
    "mat111-week9-logarithms",
    "mat111-week11-angle-values",
    "mat111-week11-reference-graphs",
    "mat111-week14-complex-basics",
    "mat111-week14-complex-operations",
  ],
  accent: "from-indigo-500/20 via-white to-cyan-400/20",
  reviewStatus: APPROVED,
  publicationStatus: PUBLISHED,
};
