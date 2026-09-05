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
export const BGCSE_MATHS_TOPIC_9_ID = "bgcse-maths-t09";
export const BGCSE_MATHS_TOPIC_10_ID = "bgcse-maths-t10";
export const BGCSE_MATHS_TOPIC_11_ID = "bgcse-maths-t11";
export const BGCSE_MATHS_TOPIC_12_ID = "bgcse-maths-t12";
export const BGCSE_MATHS_TOPIC_13_ID = "bgcse-maths-t13";
export const BGCSE_MATHS_TOPIC_14_ID = "bgcse-maths-t14";
export const BGCSE_MATHS_TOPIC_15_ID = "bgcse-maths-t15";
export const BGCSE_MATHS_TOPIC_16_ID = "bgcse-maths-t16";
export const BGCSE_MATHS_TOPIC_17_ID = "bgcse-maths-t17";
export const BGCSE_MATHS_TOPIC_18_ID = "bgcse-maths-t18";

export const bgcseMathsCourse: Course = {
  id: BGCSE_MATHS_COURSE_ID,
  slug: BGCSE_MATHS_COURSE_ID,
  title: "BGCSE Mathematics",
  description:
    "BGCSE Mathematics practice. Topics 1 to 18 cover number, approximation, algebra, equations, sequences, inequalities, graphs, rates and motion, constructions and loci, transformations, vectors, similarity and scale, trigonometry and bearings, circle geometry, mensuration, statistics and probability with fifty-five exam-style quizzes.",
  subject: "Mathematics",
  level: "Beginner",
  duration: "55 quizzes",
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
    BGCSE_MATHS_TOPIC_9_ID,
    BGCSE_MATHS_TOPIC_10_ID,
    BGCSE_MATHS_TOPIC_11_ID,
    BGCSE_MATHS_TOPIC_12_ID,
    BGCSE_MATHS_TOPIC_13_ID,
    BGCSE_MATHS_TOPIC_14_ID,
    BGCSE_MATHS_TOPIC_15_ID,
    BGCSE_MATHS_TOPIC_16_ID,
    BGCSE_MATHS_TOPIC_17_ID,
    BGCSE_MATHS_TOPIC_18_ID,
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
    "bgcse-maths-t09-q1",
    "bgcse-maths-t09-q2",
    "bgcse-maths-t09-q3",
    "bgcse-maths-t10-q1",
    "bgcse-maths-t10-q2",
    "bgcse-maths-t11-q1",
    "bgcse-maths-t11-q2",
    "bgcse-maths-t11-q3",
    "bgcse-maths-t12-q1",
    "bgcse-maths-t12-q2",
    "bgcse-maths-t12-q3",
    "bgcse-maths-t13-q1",
    "bgcse-maths-t13-q2",
    "bgcse-maths-t14-q1",
    "bgcse-maths-t14-q2",
    "bgcse-maths-t14-q3",
    "bgcse-maths-t14-q4",
    "bgcse-maths-t15-q1",
    "bgcse-maths-t15-q2",
    "bgcse-maths-t15-q3",
    "bgcse-maths-t16-q1",
    "bgcse-maths-t16-q2",
    "bgcse-maths-t16-q3",
    "bgcse-maths-t16-q4",
    "bgcse-maths-t17-q1",
    "bgcse-maths-t17-q2",
    "bgcse-maths-t17-q3",
    "bgcse-maths-t17-q4",
    "bgcse-maths-t18-q1",
    "bgcse-maths-t18-q2",
    "bgcse-maths-t18-q3",
  ],
  accent: "from-cyan-500/20 via-white to-blue-400/20",
  reviewStatus: APPROVED,
  publicationStatus: PUBLISHED,
};
