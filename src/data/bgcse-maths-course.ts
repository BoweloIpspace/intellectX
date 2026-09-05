import type { Course } from "./courses";
import { APPROVED, PUBLISHED } from "../lib/course-workflow-policy";

export const BGCSE_MATHS_COURSE_ID = "bgcse-mathematics";
export const BGCSE_MATHS_TOPIC_1_ID = "bgcse-maths-t01";
export const BGCSE_MATHS_TOPIC_2_ID = "bgcse-maths-t02";
export const BGCSE_MATHS_TOPIC_3_ID = "bgcse-maths-t03";
export const BGCSE_MATHS_TOPIC_4_ID = "bgcse-maths-t04";
export const BGCSE_MATHS_TOPIC_5_ID = "bgcse-maths-t05";
export const BGCSE_MATHS_TOPIC_6_ID = "bgcse-maths-t06";
export const BGCSE_MATHS_TOPIC_7_ID = "bgcse-maths-t07";
export const BGCSE_MATHS_TOPIC_8_ID = "bgcse-maths-t08";

export const bgcseMathsCourse: Course = {
  id: BGCSE_MATHS_COURSE_ID,
  slug: BGCSE_MATHS_COURSE_ID,
  title: "BGCSE Mathematics",
  description:
    "BGCSE Mathematics practice. Topics 1 to 8 cover number, approximation and bounds, algebra, equations, quadratics, sequences, inequalities and linear programming, graphs, functions and coordinate geometry with twenty-four exam-style quizzes.",
  subject: "Mathematics",
  level: "Beginner",
  duration: "24 quizzes",
  progress: 0,
  lessonIds: [
    BGCSE_MATHS_TOPIC_1_ID,
    BGCSE_MATHS_TOPIC_2_ID,
    BGCSE_MATHS_TOPIC_3_ID,
    BGCSE_MATHS_TOPIC_4_ID,
    BGCSE_MATHS_TOPIC_5_ID,
    BGCSE_MATHS_TOPIC_6_ID,
    BGCSE_MATHS_TOPIC_7_ID,
    BGCSE_MATHS_TOPIC_8_ID,
  ],
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
    "bgcse-maths-t04-q1",
    "bgcse-maths-t04-q2",
    "bgcse-maths-t04-q3",
    "bgcse-maths-t04-q4",
    "bgcse-maths-t05-q1",
    "bgcse-maths-t05-q2",
    "bgcse-maths-t06-q1",
    "bgcse-maths-t06-q2",
    "bgcse-maths-t06-q3",
    "bgcse-maths-t07-q1",
    "bgcse-maths-t07-q2",
    "bgcse-maths-t07-q3",
    "bgcse-maths-t08-q1",
    "bgcse-maths-t08-q2",
    "bgcse-maths-t08-q3",
  ],
  accent: "from-cyan-500/20 via-white to-blue-400/20",
  reviewStatus: APPROVED,
  publicationStatus: PUBLISHED,
};
