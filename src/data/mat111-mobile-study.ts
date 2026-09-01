import { MAT111_COURSE_ID } from "./mat111-course";
import type {
  Mat111ExpandedQuiz,
  Mat111InfographyPage,
  Mat111MobileExamPaper,
  Mat111MobileTopicDefinition,
} from "./mat111-mobile-study-types";

const topic = (
  lessonId: string,
  week: number,
  topicTitle: string,
  order: number,
  pages: Mat111InfographyPage[],
): Mat111MobileTopicDefinition => ({ lessonId, week, topicTitle, order, pages });

export const mat111MobileTopics: Mat111MobileTopicDefinition[] = [
  topic("mat111-week-2", 2, "Combinations, Composition and Inverse Functions", 1, [
    { title: "Arithmetic combinations", body: "For functions f and g, operations are pointwise: (f+g)(x)=f(x)+g(x), (f-g)(x)=f(x)-g(x), and (fg)(x)=f(x)g(x), wherever both functions are defined." },
    { title: "Quotients and restrictions", body: "The quotient (f/g)(x)=f(x)/g(x) is defined only where both functions are defined and g(x) is not zero. Denominator zeros must be excluded from the domain." },
    { title: "Substitution before simplifying", body: "When combining formulas, substitute the full expressions for f(x) and g(x) first, then simplify. Keep any domain restrictions from the original expressions." },
    { title: "Composition", body: "Composition feeds one function into another: (f∘g)(x)=f(g(x)). The order matters, so f∘g and g∘f are generally different." },
    { title: "Composition domain", body: "For f∘g, x must be in the domain of g and the value g(x) must be in the domain of f. Both stages must be valid." },
    { title: "Evaluating a composition", body: "To evaluate (f∘g)(a), find g(a) first and then evaluate f at that output. If either step is undefined, the composition is undefined at a." },
    { title: "Inverse functions", body: "Functions f and g are inverses when f(g(x))=x and g(f(x))=x on their relevant domains. An inverse reverses the action of the original function." },
    { title: "Domain and range of an inverse", body: "For inverse functions, the domain and range interchange: Dom(f⁻¹)=Range(f) and Range(f⁻¹)=Dom(f). Their graphs reflect across y=x." },
    { title: "One-to-one condition", body: "A function has an inverse function exactly when it is one-to-one, meaning distinct inputs do not produce the same output." },
    { title: "Horizontal line test", body: "A graph represents a one-to-one function when every horizontal line intersects the graph at most once. Algebraically, interchange x and y and solve for y to find an inverse." },
  ]),
  topic("mat111-week-3", 3, "Properties and Transformations of Graphs", 2, [
    { title: "Symmetry of graphs", body: "The lecture considers symmetry about the y-axis, the origin, and the x-axis. A nonzero function graph cannot have x-axis symmetry and still pass the vertical line test." },
    { title: "Even functions", body: "A function is even when f(-x)=f(x) for every x in its domain. Its graph is symmetric about the y-axis." },
    { title: "Odd functions", body: "A function is odd when f(-x)=-f(x) for every x in its domain. Its graph is symmetric about the origin." },
    { title: "Neither even nor odd", body: "If f(-x) is neither f(x) nor -f(x), the function is neither even nor odd. The lecture uses x^3-1 as an example." },
    { title: "Parent graphs", body: "Standard parent graphs such as y=x, y=|x|, y=√x, y=x², y=x³ and y=1/x provide reference shapes for transformations." },
    { title: "Vertical translations", body: "For c>0, y=f(x)+c shifts the graph up c units, while y=f(x)-c shifts it down c units." },
    { title: "Horizontal translations", body: "For c>0, y=f(x-c) shifts right c units and y=f(x+c) shifts left c units. The sign inside the input acts opposite to the direction of the shift." },
    { title: "Reflections", body: "The graph y=-f(x) reflects y=f(x) in the x-axis. The graph y=f(-x) reflects it in the y-axis." },
    { title: "Vertical scaling", body: "For y=af(x), |a|>1 gives a vertical stretch and 0<|a|<1 gives a vertical shrink. A negative a also reflects the graph in the x-axis." },
    { title: "Horizontal scaling", body: "For y=f(bx), |b|>1 gives a horizontal shrink and 0<|b|<1 gives a horizontal stretch. A negative b also reflects the graph in the y-axis." },
  ]),
  topic("mat111-week-4", 4, "The Cartesian Plane, Lines and Circles", 3, [
    { title: "Points in the Cartesian plane", body: "A point is represented by an ordered pair (x,y). The x-coordinate measures horizontal position and the y-coordinate measures vertical position in the Cartesian plane." },
    { title: "Distance formula", body: "For P(x₁,y₁) and Q(x₂,y₂), the distance is d=√((x₂-x₁)²+(y₂-y₁)²). It comes from the Pythagorean theorem." },
    { title: "Using distances", body: "Distances between pairs of points can be compared or combined with the Pythagorean theorem to verify geometric properties such as a right triangle." },
    { title: "Midpoint formula", body: "The midpoint of the segment joining (x₁,y₁) and (x₂,y₂) is ((x₁+x₂)/2,(y₁+y₂)/2). It averages the coordinates." },
    { title: "Standard equation of a circle", body: "A circle with center (h,k) and radius r has equation (x-h)²+(y-k)²=r². With center at the origin, the equation is x²+y²=r²." },
    { title: "Reading a circle equation", body: "In (x-h)²+(y-k)²=r², the center is (h,k) and the radius is the positive number r. Match signs carefully when reading h and k." },
    { title: "Slope of a line", body: "For two points with x₂≠x₁, slope is m=(y₂-y₁)/(x₂-x₁). It measures vertical change divided by horizontal change." },
    { title: "Point-slope form", body: "A line with slope m through (x₁,y₁) can be written y-y₁=m(x-x₁). This is useful when a point and slope are known." },
    { title: "Slope-intercept form", body: "The equation y=mx+b displays the slope m and y-intercept b directly. It is obtained by solving a linear equation for y." },
    { title: "Horizontal and vertical lines", body: "Horizontal lines have equations y=c and slope 0. Vertical lines have equations x=c and an undefined slope because their horizontal change is zero." },
  ]),
  topic("mat111-week-5", 5, "Quadratic Functions and Their Graphs", 4, [
    { title: "Quadratic function", body: "A quadratic function has the form f(x)=ax²+bx+c with a≠0. Its graph is a parabola." },
    { title: "Opening direction", body: "The sign of a determines the opening: a>0 opens upward and a<0 opens downward. The magnitude of a affects the width of the parabola." },
    { title: "Axis of symmetry", body: "For f(x)=ax²+bx+c, the axis of symmetry is x=-b/(2a). The vertex lies on this vertical line." },
    { title: "Vertex", body: "The vertex is found by evaluating the function at x=-b/(2a), giving (-b/(2a), f(-b/(2a))). It is a minimum when a>0 and a maximum when a<0." },
    { title: "y-intercept", body: "The y-intercept is found by setting x=0. For f(x)=ax²+bx+c, the y-intercept is (0,c)." },
    { title: "x-intercepts", body: "The x-intercepts are the real solutions of ax²+bx+c=0. They may be found by factoring, completing the square, or using the quadratic formula." },
    { title: "Standard or vertex form", body: "A quadratic can be written f(x)=a(x-h)²+k. In this form the vertex is (h,k), making transformations and the graph easier to read." },
    { title: "Completing the square", body: "Completing the square rewrites ax²+bx+c into vertex form. After factoring a from the x-terms, add and subtract the square needed to form a perfect-square trinomial." },
    { title: "Graphing from key features", body: "A useful graphing sequence is: determine opening direction, axis of symmetry, vertex, y-intercept, and any x-intercepts, then sketch the symmetric parabola." },
    { title: "Range from the vertex", body: "The vertex determines the extreme y-value. If a>0 the range starts at the minimum vertex value; if a<0 the range ends at the maximum vertex value." },
  ]),
  topic("mat111-week-9", 9, "Exponential and Logarithmic Functions", 5, [
    { title: "Exponential function", body: "An exponential function has the form f(x)=a^x with a>0 and a≠1. Its domain is all real numbers and its outputs are positive." },
    { title: "Exponential graph features", body: "For y=a^x, the range is (0,∞), the y-intercept is (0,1), and y=0 is a horizontal asymptote." },
    { title: "Growth and decay", body: "When a>1, a^x is increasing. When 0<a<1, a^x is decreasing. In both cases the function is one-to-one." },
    { title: "Exponential transformations", body: "Translations and reflections of exponential graphs follow the usual transformation rules, for example a^x+k shifts vertically and a^(x-h) shifts horizontally." },
    { title: "One-to-one property", body: "Because exponential functions are one-to-one, equal powers with the same valid base have equal exponents: if a^u=a^v, then u=v." },
    { title: "Definition of logarithm", body: "The logarithmic statement log_a(x)=y is equivalent to the exponential statement a^y=x, with a>0, a≠1 and x>0." },
    { title: "Logarithm as inverse", body: "The logarithmic function y=log_a x is the inverse of y=a^x. Their graphs are reflections across y=x." },
    { title: "Logarithmic graph features", body: "For y=log_a x, the domain is (0,∞), the range is all real numbers, the x-intercept is (1,0), and x=0 is a vertical asymptote." },
    { title: "Basic logarithm values", body: "From the definition, log_a(1)=0 and log_a(a)=1. Also a^(log_a x)=x for x>0 and log_a(a^x)=x." },
    { title: "Natural logarithm", body: "The natural logarithm ln x is logarithm to base e. It has the same inverse relationship and domain restriction x>0 as other logarithmic functions." },
  ]),
  topic("mat111-week-10", 10, "Equations, Log Rules and Trigonometric Foundations", 6, [
    { title: "Solving exponential equations", body: "Rewrite both sides with a common base when possible and use the one-to-one property of exponentials to equate exponents." },
    { title: "Solving logarithmic equations", body: "Use the one-to-one property or convert between logarithmic and exponential forms, then check that every logarithm argument remains positive." },
    { title: "Product rule for logarithms", body: "For positive M and N, log_a(MN)=log_a M+log_a N. The rule converts a product inside a logarithm into a sum." },
    { title: "Quotient and power rules", body: "For positive M and N, log_a(M/N)=log_a M-log_a N, and log_a(M^p)=p log_a M. These rules expand or condense logarithmic expressions." },
    { title: "Angles in standard position", body: "An angle is in standard position when its vertex is at the origin and its initial side lies on the positive x-axis. Counterclockwise rotation is positive and clockwise rotation is negative." },
    { title: "Coterminal angles", body: "Angles that share the same initial and terminal sides are coterminal. In degrees they differ by integer multiples of 360°, and in radians by integer multiples of 2π." },
    { title: "Radian measure", body: "For a central angle, θ=s/r in radians, where s is intercepted arc length and r is radius. One full revolution is 2π radians." },
    { title: "Degrees and radians", body: "Use π radians=180°. Convert degrees to radians by multiplying by π/180, and radians to degrees by multiplying by 180/π." },
    { title: "Right-triangle trigonometry", body: "Relative to an acute angle θ in a right triangle, identify the opposite side, adjacent side, and hypotenuse before forming trigonometric ratios." },
    { title: "Six trigonometric ratios", body: "sinθ=opposite/hypotenuse, cosθ=adjacent/hypotenuse, tanθ=opposite/adjacent; csc, sec and cot are the corresponding reciprocal ratios." },
  ]),
  topic("mat111-week-11", 11, "Trigonometric Functions of Any Angle", 7, [
    { title: "Trigonometric functions from coordinates", body: "For a point (x,y) on the terminal side and r=√(x²+y²), sinθ=y/r, cosθ=x/r and tanθ=y/x when x≠0; the reciprocal functions follow similarly." },
    { title: "Signs in the quadrants", body: "Because r>0, signs come from x and y: sine follows y, cosine follows x, and tangent follows y/x. This determines the signs in all four quadrants." },
    { title: "Quadrant angles", body: "Quadrant angles have terminal sides on the coordinate axes, including 0, π/2, π and 3π/2 radians. Their trig values come from unit-circle axis points." },
    { title: "Reference angles", body: "A reference angle is the acute angle between the terminal side and the x-axis. It lets you use a known acute-angle value with the correct quadrant sign." },
    { title: "Pythagorean identity", body: "The identity sin²θ+cos²θ=1 connects sine and cosine. Together with quadrant information it can determine a missing trigonometric value." },
    { title: "Real numbers and the unit circle", body: "Wrapping the real number line around the unit circle associates each real t with a central angle whose directed arc length is t when the radius is 1." },
    { title: "Periodic functions", body: "A function is periodic if f(t+c)=f(t) for a positive constant c. Sine and cosine have period 2π." },
    { title: "Other trig functions from sine and cosine", body: "tan x=sin x/cos x, cot x=cos x/sin x, csc x=1/sin x and sec x=1/cos x, with denominator zeros excluded." },
    { title: "Sine graph", body: "The sine curve has domain all real numbers, range [-1,1], period 2π, origin symmetry, x-intercepts at nπ, and y-intercept (0,0)." },
    { title: "Cosine graph", body: "The cosine curve has domain all real numbers, range [-1,1], period 2π, y-axis symmetry, x-intercepts at nπ+π/2, and y-intercept (0,1)." },
  ]),
  topic("mat111-week-13", 13, "Analytic Trigonometry", 8, [
    { title: "Reciprocal identities", body: "The reciprocal identities are csc x=1/sin x, sec x=1/cos x and cot x=1/tan x wherever the denominators are nonzero." },
    { title: "Quotient identities", body: "The quotient identities are tan x=sin x/cos x and cot x=cos x/sin x, with the usual denominator restrictions." },
    { title: "Pythagorean identities", body: "The fundamental identity sin²x+cos²x=1 produces 1+tan²x=sec²x and 1+cot²x=csc²x by division by cos²x or sin²x." },
    { title: "Simplifying trig expressions", body: "A common strategy is to rewrite expressions in sine and cosine, factor or combine fractions, then apply a fundamental identity." },
    { title: "Verifying identities", body: "To verify an identity, transform one side using known identities and algebra until it matches the other side. Do not assume the statement being proved." },
    { title: "Solving trigonometric equations", body: "Solve for the relevant trigonometric value, find reference or special angles, and include all solutions in the required interval or general solution." },
    { title: "Sine sum and difference", body: "sin(α±β)=sinα cosβ±cosα sinβ. The formula evaluates angles that can be written as sums or differences of familiar angles." },
    { title: "Cosine sum and difference", body: "cos(α±β)=cosα cosβ∓sinα sinβ. Notice that the sign in the middle reverses relative to the sign between the angles." },
    { title: "Tangent sum and difference", body: "tan(α±β)=(tanα±tanβ)/(1∓tanα tanβ), wherever the denominator is nonzero." },
    { title: "Double-angle formulas", body: "Setting α=β gives formulas such as sin2θ=2sinθcosθ and cos2θ=cos²θ-sin²θ, with equivalent cosine forms obtained from sin²θ+cos²θ=1." },
  ]),
  topic("mat111-week-14", 14, "Complex Numbers", 9, [
    { title: "The imaginary unit", body: "The imaginary unit i is defined by i²=-1. It allows square roots of negative real numbers to be represented within the complex number system." },
    { title: "Standard form", body: "A complex number is written z=a+bi, where a and b are real. The real part is a and the imaginary part is b." },
    { title: "Equality of complex numbers", body: "Two complex numbers a+bi and c+di are equal exactly when a=c and b=d. Match real parts and imaginary parts separately." },
    { title: "Addition and subtraction", body: "Add or subtract complex numbers by combining real parts with real parts and imaginary parts with imaginary parts." },
    { title: "Multiplication", body: "Multiply complex numbers using ordinary algebra and replace i² by -1. Then collect the result into a+bi form." },
    { title: "Complex conjugate", body: "The conjugate of z=a+bi is z̄=a-bi. Multiplying conjugates gives (a+bi)(a-bi)=a²+b², a real number." },
    { title: "Division", body: "To divide by c+di, multiply numerator and denominator by the conjugate c-di. The denominator becomes c²+d² and the quotient can be written in standard form." },
    { title: "Powers of i", body: "Powers of i repeat in a cycle of four: i, -1, -i, 1. Reduce a large exponent modulo 4 to identify the value." },
    { title: "Square roots of negative numbers", body: "For a positive real a, √(-a)=i√a. This converts negative radicands into imaginary quantities." },
    { title: "Quadratics with negative discriminant", body: "The quadratic formula still applies when b²-4ac<0. The square root of the negative discriminant introduces i and gives a complex-conjugate pair of roots for real coefficients." },
  ]),
  topic("mat111-week-15", 15, "The Complex Plane and Polar Form", 10, [
    { title: "Argand diagram", body: "The complex number z=a+bi corresponds to the point (a,b) in the complex plane. The horizontal axis is the real axis and the vertical axis is the imaginary axis." },
    { title: "Modulus", body: "The modulus is the distance from the origin: |z|=√(a²+b²). Geometrically it is the length of the vector from 0 to the point representing z." },
    { title: "Argument", body: "The argument arg z is the angle from the positive real axis to the vector representing z. The correct quadrant must be used when determining the angle." },
    { title: "Polar form", body: "If r=|z| and θ=arg z, then z=r(cosθ+i sinθ). This is the polar or trigonometric form of a nonzero complex number." },
    { title: "Converting to standard form", body: "From r(cosθ+i sinθ), the real part is r cosθ and the imaginary part is r sinθ, so z=r cosθ+i r sinθ." },
    { title: "Multiplication in polar form", body: "For complex numbers z and w, |zw|=|z||w| and arg(zw)=arg z+arg w. Multiply moduli and add arguments." },
    { title: "Division in polar form", body: "For w≠0, |z/w|=|z|/|w| and the argument of z/w is arg z-arg w. Divide moduli and subtract arguments." },
    { title: "Integer powers", body: "For integer n and nonzero z, |z^n|=|z|^n and arg(z^n)=n arg z, with angles understood modulo full revolutions." },
    { title: "De Moivre's theorem", body: "For integers n, (cosθ+i sinθ)^n=cos(nθ)+i sin(nθ). Hence [r(cosθ+i sinθ)]^n=r^n(cos nθ+i sin nθ)." },
    { title: "Roots of complex numbers", body: "To find nth roots, take the nth root of the modulus and divide the possible arguments θ+2kπ by n. The n distinct roots are equally spaced around a circle." },
  ]),
];

