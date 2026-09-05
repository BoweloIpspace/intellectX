import type { Lesson } from "./lessons";
import {
  BGCSE_MATHS_COURSE_ID,
  BGCSE_MATHS_TOPIC_4_ID,
  BGCSE_MATHS_TOPIC_5_ID,
  BGCSE_MATHS_TOPIC_6_ID,
} from "./bgcse-maths-course";

export const bgcseMathsTopic4And5Lessons: Lesson[] = [
  {
    id: BGCSE_MATHS_TOPIC_4_ID,
    courseId: BGCSE_MATHS_COURSE_ID,
    title: "Linear & Simultaneous Equations",
    duration: "4 quizzes",
    summary: "Form and solve linear equations and pairs of simultaneous equations, including BGCSE-style money and quantity problems.",
    content: [
      "Solve linear equations by keeping both sides balanced, including equations with brackets, fractions and the unknown on both sides.",
      "Translate word problems into equations before solving, then check that the answer makes sense in the original context.",
      "Solve simultaneous equations by elimination or substitution and verify the ordered pair in both equations.",
      "Use simultaneous equations in BGCSE-style cost, coin, ticket and quantity problems where two unknown values must be found together.",
    ],
    nextLessonId: BGCSE_MATHS_TOPIC_5_ID,
  },
  {
    id: BGCSE_MATHS_TOPIC_5_ID,
    courseId: BGCSE_MATHS_COURSE_ID,
    title: "Quadratic Equations",
    duration: "2 quizzes",
    summary: "Solve quadratic equations and apply them to BGCSE-style rate, time, area and consecutive-number problems.",
    content: [
      "Solve factorisable quadratics by bringing all terms to one side, factorising and setting each factor equal to zero.",
      "Use the quadratic formula when a quadratic does not factorise conveniently, and round only at the end of the calculation.",
      "Reject roots that are impossible in context, such as negative times, lengths or speeds.",
      "Form quadratic equations from rate-time, area and number problems, then solve and interpret the valid solution.",
    ],
    nextLessonId: BGCSE_MATHS_TOPIC_6_ID,
  },
];
