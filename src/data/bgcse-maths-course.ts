import type { Course } from "./courses";
import { APPROVED, PUBLISHED } from "../lib/course-workflow-policy";

export const BGCSE_MATHS_COURSE_ID = "bgcse-mathematics";
export const BGCSE_MATHS_TOPIC_1_ID = "bgcse-maths-t01";
export const BGCSE_MATHS_TOPIC_2_ID = "bgcse-maths-t02";
export const BGCSE_MATHS_TOPIC_3_ID = "bgcse-maths-t03";

export const bgcseMathsCourse: Course = {
  id: BGCSE_MATHS_COURSE_ID,
  slug: BGCSE_MATHS_COURSE_ID,
  title: "BGCSE Mathematics",
  description:
    "BGCSE Mathematics practice. Topics 1 to 3 cover core number skills, approximation and bounds, and algebraic manipulation and formulae with nine exam-style quizzes.",
  subject: "Mathematics",
  level: "Beginner",
  duration: "9 quizzes",
  progress: 0,
  lessonIds: [BGCSE_MATHS_TOPIC_1_ID, BGCSE_MATHS_TOPIC_2_ID, BGCSE_MATHS_TOPIC_3_ID],
  quizIds: [
    "bgcse-maths-t01-q1",
    "bgcse-maths-t01-q2",
    "bgcse-maths-t01-q3",
    "bgcse-maths-t01-q4",
    "bgcse-maths-t02-q1",
    "bgcse-maths-t02-q2",
    "bgcse-maths-t03-q1",
    "bgcse-maths-t03-q2",
    "bgcse-maths-t03-q3",
  ],
  accent: "from-cyan-500/20 via-white to-blue-400/20",
  reviewStatus: APPROVED,
  publicationStatus: PUBLISHED,
};