const difficultyByIndex: Mat111ExpandedQuiz["difficulty"][] = [
  "Foundational",
  "Applied",
  "Applied",
  "Challenge",
  "Challenge",
];

function makeExpandedQuizzes(topicDefinition: Mat111MobileTopicDefinition): Mat111ExpandedQuiz[] {
  return Array.from({ length: 5 }, (_, quizIndex) => {
    const pageIndexes = [quizIndex * 2, quizIndex * 2 + 1];
    return {
      id: `mat111-week${topicDefinition.week}-extra-${quizIndex + 1}`,
      courseId: MAT111_COURSE_ID,
      lessonId: topicDefinition.lessonId,
      title: `Week ${topicDefinition.week} Further Questions ${quizIndex + 1}`,
      difficulty: difficultyByIndex[quizIndex],
      estimatedTime: "5 min",
      questions: pageIndexes.map((pageIndex, questionIndex) => {
        const page = topicDefinition.pages[pageIndex];
        return {
          id: `q${questionIndex + 1}`,
          prompt: `From the supplied Week ${topicDefinition.week} lecture note, explain the key idea or rule for: ${page.title}.`,
          choices: [],
          answerIndex: -1,
          explanation: page.body,
        };
      }),
    };
  });
}

export const mat111ExpandedQuizzes: Mat111ExpandedQuiz[] = mat111MobileTopics.flatMap(makeExpandedQuizzes);

