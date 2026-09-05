import type { Lesson } from "./lessons";
import {
  BGCSE_MATHS_COURSE_ID,
  BGCSE_MATHS_TOPIC_6_ID,
  BGCSE_MATHS_TOPIC_7_ID,
  BGCSE_MATHS_TOPIC_8_ID,
} from "./bgcse-maths-course";

export const bgcseMathsTopic6To8Lessons: Lesson[] = [
  {
    id: BGCSE_MATHS_TOPIC_6_ID,
    courseId: BGCSE_MATHS_COURSE_ID,
    title: "Sequences & Patterns",
    duration: "3 quizzes",
    summary: "Recognise sequence rules, find nth terms, calculate particular terms and solve BGCSE-style pattern problems.",
    content: [
      "Use first differences to identify linear sequences and form nth-term rules such as an + b.",
      "Use second differences to recognise quadratic sequences and test a proposed nth-term expression against known terms.",
      "Substitute a term number into an nth-term formula, or set the formula equal to a given value and solve for n.",
      "Translate diagram and arrangement patterns into algebraic rules, then use those rules to predict later figures.",
    ],
    nextLessonId: BGCSE_MATHS_TOPIC_7_ID,
  },
  {
    id: BGCSE_MATHS_TOPIC_7_ID,
    courseId: BGCSE_MATHS_COURSE_ID,
    title: "Inequalities & Linear Programming",
    duration: "3 quizzes",
    summary: "Solve inequalities, form constraints from real situations and identify optimum values in BGCSE-style linear-programming problems.",
    content: [
      "Solve linear inequalities as you would equations, reversing the inequality sign when multiplying or dividing by a negative number.",
      "Translate phrases such as at least, at most, no more than and not less than into the correct inequality symbols.",
      "Form budget, capacity and quantity constraints from BGCSE-style contexts and simplify them before using them.",
      "Test feasible points against all constraints and compare objective values at boundary or corner points to find a maximum or minimum.",
    ],
    nextLessonId: BGCSE_MATHS_TOPIC_8_ID,
  },
  {
    id: BGCSE_MATHS_TOPIC_8_ID,
    courseId: BGCSE_MATHS_COURSE_ID,
    title: "Graphs, Functions & Coordinate Geometry",
    duration: "3 quizzes",
    summary: "Work with coordinates, straight-line equations, function values, graph intersections and gradients in BGCSE-style questions.",
    content: [
      "Use coordinates to calculate midpoint, distance and gradient, then form straight-line equations in the form y = mx + c.",
      "Substitute values into functions and use tables or factorised forms to identify roots and graph intercepts.",
      "Find intersections by equating two expressions for y, and interpret the resulting coordinates as points common to both graphs.",
      "Use tangent gradients and the relationship between parallel and perpendicular lines to solve coordinate-geometry problems.",
    ],
  },
];
