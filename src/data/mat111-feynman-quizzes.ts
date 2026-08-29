import type { Quiz, QuizQuestion } from "./quizzes";
import { MAT111_COURSE_ID } from "./mat111-course";

function mcq(id: string, prompt: string, choices: [string, string, string, string]): QuizQuestion {
  return { id, prompt, choices, answerIndex: -1, explanation: "" };
}

function structured(id: string, prompt: string): QuizQuestion {
  return { id, prompt, choices: [], answerIndex: -1, explanation: "" };
}

function practiceQuiz(
  id: string,
  lessonId: string,
  title: string,
  difficulty: Quiz["difficulty"],
  questions: QuizQuestion[],
): Quiz {
  return {
    id,
    courseId: MAT111_COURSE_ID,
    lessonId,
    title,
    difficulty,
    estimatedTime: difficulty === "Challenge" ? "10 min" : "8 min",
    questions,
  };
}

export const mat111FeynmanQuizzes: Quiz[] = [
  practiceQuiz(
    "mat111-week2-feynman-concepts",
    "mat111-week-2",
    "Week 2 Feynman Concepts",
    "Foundational",
    [
      mcq("q1", "Which description best captures a function?", ["A rule that assigns each allowed input exactly one output", "A rule that must use x^2", "Any equation with two variables", "A graph that crosses the x-axis"]),
      mcq("q2", "For a composition f(g(x)), which function acts first?", ["f, because it is written first", "g, because the inside rule is evaluated first", "Both act at the same time", "Whichever has the larger domain"]),
      mcq("q3", "Why must a function be one-to-one before its inverse can be a function?", ["Because every function must be linear", "Because inverse notation requires a fraction", "Because each output must point back to one unique input", "Because one-to-one functions have no domain restrictions"]),
      structured("q4", "Using your own 'machine' analogy, explain the difference between combining functions, composing functions, and reversing a function with an inverse."),
    ],
  ),
  practiceQuiz(
    "mat111-week2-worked-reasoning",
    "mat111-week-2",
    "Week 2 Worked Reasoning",
    "Applied",
    [
      mcq("q1", "Let f(x)=x+4 and g(x)=2x. What is (f o g)(3)?", ["10", "14", "18", "7"]),
      mcq("q2", "If f(x)=sqrt(x-1), what restriction must g(x) satisfy inside f(g(x))?", ["g(x) must be less than 1", "g(x) must not equal 1", "g(x) must be at least 1", "g(x) must be positive and even"]),
      mcq("q3", "What is the inverse of f(x)=3x+6?", ["(x-6)/3", "3x-6", "(x+6)/3", "1/(3x+6)"]),
      structured("q4", "For f(x)=2x-5 and g(x)=(x+5)/2, verify both compositions and explain what the result proves."),
    ],
  ),
  practiceQuiz(
    "mat111-week2-teach-back-mastery",
    "mat111-week-2",
    "Week 2 Teach-Back Mastery",
    "Challenge",
    [
      mcq("q1", "Which statement about f^(-1)(x) is correct?", ["It always equals 1/f(x)", "It exists for every quadratic on all real numbers", "It reverses f on the relevant domain when f is one-to-one", "It means f(x) raised to the power -1"]),
      mcq("q2", "For f(x)=x^2 restricted to x>=0, which inverse is correct?", ["sqrt(x)", "-sqrt(x)", "x^2", "1/x^2"]),
      mcq("q3", "Which domain is correct for (f/g)(x) if f(x)=sqrt(x) and g(x)=x-2?", ["All real numbers", "[0,2) union (2,infinity)", "[0,infinity)", "(2,infinity) only"]),
      structured("q4", "Teach Week 2 in five sentences: define a function, explain composition order, explain composition domain, explain one-to-one, and explain how to verify an inverse."),
    ],
  ),

  practiceQuiz(
    "mat111-week3-feynman-concepts",
    "mat111-week-3",
    "Week 3 Feynman Concepts",
    "Foundational",
    [
      mcq("q1", "What does f(-x)=f(x) tell you?", ["The function is even and has y-axis symmetry", "The function is odd", "The graph is shifted right", "The function has no inverse"]),
      mcq("q2", "What does y=f(x-5) do to the graph of y=f(x)?", ["Moves it left 5", "Moves it right 5", "Moves it up 5", "Reflects it in the y-axis"]),
      mcq("q3", "Which transformation is caused by y=-f(x)?", ["Reflection in the y-axis", "Horizontal stretch", "Reflection in the x-axis", "Shift downward by 1"]),
      structured("q4", "Explain to a younger learner why changes inside f( ) affect the horizontal direction while changes outside affect vertical position."),
    ],
  ),
  practiceQuiz(
    "mat111-week3-worked-reasoning",
    "mat111-week-3",
    "Week 3 Worked Reasoning",
    "Applied",
    [
      mcq("q1", "Starting from y=x^2, what is the vertex of y=(x+3)^2-2?", ["(3,-2)", "(-3,-2)", "(-3,2)", "(2,-3)"]),
      mcq("q2", "Which function is odd?", ["x^2+1", "x^3-x", "|x|", "x^2+x"]),
      mcq("q3", "How does y=f(2x) compare horizontally with y=f(x)?", ["It is compressed by factor 1/2", "It is stretched by factor 2", "It shifts right 2", "It reflects in the x-axis"]),
      structured("q4", "Describe, in order, how to obtain y=-2(x-4)^2+3 from y=x^2 and explain what each operation does to the graph."),
    ],
  ),
  practiceQuiz(
    "mat111-week3-teach-back-mastery",
    "mat111-week-3",
    "Week 3 Teach-Back Mastery",
    "Challenge",
    [
      mcq("q1", "If f is even, which point must appear whenever (4,-3) is on its graph?", ["(-4,3)", "(3,-4)", "(-4,-3)", "(4,3)"]),
      mcq("q2", "Which expression reflects f across the y-axis?", ["f(-x)", "-f(x)", "f(x)-1", "f(x+1)"]),
      mcq("q3", "Which sequence matches y=3-|x+2|?", ["Right 2, down 3", "Left 2, reflect in x-axis, up 3", "Left 3, reflect in y-axis", "Vertical stretch by 3 only"]),
      structured("q4", "Teach graph transformations without using memorized arrows: explain vertical changes, horizontal changes, reflections, and scale changes using input and output language."),
    ],
  ),

  practiceQuiz(
    "mat111-week4-feynman-concepts",
    "mat111-week-4",
    "Week 4 Feynman Concepts",
    "Foundational",
    [
      mcq("q1", "Why does the distance formula contain squares and a square root?", ["It is Pythagoras applied to horizontal and vertical changes", "Every coordinate formula must use squares", "It calculates slope first", "It averages the coordinates"]),
      mcq("q2", "What is the centre of (x-3)^2+(y+2)^2=16?", ["(-3,2)", "(3,-2)", "(3,2)", "(-3,-2)"]),
      mcq("q3", "What relation holds for slopes of perpendicular non-vertical lines?", ["They are equal", "They add to zero", "Their product is -1", "Their product is 1"]),
      structured("q4", "Explain how distance, midpoint, slope, line equations, and circle equations all come from interpreting coordinate differences geometrically."),
    ],
  ),
  practiceQuiz(
    "mat111-week4-worked-reasoning",
    "mat111-week-4",
    "Week 4 Worked Reasoning",
    "Applied",
    [
      mcq("q1", "Find the midpoint of A(-4,7) and B(6,-1).", ["(2,3)", "(1,3)", "(1,4)", "(5,6)"]),
      mcq("q2", "What is the slope through (2,5) and (8,-1)?", ["1", "-1", "-6", "6"]),
      mcq("q3", "Which line is perpendicular to a line of slope -3/4?", ["Slope 4/3", "Slope -4/3", "Slope 3/4", "Slope -3/4"]),
      structured("q4", "A circle has diameter endpoints (-2,1) and (4,9). Find its centre, radius, and standard equation, showing why each step works."),
    ],
  ),
  practiceQuiz(
    "mat111-week4-teach-back-mastery",
    "mat111-week-4",
    "Week 4 Teach-Back Mastery",
    "Challenge",
    [
      mcq("q1", "Which line through (1,2) has slope 5?", ["y=5x+2", "y-1=5(x-2)", "y-2=5(x-1)", "y+2=5(x+1)"]),
      mcq("q2", "The line through A and B has slope 2. What slope should its perpendicular bisector have?", ["-1/2", "1/2", "-2", "2"]),
      mcq("q3", "A circle has centre (0,0) and passes through (5,12). What is its equation?", ["x^2+y^2=17", "x^2+y^2=169", "x^2+y^2=13", "(x-5)^2+(y-12)^2=169"]),
      structured("q4", "Explain from scratch how you would construct the perpendicular bisector of a segment when only its two endpoints are given."),
    ],
  ),

  practiceQuiz(
    "mat111-week5-feynman-concepts",
    "mat111-week-5",
    "Week 5 Feynman Concepts",
    "Foundational",
    [
      mcq("q1", "What does the sign of a tell you in y=ax^2+bx+c?", ["Whether the parabola opens up or down", "The y-coordinate of every root", "The number of variables", "The x-intercept directly"]),
      mcq("q2", "Which feature is easiest to read from y=a(x-h)^2+k?", ["The discriminant", "The vertex (h,k)", "Both roots", "The y-intercept only"]),
      mcq("q3", "What does b^2-4ac=0 mean geometrically?", ["No real roots", "Two different real roots", "One repeated real root where the parabola touches the x-axis", "The parabola is a line"]),
      structured("q4", "Explain the same quadratic using general form, factored form, and vertex form, focusing on what each form reveals fastest."),
    ],
  ),
  practiceQuiz(
    "mat111-week5-worked-reasoning",
    "mat111-week-5",
    "Week 5 Worked Reasoning",
    "Applied",
    [
      mcq("q1", "What is the vertex of y=x^2-8x+11?", ["(4,5)", "(4,-5)", "(-4,-5)", "(8,11)"]),
      mcq("q2", "Complete the square: x^2+10x+7 equals which expression?", ["(x+10)^2-93", "(x+5)^2-18", "(x-5)^2+32", "(x+5)^2+7"]),
      mcq("q3", "For y=-2(x-1)^2+6, what is the maximum value?", ["6", "1", "-2", "There is no maximum"]),
      structured("q4", "Solve x^2-6x-7=0 in two different ways and explain how the roots appear on the graph."),
    ],
  ),
  practiceQuiz(
    "mat111-week5-teach-back-mastery",
    "mat111-week-5",
    "Week 5 Teach-Back Mastery",
    "Challenge",
    [
      mcq("q1", "A parabola has vertex (2,-3) and opens upward. Which range is correct?", ["y<=-3", "y>=2", "y>=-3", "All real y"]),
      mcq("q2", "Which equation has vertex (-4,5)?", ["y=(x-4)^2+5", "y=(x+4)^2+5", "y=(x+5)^2+4", "y=(x-4)^2-5"]),
      mcq("q3", "For h(t)=-4t^2+24t+2, when does the maximum occur?", ["t=6", "t=3", "t=-3", "t=2"]),
      structured("q4", "Teach a complete method for sketching a quadratic from y=ax^2+bx+c: opening direction, intercepts, axis, vertex, and range."),
    ],
  ),

  practiceQuiz(
    "mat111-week9-feynman-concepts",
    "mat111-week-9",
    "Week 9 Feynman Concepts",
    "Foundational",
    [
      mcq("q1", "What makes exponential change different from linear change?", ["Equal input steps multiply outputs by a constant factor", "Exponential functions always decrease", "They add the same amount each step", "Their graphs cross y=0"]),
      mcq("q2", "Which statement describes log_a(x)?", ["It multiplies x by a", "It asks which exponent on a produces x", "It is always 1/a^x", "It accepts every real x"]),
      mcq("q3", "What is the domain of log_a(x) for a>0, a!=1?", ["All real numbers", "x>=0", "x>0", "x!=1"]),
      structured("q4", "Explain exponentials and logarithms as the same relationship viewed forward and backward, using one numerical example."),
    ],
  ),
  practiceQuiz(
    "mat111-week9-worked-reasoning",
    "mat111-week-9",
    "Week 9 Worked Reasoning",
    "Applied",
    [
      mcq("q1", "Evaluate log_3(81).", ["3", "4", "27", "81"]),
      mcq("q2", "Which transformation takes y=2^x to y=2^(x-3)+4?", ["Left 3 and down 4", "Right 3 and up 4", "Right 4 and up 3", "Reflect and move up 4"]),
      mcq("q3", "Which expansion is correct for ln(x^3/y), with positive x,y?", ["3ln x-ln y", "ln x^3 * ln y", "3ln(x-y)", "ln x+ln y-3"]),
      structured("q4", "State the domain, range, intercept, and asymptote of y=log_2(x), then explain how each feature relates to y=2^x."),
    ],
  ),
  practiceQuiz(
    "mat111-week9-teach-back-mastery",
    "mat111-week-9",
    "Week 9 Teach-Back Mastery",
    "Challenge",
    [
      mcq("q1", "If 0<a<1, what happens to a^x as x increases?", ["It increases without bound", "It becomes negative", "It decreases toward zero", "It stays equal to 1"]),
      mcq("q2", "Which equation is equivalent to log_5(125)=3?", ["5^3=125", "125^3=5", "3^5=125", "5^125=3"]),
      mcq("q3", "What is the horizontal asymptote of y=3^x-7?", ["y=0", "x=-7", "y=-7", "x=0"]),
      structured("q4", "Teach the three logarithm laws and explain, with examples, why logs convert multiplication into addition and powers into multipliers."),
    ],
  ),

  practiceQuiz(
    "mat111-week10-feynman-concepts",
    "mat111-week-10",
    "Week 10 Feynman Concepts",
    "Foundational",
    [
      mcq("q1", "Why can 3^(2x)=3^8 be solved by equating exponents?", ["The exponential function with base 3 is one-to-one", "All exponents must be integers", "3 cancels like a coefficient", "The bases are positive so x=8"]),
      mcq("q2", "What does theta=s/r define?", ["Slope", "Degree measure", "Radian measure", "Cosine"]),
      mcq("q3", "In a right triangle, which ratio is tangent?", ["Adjacent/hypotenuse", "Hypotenuse/opposite", "Opposite/adjacent", "Adjacent/opposite"]),
      structured("q4", "Explain two 'undoing' ideas from this week: using logarithms to reach an exponent and using trig ratios to connect an angle with side lengths."),
    ],
  ),
  practiceQuiz(
    "mat111-week10-worked-reasoning",
    "mat111-week-10",
    "Week 10 Worked Reasoning",
    "Applied",
    [
      mcq("q1", "Solve 5^x=40 approximately in exact logarithmic form.", ["ln5/ln40", "ln40/ln5", "40/5", "ln(200)"]),
      mcq("q2", "Convert 225 degrees to radians.", ["5pi/4", "4pi/5", "3pi/4", "7pi/6"]),
      mcq("q3", "In a 7-24-25 right triangle, if opposite=7, what is cos theta?", ["7/25", "24/25", "7/24", "25/24"]),
      structured("q4", "Solve ln(x-2)=ln(7), state the domain restriction, and explain why the domain check matters."),
    ],
  ),
  practiceQuiz(
    "mat111-week10-teach-back-mastery",
    "mat111-week-10",
    "Week 10 Teach-Back Mastery",
    "Challenge",
    [
      mcq("q1", "Which angle is coterminal with -30 degrees?", ["30 degrees", "300 degrees", "330 degrees", "390 degrees"]),
      mcq("q2", "If sin theta=8/17 for an acute angle, what is csc theta?", ["17/8", "8/17", "15/17", "17/15"]),
      mcq("q3", "Which condensed form equals 2ln x-ln y?", ["ln(2x/y)", "ln(x^2/y)", "ln(x^2-y)", "ln(x/(2y))"]),
      structured("q4", "Teach a learner how to solve an exponential equation with logs, convert degrees/radians, and build all six right-triangle trig ratios from three side lengths."),
    ],
  ),

  practiceQuiz(
    "mat111-week11-feynman-concepts",
    "mat111-week-11",
    "Week 11 Feynman Concepts",
    "Foundational",
    [
      mcq("q1", "For a terminal point (x,y), what is r?", ["sqrt(x^2+y^2)", "x+y", "y/x", "x-y"]),
      mcq("q2", "Which coordinate ratio equals cosine?", ["y/r", "x/r", "y/x", "r/x"]),
      mcq("q3", "Why is tangent positive in Quadrant III?", ["x and y are both positive", "r is negative", "x and y are both negative so y/x is positive", "Tangent is always positive"]),
      structured("q4", "Explain any-angle trigonometry starting from one picture: a terminal point (x,y), the origin, and radius r."),
    ],
  ),
  practiceQuiz(
    "mat111-week11-worked-reasoning",
    "mat111-week-11",
    "Week 11 Worked Reasoning",
    "Applied",
    [
      mcq("q1", "For terminal point (8,-15), what is r?", ["15", "17", "23", "289"]),
      mcq("q2", "What is the reference angle for 210 degrees?", ["60 degrees", "30 degrees", "150 degrees", "210 degrees"]),
      mcq("q3", "What is sin(5pi/6)?", ["-1/2", "sqrt(3)/2", "1/2", "-sqrt(3)/2"]),
      structured("q4", "For point (-5,12), calculate all six trig functions and explain how the quadrant predicts their signs before calculation."),
    ],
  ),
  practiceQuiz(
    "mat111-week11-teach-back-mastery",
    "mat111-week-11",
    "Week 11 Teach-Back Mastery",
    "Challenge",
    [
      mcq("q1", "Which identity expresses cosine's even symmetry?", ["cos(-x)=-cos x", "cos(-x)=sin x", "cos(-x)=cos x", "cos(x+pi)=cos x"]),
      mcq("q2", "What is the period of sine?", ["2pi", "pi", "pi/2", "4pi"]),
      mcq("q3", "On the unit circle, what coordinates correspond to angle theta?", ["(sin theta, cos theta)", "(cos theta, sin theta)", "(tan theta,1)", "(1,sec theta)"]),
      structured("q4", "Teach how quadrant signs, reference angles, the unit circle, parity, and periodicity work together to evaluate trig functions of unfamiliar angles."),
    ],
  ),

  practiceQuiz(
    "mat111-week13-feynman-concepts",
    "mat111-week-13",
    "Week 13 Feynman Concepts",
    "Foundational",
    [
      mcq("q1", "Which statement is a trigonometric identity?", ["sin x=1/2", "tan x=0", "sin^2 x+cos^2 x=1", "cos x=0"]),
      mcq("q2", "Which quotient identity is correct?", ["tan x=cos x/sin x", "tan x=sin x/cos x", "sec x=sin x/cos x", "cot x=sin x/cos x"]),
      mcq("q3", "Which Pythagorean identity follows by dividing sin^2 x+cos^2 x=1 by cos^2 x?", ["1+cot^2 x=csc^2 x", "sin^2 x=1-cos x", "1+tan^2 x=sec^2 x", "tan^2 x+sec^2 x=1"]),
      structured("q4", "Explain the difference between proving an identity and solving a trig equation, including what the final answer looks like in each case."),
    ],
  ),
  practiceQuiz(
    "mat111-week13-worked-reasoning",
    "mat111-week-13",
    "Week 13 Worked Reasoning",
    "Applied",
    [
      mcq("q1", "Simplify (1-sin^2 x)/cos x where defined.", ["sin x", "cos x", "sec x", "1"]),
      mcq("q2", "Solve sin x=0 on [0,2pi].", ["0 and pi only", "pi/2 and 3pi/2", "0, pi, and 2pi", "pi only"]),
      mcq("q3", "Which formula equals sin(2x)?", ["2sin x cos x", "sin^2 x-cos^2 x", "2sin x", "sin x+cos x"]),
      structured("q4", "Use a sum formula to derive an exact expression for sin75 degrees and explain why 75=45+30 is useful."),
    ],
  ),
  practiceQuiz(
    "mat111-week13-teach-back-mastery",
    "mat111-week-13",
    "Week 13 Teach-Back Mastery",
    "Challenge",
    [
      mcq("q1", "Which expression is a power-reducing identity for cos^2 x?", ["1-cos2x", "(1-cos2x)/2", "(1+cos2x)/2", "2cos x"]),
      mcq("q2", "If cos x is nonzero, sin x/cos x equals what?", ["tan x", "cot x", "sec x", "csc x"]),
      mcq("q3", "What is the best first move when verifying an identity containing sec and tan?", ["Replace x with zero", "Look for identities such as 1+tan^2=sec^2 or rewrite in sine/cosine", "Square both sides immediately", "Solve for x"]),
      structured("q4", "Teach a strategy for choosing among reciprocal, quotient, Pythagorean, sum/difference, double-angle, and power-reducing identities based on the shape of a problem."),
    ],
  ),

  practiceQuiz(
    "mat111-week14-feynman-concepts",
    "mat111-week-14",
    "Week 14 Feynman Concepts",
    "Foundational",
    [
      mcq("q1", "What defining fact makes complex-number arithmetic work?", ["i^2=-1", "i=1", "i^2=1", "i is a negative real number"]),
      mcq("q2", "For z=4-7i, what is the imaginary part?", ["-7i", "-7", "7", "4"]),
      mcq("q3", "What is the conjugate of 3+5i?", ["-3-5i", "3+5i", "3-5i", "-3+5i"]),
      structured("q4", "Explain complex numbers as an extension of real numbers, then explain why conjugates are useful rather than just a notation trick."),
    ],
  ),
  practiceQuiz(
    "mat111-week14-worked-reasoning",
    "mat111-week-14",
    "Week 14 Worked Reasoning",
    "Applied",
    [
      mcq("q1", "Compute (2+3i)+(5-4i).", ["7+7i", "7-i", "-3+7i", "10-12i"]),
      mcq("q2", "Compute (1+2i)(3-i).", ["1+5i", "5+5i", "5+i", "3+i"]),
      mcq("q3", "What is (4+3i)(4-3i)?", ["7", "25", "16-9i", "16+9i"]),
      structured("q4", "Divide (2+i) by (1-2i), show the conjugate step, and write the final answer in a+bi form."),
    ],
  ),
  practiceQuiz(
    "mat111-week14-teach-back-mastery",
    "mat111-week-14",
    "Week 14 Teach-Back Mastery",
    "Challenge",
    [
      mcq("q1", "If 2x+(y+1)i=8-3i, what is x?", ["2", "-4", "4", "8"]),
      mcq("q2", "What is sqrt(-49) in complex form?", ["7i", "-7", "49i", "-7i only"]),
      mcq("q3", "Which expression is always real for z=a+bi?", ["z+i", "z^2", "z times conjugate(z)", "z/i"]),
      structured("q4", "Teach a learner how to add, multiply, and divide complex numbers, making clear exactly where i^2=-1 and conjugates enter the process."),
    ],
  ),

  practiceQuiz(
    "mat111-week15-feynman-concepts",
    "mat111-week-15",
    "Week 15 Feynman Concepts",
    "Foundational",
    [
      mcq("q1", "What does the modulus of z=a+bi represent?", ["Its real part", "Its argument", "Its distance from the origin", "Its imaginary coefficient only"]),
      mcq("q2", "In polar form r(cos theta+i sin theta), what does theta represent?", ["The modulus", "The direction/argument", "The real part", "The conjugate"]),
      mcq("q3", "When multiplying complex numbers in polar form, what happens to arguments?", ["They are multiplied", "They are divided", "They are added", "They are discarded"]),
      structured("q4", "Explain rectangular and polar form as two coordinate systems for the same complex number and say when each form is most useful."),
    ],
  ),
  practiceQuiz(
    "mat111-week15-worked-reasoning",
    "mat111-week-15",
    "Week 15 Worked Reasoning",
    "Applied",
    [
      mcq("q1", "What is the modulus of -6+8i?", ["2", "10", "14", "100"]),
      mcq("q2", "Convert 2(cos(pi/3)+i sin(pi/3)) to rectangular form.", ["sqrt(3)+i", "1+sqrt(3)i", "2+2i", "sqrt(3)+2i"]),
      mcq("q3", "Using De Moivre, (cis 30 degrees)^3 equals what?", ["cis 10 degrees", "cis 60 degrees", "cis 90 degrees", "3cis30 degrees"]),
      structured("q4", "Find the cube roots of 8 in polar form and explain why the three roots are separated by 120 degrees."),
    ],
  ),
  practiceQuiz(
    "mat111-week15-teach-back-mastery",
    "mat111-week-15",
    "Week 15 Teach-Back Mastery",
    "Challenge",
    [
      mcq("q1", "What are the fourth roots of a nonzero complex number spaced by in angle?", ["pi/4", "2pi", "pi/2", "pi"]),
      mcq("q2", "What is the principal argument range used in the MAT111 notes?", ["(-pi,pi]", "[0,pi] only", "All real values with no convention", "(-pi/2,pi/2)"]),
      mcq("q3", "For z1=r1 cis a and z2=r2 cis b, what is z1/z2?", ["(r1/r2)cis(a-b)", "(r1*r2)cis(a+b)", "(r1-r2)cis(a/b)", "(r2/r1)cis(b-a)"]),
      structured("q4", "Teach the full Week 15 pipeline: plot a complex number, find modulus/argument, convert to polar, multiply or power it, then find roots geometrically."),
    ],
  ),
];

export function getMat111FeynmanQuiz(id: string) {
  return mat111FeynmanQuizzes.find((quiz) => quiz.id === id);
}

export function getMat111FeynmanQuizzesByCourse(courseId: string) {
  return courseId === MAT111_COURSE_ID ? mat111FeynmanQuizzes : [];
}
