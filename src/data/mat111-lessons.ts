import type { Lesson } from "./lessons";
import { MAT111_COURSE_ID } from "./mat111-course";

export const mat111Lessons: Lesson[] = [
  {
    id: "mat111-week-9",
    courseId: MAT111_COURSE_ID,
    title: "Exponential and Logarithmic Functions",
    duration: "Week 9",
    summary:
      "Exponential functions, their graphs and transformations, the natural base e, logarithmic functions, and logarithm laws.",
    content: [
      "For a > 0 and a != 1, an exponential function has the form f(x) = a^x. Its domain is all real numbers, its range is (0, infinity), its y-intercept is (0, 1), and the x-axis is a horizontal asymptote.",
      "If a > 1, f(x) = a^x is increasing; if 0 < a < 1, it is decreasing. The lecture also reviews exponent laws and transformations such as reflections and horizontal or vertical shifts of the parent function.",
      "The natural base is e = 2.718281828... and f(x) = e^x is the natural exponential function.",
      "The logarithmic function y = log_a(x) is the inverse of y = a^x: y = log_a(x) if and only if x = a^y. Logarithms have domain (0, infinity), range all real numbers, x-intercept (1, 0), and the y-axis as a vertical asymptote. The lecture also gives product, quotient, power, change-of-base, and natural-log properties.",
    ],
    quizId: "mat111-week9-exponential-foundations",
  },
  {
    id: "mat111-week-11",
    courseId: MAT111_COURSE_ID,
    title: "Trigonometric Functions of Any Angle",
    duration: "Week 11",
    summary:
      "Six trigonometric functions, quadrant signs, common and reference angles, real-number trigonometry, periodicity, and sine/cosine graphs.",
    content: [
      "For a point (x, y) on the terminal side of an angle and r = sqrt(x^2 + y^2), sin(theta) = y/r, cos(theta) = x/r, tan(theta) = y/x, cot(theta) = x/y, csc(theta) = r/y, and sec(theta) = r/x where the denominators are nonzero.",
      "The signs of the trigonometric functions depend on the quadrant. Reference angles let values for angles outside the first quadrant be determined from the corresponding acute angle and the correct quadrant sign.",
      "Sine and cosine can also be treated as functions of real numbers on the unit circle. Both are 2*pi-periodic. Cosine and secant are even; sine, cosecant, tangent, and cotangent are odd.",
      "The sine and cosine curves both have domain all real numbers, range [-1, 1], and period 2*pi. The sine curve is symmetric about the origin, while the cosine curve is symmetric about the y-axis.",
    ],
    quizId: "mat111-week11-angle-values",
  },
  {
    id: "mat111-week-14",
    courseId: MAT111_COURSE_ID,
    title: "Complex Numbers",
    duration: "Week 14",
    summary:
      "The imaginary unit, complex numbers in standard form, equality, arithmetic operations, division, and complex conjugates.",
    content: [
      "The imaginary unit is i = sqrt(-1), so i^2 = -1. A complex number has standard form a + bi, where a and b are real numbers.",
      "Two complex numbers a + bi and c + di are equal if and only if a = c and b = d.",
      "Complex numbers can be added, subtracted, and multiplied using the usual algebraic rules with i^2 = -1. Division by c + di uses the conjugate and produces real and imaginary parts over c^2 + d^2.",
      "The complex conjugate of z = a + bi is a - bi. In particular, z times its conjugate equals a^2 + b^2.",
    ],
    quizId: "mat111-week14-complex-basics",
  },
];

export function getMat111Lesson(id: string) {
  return mat111Lessons.find((lesson) => lesson.id === id);
}

export function getMat111LessonsByCourse(courseId: string) {
  return courseId === MAT111_COURSE_ID ? mat111Lessons : [];
}
