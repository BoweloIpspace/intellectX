import type { SeedQuizAnswer } from "./seedQuizAnswers";

export const mat111SeedQuizAnswers: SeedQuizAnswer[] = [
  {
    quizId: "mat111-week9-exponential-foundations",
    questionId: "q1",
    answerIndex: 0,
    explanation: "The lecture defines f(x) = a^x for a > 0 with a != 1.",
  },
  {
    quizId: "mat111-week9-exponential-foundations",
    questionId: "q2",
    answerIndex: 1,
    explanation: "2^(-3) = 1/(2^3) = 1/8.",
  },
  {
    quizId: "mat111-week9-exponential-foundations",
    questionId: "q3",
    answerIndex: 0,
    explanation: "For a > 1, the exponential function is increasing on all real numbers.",
  },
  {
    quizId: "mat111-week9-exponential-foundations",
    questionId: "q4",
    answerIndex: -1,
    explanation: "For c > 0, h(x) = f(x + c) shifts the graph of f(x) horizontally c units to the left.",
  },
  {
    quizId: "mat111-week9-logarithms",
    questionId: "q1",
    answerIndex: 0,
    explanation: "The definition states y = log_a(x) if and only if x = a^y.",
  },
  {
    quizId: "mat111-week9-logarithms",
    questionId: "q2",
    answerIndex: 2,
    explanation: "10^4 = 10000, so log_10(10000) = 4.",
  },
  {
    quizId: "mat111-week9-logarithms",
    questionId: "q3",
    answerIndex: 0,
    explanation: "For positive x and y, ln(xy) = ln(x) + ln(y).",
  },
  {
    quizId: "mat111-week9-logarithms",
    questionId: "q4",
    answerIndex: -1,
    explanation:
      "The domain is (0, infinity), the range is all real numbers, the x-intercept is (1, 0), and the y-axis is a vertical asymptote.",
  },
  {
    quizId: "mat111-week11-angle-values",
    questionId: "q1",
    answerIndex: 1,
    explanation: "By definition, sin(theta) = y/r.",
  },
  {
    quizId: "mat111-week11-angle-values",
    questionId: "q2",
    answerIndex: 3,
    explanation: "For (-3, 4), r = 5 and cos(theta) = x/r = -3/5.",
  },
  {
    quizId: "mat111-week11-angle-values",
    questionId: "q3",
    answerIndex: 2,
    explanation: "In Quadrant III, sine and cosine are negative while tangent is positive.",
  },
  {
    quizId: "mat111-week11-angle-values",
    questionId: "q4",
    answerIndex: -1,
    explanation:
      "For (4, 3), r = 5. Therefore sin(theta) = 3/5, cos(theta) = 4/5, tan(theta) = 3/4, cot(theta) = 4/3, csc(theta) = 5/3, and sec(theta) = 5/4.",
  },
  {
    quizId: "mat111-week11-reference-graphs",
    questionId: "q1",
    answerIndex: 2,
    explanation: "300 degrees is in Quadrant IV, so its reference angle is 360 degrees - 300 degrees = 60 degrees.",
  },
  {
    quizId: "mat111-week11-reference-graphs",
    questionId: "q2",
    answerIndex: 1,
    explanation: "4*pi/3 lies in Quadrant III with reference angle pi/3, so cos(4*pi/3) = -cos(pi/3) = -1/2.",
  },
  {
    quizId: "mat111-week11-reference-graphs",
    questionId: "q3",
    answerIndex: 2,
    explanation: "Both sine and cosine are 2*pi-periodic.",
  },
  {
    quizId: "mat111-week11-reference-graphs",
    questionId: "q4",
    answerIndex: -1,
    explanation:
      "For f(x) = sin(x), the domain is all real numbers, the range is [-1, 1], the period is 2*pi, and the graph is symmetric with respect to the origin because sine is odd.",
  },
  {
    quizId: "mat111-week14-complex-basics",
    questionId: "q1",
    answerIndex: 1,
    explanation: "The imaginary unit is defined so that i^2 = -1.",
  },
  {
    quizId: "mat111-week14-complex-basics",
    questionId: "q2",
    answerIndex: 0,
    explanation: "A complex number is written in standard form as a + bi for real a and b.",
  },
  {
    quizId: "mat111-week14-complex-basics",
    questionId: "q3",
    answerIndex: 0,
    explanation: "Equality requires the real parts to match and the imaginary coefficients to match: a = c and b = d.",
  },
  {
    quizId: "mat111-week14-complex-basics",
    questionId: "q4",
    answerIndex: -1,
    explanation: "The conjugate of z = a + bi is a - bi, and z times its conjugate is a^2 + b^2.",
  },
  {
    quizId: "mat111-week14-complex-operations",
    questionId: "q1",
    answerIndex: 0,
    explanation: "Combining real and imaginary parts gives (3 - i) + (2 + 3i) = 5 + 2i.",
  },
  {
    quizId: "mat111-week14-complex-operations",
    questionId: "q2",
    answerIndex: 1,
    explanation: "Using i^2 = -1 gives (2 - 3i)(4 + 3i) = 17 - 6i.",
  },
  {
    quizId: "mat111-week14-complex-operations",
    questionId: "q3",
    answerIndex: 0,
    explanation: "Multiplying numerator and denominator by 4 + 2i gives 7/10 + (3/10)i.",
  },
  {
    quizId: "mat111-week14-complex-operations",
    questionId: "q4",
    answerIndex: -1,
    explanation: "The lecture simplifies 2/(1 + i) - 3/(1 - i) to -1/2 - (5/2)i.",
  },
];

export function getMat111SeedQuizAnswer(quizId: string, questionId: string) {
  const answer = mat111SeedQuizAnswers.find((item) => item.quizId === quizId && item.questionId === questionId);

  if (!answer) {
    throw new Error(`Missing MAT111 answer authority for quiz ${quizId}, question ${questionId}.`);
  }

  return answer;
}