export function getMat111ExpandedQuiz(quizId: string) {
  return mat111ExpandedQuizzes.find((quiz) => quiz.id === quizId);
}

export function getMat111InfographyPages(lessonId: string) {
  return mat111MobileTopics.find((item) => item.lessonId === lessonId)?.pages ?? [];
}

const examLabels = ["A", "B", "C", "D", "E"] as const;

function makeExamPapers(topicDefinition: Mat111MobileTopicDefinition): Mat111MobileExamPaper[] {
  return examLabels.map((label, paperIndex) => {
    const start = paperIndex * 2;
    const pageIndexes = Array.from({ length: 4 }, (_, offset) => (start + offset) % topicDefinition.pages.length);
    const questions = pageIndexes.map((pageIndex, questionIndex) => {
      const page = topicDefinition.pages[pageIndex];
      return {
        stableId: `mat111-w${topicDefinition.week}-exam-${label.toLowerCase()}-q${questionIndex + 1}`,
        questionNumber: String(questionIndex + 1),
        prompt: `Using the supplied Week ${topicDefinition.week} lecture material, state and explain the rule, definition, or method for "${page.title}".`,
        modelAnswer: page.body,
        marks: 5,
        order: questionIndex + 1,
      };
    });

    return {
      stableId: `mat111-week${topicDefinition.week}-exam-practice-${label.toLowerCase()}`,
      courseStableId: MAT111_COURSE_ID,
      lessonId: topicDefinition.lessonId,
      week: topicDefinition.week,
      topicTitle: topicDefinition.topicTitle,
      title: `Week ${topicDefinition.week} Exam Practice ${label}`,
      paperCode: `MAT111-W${topicDefinition.week}-${label}`,
      session: "Lecture-note practice",
      description: "Source-backed practice generated only from the supplied MAT111 lecture note. It is not represented as an archived institutional past paper.",
      estimatedTime: "20 min",
      totalMarks: questions.reduce((sum, question) => sum + question.marks, 0),
      order: paperIndex + 1,
      questions,
    };
  });
}

export const mat111MobileExamPapers: Mat111MobileExamPaper[] = mat111MobileTopics.flatMap(makeExamPapers);

export function getMat111MobileExamPapersByLesson(lessonId: string) {
  return mat111MobileExamPapers.filter((paper) => paper.lessonId === lessonId);
}

export function getMat111MobileExamPaper(paperId: string) {
  return mat111MobileExamPapers.find((paper) => paper.stableId === paperId);
}

export function isMat111MobileExamPaperId(paperId: string) {
  return paperId.startsWith("mat111-week") && paperId.includes("-exam-practice-");
}
