import type { Quiz } from "./quizzes";
import { MAT111_COURSE_ID } from "./mat111-course";

export const mat111Quizzes: Quiz[] = [
  {
    id: "mat111-week9-exponential-foundations",
    courseId: MAT111_COURSE_ID,
    lessonId: "mat111-week-9",
    title: "Exponential Foundations",
    difficulty: "Foundational",
    estimatedTime: "6 min",
    questions: [
      {
        id: "q1",
        prompt: "For f(x) = a^x to be an exponential function as defined in the lecture, which condition must the base satisfy?",
        choices: ["a > 0 and a != 1", "a < 0", "a = 1 only", "a can be any complex number"],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q2",
        prompt: "Evaluate f(x) = 2^x at x = -3.",
        choices: ["-8", "1/8", "8", "1/6"],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q3",
        prompt: "What is true about f(x) = a^x when a > 1?",
        choices: [
          "It is increasing on all real numbers.",
          "It is decreasing on all real numbers.",
          "Its range is all real numbers.",
          "Its y-intercept is (1, 0).",
        ],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q4",
        prompt: "For c > 0, describe the transformation from f(x) = a^x to h(x) = f(x + c) = a^(x + c).",
        choices: [],
        answerIndex: -1,
        explanation: "",
      },
    ],
  },
  {
    id: "mat111-week9-logarithms",
    courseId: MAT111_COURSE_ID,
    lessonId: "mat111-week-9",
    title: "Logarithms and Natural Logs",
    difficulty: "Applied",
    estimatedTime: "7 min",
    questions: [
      {
        id: "q1",
        prompt: "Which statement gives the inverse relationship between logarithmic and exponential form?",
        choices: [
          "y = log_a(x) if and only if x = a^y",
          "y = log_a(x) if and only if y = a^x",
          "y = log_a(x) if and only if x = y^a",
          "y = log_a(x) if and only if a = x^y",
        ],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q2",
        prompt: "Evaluate log_10(10000).",
        choices: ["2", "3", "4", "10"],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q3",
        prompt: "Which natural-log property is stated in the lecture for positive x and y?",
        choices: [
          "ln(xy) = ln(x) + ln(y)",
          "ln(xy) = ln(x)ln(y)",
          "ln(x/y) = ln(x) + ln(y)",
          "ln(x^y) = ln(x) + y",
        ],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q4",
        prompt: "State the domain, range, x-intercept, and vertical asymptote of f(x) = log_a(x), where a > 0 and a != 1.",
        choices: [],
        answerIndex: -1,
        explanation: "",
      },
    ],
  },
  {
    id: "mat111-week11-angle-values",
    courseId: MAT111_COURSE_ID,
    lessonId: "mat111-week-11",
    title: "Trig Values of Any Angle",
    difficulty: "Foundational",
    estimatedTime: "7 min",
    questions: [
      {
        id: "q1",
        prompt: "If (x, y) is on the terminal side of theta and r = sqrt(x^2 + y^2), what is sin(theta)?",
        choices: ["x/r", "y/r", "y/x", "r/y"],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q2",
        prompt: "For the point (-3, 4) on the terminal side of theta, what is cos(theta)?",
        choices: ["4/5", "-4/5", "3/5", "-3/5"],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q3",
        prompt: "Which sign pattern is correct in Quadrant III?",
        choices: [
          "sin positive, cos positive, tan positive",
          "sin positive, cos negative, tan negative",
          "sin negative, cos negative, tan positive",
          "sin negative, cos positive, tan negative",
        ],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q4",
        prompt: "A point (4, 3) lies on the terminal side of theta. Determine the exact values of all six trigonometric functions of theta.",
        choices: [],
        answerIndex: -1,
        explanation: "",
      },
    ],
  },
  {
    id: "mat111-week11-reference-graphs",
    courseId: MAT111_COURSE_ID,
    lessonId: "mat111-week-11",
    title: "Reference Angles and Trig Graphs",
    difficulty: "Applied",
    estimatedTime: "7 min",
    questions: [
      {
        id: "q1",
        prompt: "What is the reference angle for theta = 300 degrees?",
        choices: ["30 degrees", "45 degrees", "60 degrees", "120 degrees"],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q2",
        prompt: "Evaluate cos(4*pi/3).",
        choices: ["1/2", "-1/2", "sqrt(3)/2", "-sqrt(3)/2"],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q3",
        prompt: "What is the period of both sin(x) and cos(x)?",
        choices: ["pi/2", "pi", "2*pi", "4*pi"],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q4",
        prompt: "State the domain, range, period, and symmetry of the sine function f(x) = sin(x).",
        choices: [],
        answerIndex: -1,
        explanation: "",
      },
    ],
  },
  {
    id: "mat111-week14-complex-basics",
    courseId: MAT111_COURSE_ID,
    lessonId: "mat111-week-14",
    title: "Complex Number Basics",
    difficulty: "Foundational",
    estimatedTime: "6 min",
    questions: [
      {
        id: "q1",
        prompt: "What is i^2?",
        choices: ["1", "-1", "i", "-i"],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q2",
        prompt: "Which is the standard form of a complex number?",
        choices: ["a + bi", "ab + i", "a/b + i", "a + b"],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q3",
        prompt: "When are a + bi and c + di equal?",
        choices: [
          "When a = c and b = d",
          "When a = d and b = c",
          "When a + b = c + d only",
          "Whenever their real parts are equal",
        ],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q4",
        prompt: "For z = a + bi, state its complex conjugate and simplify z times its conjugate.",
        choices: [],
        answerIndex: -1,
        explanation: "",
      },
    ],
  },
  {
    id: "mat111-week14-complex-operations",
    courseId: MAT111_COURSE_ID,
    lessonId: "mat111-week-14",
    title: "Complex Number Operations",
    difficulty: "Applied",
    estimatedTime: "8 min",
    questions: [
      {
        id: "q1",
        prompt: "Evaluate (3 - i) + (2 + 3i).",
        choices: ["5 + 2i", "1 + 2i", "5 - 4i", "6 + 3i"],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q2",
        prompt: "Evaluate (2 - 3i)(4 + 3i).",
        choices: ["8 - 3i", "17 - 6i", "17 + 6i", "-1 - 6i"],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q3",
        prompt: "Write (2 + 3i)/(4 - 2i) in standard form.",
        choices: ["7/10 + (3/10)i", "7/10 - (3/10)i", "1 + i", "14 + 6i"],
        answerIndex: -1,
        explanation: "",
      },
      {
        id: "q4",
        prompt: "Write 2/(1 + i) - 3/(1 - i) in standard form.",
        choices: [],
        answerIndex: -1,
        explanation: "",
      },
    ],
  },
];

export function getMat111Quiz(id: string) {
  return mat111Quizzes.find((quiz) => quiz.id === id);
}

export function getMat111QuizzesByCourse(courseId: string) {
  return courseId === MAT111_COURSE_ID ? mat111Quizzes : [];
}
