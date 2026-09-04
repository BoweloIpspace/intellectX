import type { Quiz } from "./quizzes";
import { BGCSE_MATHS_COURSE_ID, BGCSE_MATHS_TOPIC_3_ID } from "./bgcse-maths-course";

export const bgcseMathsTopic3Quizzes: Quiz[] = [
  {
    id: "bgcse-maths-t03-q1",
    courseId: BGCSE_MATHS_COURSE_ID,
    lessonId: BGCSE_MATHS_TOPIC_3_ID,
    title: "Topic 3 Quiz 1 - Expressions & Substitution",
    difficulty: "Foundational",
    estimatedTime: "12 min",
    questions: [
      { id: "q1", prompt: "Simplify 3x + 5x - 2.", choices: ["8x + 2", "8x - 2", "3x - 2", "8x - 7"], answerIndex: -1, explanation: "" },
      { id: "q2", prompt: "Expand 4(2x - 3).", choices: ["8x - 7", "6x - 12", "8x - 12", "8x + 12"], answerIndex: -1, explanation: "" },
      { id: "q3", prompt: "Simplify 3(2a + 5) - 4(a - 1).", choices: ["2a + 19", "2a + 11", "10a + 19", "2a - 19"], answerIndex: -1, explanation: "" },
      { id: "q4", prompt: "Factorise 12x + 18 completely.", choices: ["3(4x + 5)", "6(2x + 3)", "2(6x + 8)", "12(x + 18)"], answerIndex: -1, explanation: "" },
      { id: "q5", prompt: "Find the value of 3x + 2y when x = -2 and y = 5.", choices: ["-16", "4", "16", "-4"], answerIndex: -1, explanation: "" },
      { id: "q6", prompt: "Given p = 2a² - 3b, find p when a = 4 and b = 2.", choices: ["20", "24", "26", "38"], answerIndex: -1, explanation: "" },
      { id: "q7", prompt: "The circumference of a circle is C = 2πr. Find C when r = 7 cm, using π = 22/7.", choices: ["22 cm", "44 cm", "49 cm", "154 cm"], answerIndex: -1, explanation: "" },
      { id: "q8", prompt: "A book costs P18 and a pen costs P7. Write an expression for the total cost of n books and one pen.", choices: ["18 + n + 7", "25n", "18(n + 7)", "18n + 7"], answerIndex: -1, explanation: "" },
    ],
  },
  {
    id: "bgcse-maths-t03-q2",
    courseId: BGCSE_MATHS_COURSE_ID,
    lessonId: BGCSE_MATHS_TOPIC_3_ID,
    title: "Topic 3 Quiz 2 - Formulae & Rearrangement",
    difficulty: "Applied",
    estimatedTime: "16 min",
    questions: [
      { id: "q1", prompt: "Make x the subject of y = 3x + 5.", choices: ["(y + 5)/3", "(y - 5)/3", "3y - 5", "y/3 - 5"], answerIndex: -1, explanation: "" },
      { id: "q2", prompt: "The area of a triangle is A = 1/2 bh. Make h the subject.", choices: ["A/(2b)", "Ab/2", "2A/b", "2b/A"], answerIndex: -1, explanation: "" },
      { id: "q3", prompt: "The volume of a cylinder is V = πr²h. Make r the subject.", choices: ["√(V/(πh))", "V/(πh)", "√(πh/V)", "V/(πh²)"], answerIndex: -1, explanation: "" },
      { id: "q4", prompt: "The perimeter of a rectangle is P = 2l + 2w. Make l the subject.", choices: ["P - 2w", "P/2 + w", "2P - w", "P/2 - w"], answerIndex: -1, explanation: "" },
      { id: "q5", prompt: "An engine formula is H = d²N/16. Make d the subject.", choices: ["16H/N", "√(16H/N)", "√(HN/16)", "4HN"], answerIndex: -1, explanation: "" },
      { id: "q6", prompt: "Using H = d²N/16, find d when H = 47.05 and N = 8. Give your answer to 3 significant figures.", choices: ["8.70 cm", "9.70 cm", "10.7 cm", "94.1 cm"], answerIndex: -1, explanation: "" },
      { id: "q7", prompt: "Make b the subject of T = (a + b)/c.", choices: ["T/c - a", "c/(T - a)", "cT - a", "a - cT"], answerIndex: -1, explanation: "" },
      { id: "q8", prompt: "Use s = ut + 1/2 at² to find s when u = 5, a = 2 and t = 4.", choices: ["36", "28", "52", "24"], answerIndex: -1, explanation: "" },
    ],
  },
  {
    id: "bgcse-maths-t03-q3",
    courseId: BGCSE_MATHS_COURSE_ID,
    lessonId: BGCSE_MATHS_TOPIC_3_ID,
    title: "Topic 3 Quiz 3 - Algebraic Fractions & Mixed Practice",
    difficulty: "Challenge",
    estimatedTime: "18 min",
    questions: [
      { id: "q1", prompt: "Express 4/x + 3/(x - 2) as a single fraction.", choices: ["7/(2x - 2)", "(7x - 2)/(x(x - 2))", "(7x - 8)/(x(x - 2))", "(7x + 8)/(x(x - 2))"], answerIndex: -1, explanation: "" },
      { id: "q2", prompt: "Express 5/a - 2/(a + 1) as a single fraction.", choices: ["(3a - 5)/(a(a + 1))", "(3a + 5)/(a(a + 1))", "3/(2a + 1)", "(7a + 5)/(a(a + 1))"], answerIndex: -1, explanation: "" },
      { id: "q3", prompt: "Simplify 12x²y/(3xy²).", choices: ["4x/y", "4y/x", "4xy", "9x/y"], answerIndex: -1, explanation: "" },
      { id: "q4", prompt: "Simplify (x² - 9)/(x - 3), where x ≠ 3.", choices: ["x - 3", "x² + 3", "1", "x + 3"], answerIndex: -1, explanation: "" },
      { id: "q5", prompt: "Simplify (3/x) × (2x/5), where x ≠ 0.", choices: ["6x/5", "6/5", "5/6", "6/x"], answerIndex: -1, explanation: "" },
      { id: "q6", prompt: "Simplify (4a/3) ÷ (2a/9), where a ≠ 0.", choices: ["2", "3", "6", "8"], answerIndex: -1, explanation: "" },
      { id: "q7", prompt: "Given A = (p + q)/2, find A when p = 7.4 and q = 5.8.", choices: ["6.6", "13.2", "1.6", "3.3"], answerIndex: -1, explanation: "" },
      { id: "q8", prompt: "Given W = (3m - 2n)/5, find W when m = 8 and n = -1.", choices: ["4.4", "4.8", "5.0", "5.2"], answerIndex: -1, explanation: "" },
    ],
  },
];
