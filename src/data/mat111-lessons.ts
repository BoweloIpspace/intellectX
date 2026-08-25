import type { Lesson } from "./lessons";
import { MAT111_COURSE_ID } from "./mat111-course";

export const mat111Lessons: Lesson[] = [
  {
    id: "mat111-week-2",
    courseId: MAT111_COURSE_ID,
    title: "Combinations, Composition and Inverse Functions",
    duration: "Week 2",
    posterUrl: "/mat111/week2-functions.svg",
    summary:
      "Arithmetic combinations of functions, composition and its domain, inverse functions, one-to-one functions, and the horizontal line test.",
    content: [
      "For functions f and g with overlapping domains, their sum, difference and product are formed pointwise. The quotient (f/g)(x) = f(x)/g(x) is defined only where g(x) is not zero.",
      "Composition is defined by (f o g)(x) = f(g(x)). Its domain contains the x-values in the domain of g for which g(x) lies in the domain of f.",
      "Functions f and g are inverses when f(g(x)) = x and g(f(x)) = x on the relevant domains. The domain and range of an inverse exchange the range and domain of the original function.",
      "A function has an inverse function exactly when it is one-to-one. Graphically, a one-to-one function passes the horizontal line test: every horizontal line meets its graph at most once.",
    ],
    nextLessonId: "mat111-week-3",
    quizId: "mat111-week2-function-combinations",
  },
  {
    id: "mat111-week-3",
    courseId: MAT111_COURSE_ID,
    title: "Properties and Transformations of Graphs",
    duration: "Week 3",
    posterUrl: "/mat111/week3-graphs.svg",
    summary:
      "Graph symmetry, even and odd functions, common parent graphs, and rigid and non-rigid transformations.",
    content: [
      "A graph symmetric about the y-axis represents an even function when f(-x) = f(x). A graph symmetric about the origin represents an odd function when f(-x) = -f(x).",
      "The lecture reviews parent graphs including f(x)=x, |x|, sqrt(x), x^2, x^3 and 1/x so transformed graphs can be compared against a familiar base shape.",
      "For c > 0, f(x)+c shifts a graph up, f(x)-c shifts it down, f(x-c) shifts it right, and f(x+c) shifts it left. The rules -f(x) and f(-x) reflect in the x-axis and y-axis respectively.",
      "Multiplying a function by a constant changes vertical scale, while replacing x by a multiple changes horizontal scale. These stretches and shrinks are non-rigid transformations.",
    ],
    nextLessonId: "mat111-week-4",
    quizId: "mat111-week3-symmetry-parent-graphs",
  },
  {
    id: "mat111-week-4",
    courseId: MAT111_COURSE_ID,
    title: "Cartesian Plane, Circles and Lines",
    duration: "Week 4",
    posterUrl: "/mat111/week4-coordinate-geometry.svg",
    summary:
      "Coordinates and quadrants, distance and midpoint formulas, circle equations, slope, line equations, and parallel and perpendicular lines.",
    content: [
      "The Cartesian plane uses perpendicular x- and y-axes meeting at the origin. The distance between P(x1,y1) and Q(x2,y2) is sqrt((x2-x1)^2 + (y2-y1)^2), and their midpoint is ((x1+x2)/2,(y1+y2)/2).",
      "A circle with centre (h,k) and radius r has equation (x-h)^2 + (y-k)^2 = r^2. Distance and midpoint ideas can be used to build the equation from points, a diameter, or a tangent condition.",
      "A non-vertical line through two points has slope m=(y2-y1)/(x2-x1). Point-slope form is y-y1=m(x-x1), while slope-intercept form is y=mx+b.",
      "Distinct non-vertical parallel lines have equal slopes. Perpendicular non-vertical lines have slopes whose product is -1, so one slope is the negative reciprocal of the other.",
    ],
    nextLessonId: "mat111-week-5",
    quizId: "mat111-week4-coordinate-geometry",
  },
  {
    id: "mat111-week-5",
    courseId: MAT111_COURSE_ID,
    title: "Quadratic Functions",
    duration: "Week 5",
    posterUrl: "/mat111/week5-quadratics.svg",
    summary:
      "Parabolas, intercepts, the quadratic formula, standard form, completing the square, vertices, ranges, and maximum or minimum values.",
    content: [
      "A quadratic function has the form f(x)=ax^2+bx+c with a not equal to zero. Its graph is a parabola with an axis of symmetry and a vertex; it opens upward for a>0 and downward for a<0.",
      "The y-intercept is (0,c). Real x-intercepts solve ax^2+bx+c=0 by factorising, completing the square, or the quadratic formula. If b^2-4ac<0, there are no real x-intercepts.",
      "Standard form f(x)=a(x-h)^2+k makes the vertex (h,k) and axis x=h visible. Completing the square converts a general quadratic to this form.",
      "For f(x)=ax^2+bx+c, the vertex occurs at x=-b/(2a). An upward parabola has a minimum there; a downward parabola has a maximum there.",
    ],
    nextLessonId: "mat111-week-9",
    quizId: "mat111-week5-quadratic-graphs",
  },
  {
    id: "mat111-week-9",
    courseId: MAT111_COURSE_ID,
    title: "Exponential and Logarithmic Functions",
    duration: "Week 9",
    posterUrl: "/mat111/week9-exp-log.svg",
    summary:
      "Exponential functions, their graphs and transformations, the natural base e, logarithmic functions, and logarithm laws.",
    content: [
      "For a > 0 and a != 1, an exponential function has the form f(x)=a^x. Its domain is all real numbers, its range is (0,infinity), its y-intercept is (0,1), and the x-axis is a horizontal asymptote.",
      "If a>1, f(x)=a^x is increasing; if 0<a<1, it is decreasing. Reflections and horizontal or vertical shifts transform the parent exponential graph.",
      "The natural base is e=2.718281828... and f(x)=e^x is the natural exponential function.",
      "The logarithmic function y=log_a(x) is the inverse of y=a^x: y=log_a(x) if and only if x=a^y. Logarithms have domain (0,infinity), range all real numbers, x-intercept (1,0), and the y-axis as a vertical asymptote.",
    ],
    nextLessonId: "mat111-week-10",
    quizId: "mat111-week9-exponential-foundations",
  },
  {
    id: "mat111-week-10",
    courseId: MAT111_COURSE_ID,
    title: "Exponential Equations, Angles and Right-Triangle Trigonometry",
    duration: "Week 10",
    posterUrl: "/mat111/week10-angles-trig.svg",
    summary:
      "Solving exponential and logarithmic equations, expanding and condensing logarithms, angle measure, radians, and right-triangle trigonometry.",
    content: [
      "Exponential and logarithmic equations are solved using inverse relationships, one-to-one properties and logarithm laws. Logarithmic domains must be checked so algebraic candidates that make a log argument non-positive are rejected.",
      "Logarithm product, quotient and power rules let expressions be expanded or condensed, and natural logarithms can be used to solve equations such as a^x=b by taking logarithms of both sides.",
      "An angle in standard position has its vertex at the origin and initial side along the positive x-axis. Positive rotation is counterclockwise and negative rotation is clockwise; coterminal angles differ by full revolutions.",
      "Radian measure is defined by theta=s/r for arc length s and radius r, with pi radians equal to 180 degrees. In a right triangle, the six trigonometric functions are ratios of the opposite, adjacent and hypotenuse sides.",
    ],
    nextLessonId: "mat111-week-11",
    quizId: "mat111-week10-exp-log-equations",
  },
  {
    id: "mat111-week-11",
    courseId: MAT111_COURSE_ID,
    title: "Trigonometric Functions of Any Angle",
    duration: "Week 11",
    posterUrl: "/mat111/week11-trig-any-angle.svg",
    summary:
      "Six trigonometric functions, quadrant signs, common and reference angles, real-number trigonometry, periodicity, and sine/cosine graphs.",
    content: [
      "For a point (x,y) on the terminal side of an angle and r=sqrt(x^2+y^2), sin(theta)=y/r, cos(theta)=x/r, tan(theta)=y/x, cot(theta)=x/y, csc(theta)=r/y, and sec(theta)=r/x where denominators are nonzero.",
      "The signs of trigonometric functions depend on the quadrant. Reference angles let values outside the first quadrant be determined from the corresponding acute angle and the correct quadrant sign.",
      "Sine and cosine can also be treated as functions of real numbers on the unit circle. Both are 2*pi-periodic. Cosine and secant are even; sine, cosecant, tangent and cotangent are odd.",
      "The sine and cosine curves both have domain all real numbers, range [-1,1], and period 2*pi. Sine is symmetric about the origin while cosine is symmetric about the y-axis.",
    ],
    nextLessonId: "mat111-week-13",
    quizId: "mat111-week11-angle-values",
  },
  {
    id: "mat111-week-13",
    courseId: MAT111_COURSE_ID,
    title: "Analytic Trigonometry",
    duration: "Week 13",
    posterUrl: "/mat111/week13-analytic-trig.svg",
    summary:
      "Fundamental identities, simplifying and verifying identities, trigonometric equations, and sum, difference, double-angle, power-reducing and related formulas.",
    content: [
      "The fundamental identities include reciprocal identities, tan(theta)=sin(theta)/cos(theta), cot(theta)=cos(theta)/sin(theta), and the Pythagorean identities sin^2(theta)+cos^2(theta)=1, 1+tan^2(theta)=sec^2(theta), and 1+cot^2(theta)=csc^2(theta).",
      "Identities can be used to find missing trigonometric values and simplify expressions. When verifying an identity, work with one side at a time, factor or combine fractions when helpful, and convert to sine and cosine if needed.",
      "Trigonometric equations are solved with algebraic methods such as isolating a trig function or factoring, then using periodicity to give all required solutions.",
      "The lecture develops sum and difference formulas, double-angle and power-reducing formulas, half-angle formulas, and product-to-sum or sum-to-product relationships for evaluating exact values and solving equations.",
    ],
    nextLessonId: "mat111-week-14",
    quizId: "mat111-week13-identities",
  },
  {
    id: "mat111-week-14",
    courseId: MAT111_COURSE_ID,
    title: "Complex Numbers",
    duration: "Week 14",
    posterUrl: "/mat111/week14-complex-numbers.svg",
    summary:
      "The imaginary unit, complex numbers in standard form, equality, arithmetic operations, division, and complex conjugates.",
    content: [
      "The imaginary unit is i=sqrt(-1), so i^2=-1. A complex number has standard form a+bi, where a and b are real numbers.",
      "Two complex numbers a+bi and c+di are equal if and only if a=c and b=d.",
      "Complex numbers can be added, subtracted and multiplied using the usual algebraic rules with i^2=-1. Division by c+di uses its conjugate so the denominator becomes real.",
      "The complex conjugate of z=a+bi is a-bi. In particular, z times its conjugate equals a^2+b^2.",
    ],
    nextLessonId: "mat111-week-15",
    quizId: "mat111-week14-complex-basics",
  },
  {
    id: "mat111-week-15",
    courseId: MAT111_COURSE_ID,
    title: "The Complex Plane, Polar Form and De Moivre's Theorem",
    duration: "Week 15",
    posterUrl: "/mat111/week15-complex-plane.svg",
    summary:
      "Argand diagrams, modulus and argument, polar form, products and powers, De Moivre's theorem, and roots of complex numbers.",
    content: [
      "In an Argand diagram, z=a+bi corresponds to the point (a,b). The horizontal axis is the real axis and the vertical axis is the imaginary axis.",
      "The modulus is |z|=sqrt(a^2+b^2). An argument theta satisfies cos(theta)=a/|z| and sin(theta)=b/|z|; the principal argument is the unique value in (-pi,pi].",
      "Writing a=r cos(theta) and b=r sin(theta) gives polar form z=r(cos(theta)+i sin(theta)). Products multiply moduli and add arguments.",
      "De Moivre's theorem gives (cos(theta)+i sin(theta))^n=cos(n theta)+i sin(n theta). For z^n=w, the n distinct roots use modulus rho^(1/n) and arguments (alpha+2k*pi)/n for k=0,...,n-1.",
    ],
    quizId: "mat111-week15-complex-plane-polar",
  },
];

export function getMat111Lesson(id: string) {
  return mat111Lessons.find((lesson) => lesson.id === id);
}

export function getMat111LessonsByCourse(courseId: string) {
  return courseId === MAT111_COURSE_ID ? mat111Lessons : [];
}
