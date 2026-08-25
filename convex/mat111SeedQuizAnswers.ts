import type { SeedQuizAnswer } from "./seedQuizAnswers";

export const mat111SeedQuizAnswers: SeedQuizAnswer[] = [
  { quizId: "mat111-week2-function-combinations", questionId: "q1", answerIndex: 0, explanation: "Adding f(x)=2x-3 and g(x)=x^2-1 gives x^2+2x-4." },
  { quizId: "mat111-week2-function-combinations", questionId: "q2", answerIndex: 2, explanation: "(fg)(x)=x^2(x-3), so (fg)(4)=16(1)=16." },
  { quizId: "mat111-week2-function-combinations", questionId: "q3", answerIndex: 0, explanation: "sqrt(x) requires x>=0, sqrt(4-x^2) requires -2<=x<=2, and the quotient denominator cannot be zero, leaving [0,2)." },
  { quizId: "mat111-week2-function-combinations", questionId: "q4", answerIndex: -1, explanation: "(f o g)(x)=f(g(x)) means the output g(x) becomes the input of f. The domain is the set of x in the domain of g for which g(x) is also in the domain of f." },

  { quizId: "mat111-week2-inverses", questionId: "q1", answerIndex: 0, explanation: "The lecture states that a function has an inverse function if and only if it is one-to-one." },
  { quizId: "mat111-week2-inverses", questionId: "q2", answerIndex: 0, explanation: "The horizontal line test says every horizontal line must intersect the graph at most once." },
  { quizId: "mat111-week2-inverses", questionId: "q3", answerIndex: 0, explanation: "From y=(5-3x)/2, solve 2y=5-3x to get x=(5-2y)/3, hence f^(-1)(x)=(5-2x)/3." },
  { quizId: "mat111-week2-inverses", questionId: "q4", answerIndex: -1, explanation: "For f(x)=2x^3-1 and g(x)=cuberoot((x+1)/2), f(g(x))=2((x+1)/2)-1=x and g(f(x))=cuberoot((2x^3-1+1)/2)=cuberoot(x^3)=x. Therefore the compositions are the identity and the functions are inverses." },

  { quizId: "mat111-week3-symmetry-parent-graphs", questionId: "q1", answerIndex: 0, explanation: "g(-x)=(-x)^3-(-x)=-x^3+x=-(x^3-x), so g is odd." },
  { quizId: "mat111-week3-symmetry-parent-graphs", questionId: "q2", answerIndex: 0, explanation: "h(-x)=(-x)^2+1=x^2+1=h(x), so h is even." },
  { quizId: "mat111-week3-symmetry-parent-graphs", questionId: "q3", answerIndex: 0, explanation: "Y-axis symmetry is the defining graph property of an even function, so f(-x)=f(x)." },
  { quizId: "mat111-week3-symmetry-parent-graphs", questionId: "q4", answerIndex: -1, explanation: "For f(x)=x^3-1, f(-x)=-x^3-1. This is neither f(x)=x^3-1 nor -f(x)=-x^3+1, so the function is neither even nor odd." },

  { quizId: "mat111-week3-transformations", questionId: "q1", answerIndex: 0, explanation: "Replacing x by x+c shifts the graph horizontally c units to the left." },
  { quizId: "mat111-week3-transformations", questionId: "q2", answerIndex: 0, explanation: "Multiplying f(x)=|x| by 3 multiplies every y-value by 3, producing a vertical stretch by factor 3." },
  { quizId: "mat111-week3-transformations", questionId: "q3", answerIndex: 0, explanation: "The minus sign reflects x^2 in the x-axis, x+2 shifts two units left, and +3 shifts three units upward." },
  { quizId: "mat111-week3-transformations", questionId: "q4", answerIndex: -1, explanation: "Replacing x with (1/2)x gives a horizontal stretch by factor 2: an x-coordinate that was x on f appears at 2x on g." },

  { quizId: "mat111-week4-coordinate-geometry", questionId: "q1", answerIndex: 0, explanation: "The distance is sqrt((3-(-2))^2+(4-1)^2)=sqrt(25+9)=sqrt(34)." },
  { quizId: "mat111-week4-coordinate-geometry", questionId: "q2", answerIndex: 0, explanation: "The midpoint is ((-5+9)/2,(-3+3)/2)=(2,0)." },
  { quizId: "mat111-week4-coordinate-geometry", questionId: "q3", answerIndex: 0, explanation: "Substituting centre (h,k)=(2,-1) and r=5 into (x-h)^2+(y-k)^2=r^2 gives (x-2)^2+(y+1)^2=25." },
  { quizId: "mat111-week4-coordinate-geometry", questionId: "q4", answerIndex: -1, explanation: "PQ^2=(4-2)^2+(0-1)^2=5, PR^2=(5-2)^2+(7-1)^2=45, and QR^2=(5-4)^2+(7-0)^2=50. Since 5+45=50, QR is the hypotenuse and the right angle is at P, i.e. angle QPR." },

  { quizId: "mat111-week4-lines-circles", questionId: "q1", answerIndex: 0, explanation: "m=(1-0)/(3-(-2))=1/5." },
  { quizId: "mat111-week4-lines-circles", questionId: "q2", answerIndex: 0, explanation: "Using y-(-2)=3(x-1) gives y+2=3x-3, hence y=3x-5." },
  { quizId: "mat111-week4-lines-circles", questionId: "q3", answerIndex: 0, explanation: "A perpendicular slope is the negative reciprocal of 2/3, namely -3/2, and (2/3)(-3/2)=-1." },
  { quizId: "mat111-week4-lines-circles", questionId: "q4", answerIndex: -1, explanation: "The centre is the midpoint (-1/2,7/2). The diameter length is sqrt((3+4)^2+(5-2)^2)=sqrt(58), so r=sqrt(58)/2. Therefore (x+1/2)^2+(y-7/2)^2=58/4=29/2." },

  { quizId: "mat111-week5-quadratic-graphs", questionId: "q1", answerIndex: 0, explanation: "The graph of a quadratic function is a parabola." },
  { quizId: "mat111-week5-quadratic-graphs", questionId: "q2", answerIndex: 0, explanation: "A negative discriminant b^2-4ac means the quadratic formula has no real roots, so the graph has no real x-intercepts." },
  { quizId: "mat111-week5-quadratic-graphs", questionId: "q3", answerIndex: 0, explanation: "For y=x^2, squares are nonnegative and zero occurs at x=0, so the range is [0,infinity)." },
  { quizId: "mat111-week5-quadratic-graphs", questionId: "q4", answerIndex: -1, explanation: "Use f(x)=a(x-1)^2+2. Because f(3)=-6, -6=4a+2, so a=-2. The equation is f(x)=-2(x-1)^2+2." },

  { quizId: "mat111-week5-vertex-standard-form", questionId: "q1", answerIndex: 0, explanation: "For ax^2+bx+c, completing the square gives vertex x-coordinate -b/(2a)." },
  { quizId: "mat111-week5-vertex-standard-form", questionId: "q2", answerIndex: 0, explanation: "x=-8/(2*2)=-2 and f(-2)=2(4)+8(-2)+7=-1, so the vertex is (-2,-1)." },
  { quizId: "mat111-week5-vertex-standard-form", questionId: "q3", answerIndex: 0, explanation: "When a<0 the parabola opens downward, so the vertex is its maximum point." },
  { quizId: "mat111-week5-vertex-standard-form", questionId: "q4", answerIndex: -1, explanation: "Completing the square gives f(x)=a(x+b/(2a))^2 + c - b^2/(4a). Thus the vertex is (-b/(2a), c-b^2/(4a))." },

  { quizId: "mat111-week9-exponential-foundations", questionId: "q1", answerIndex: 0, explanation: "The lecture defines f(x)=a^x for a>0 with a!=1." },
  { quizId: "mat111-week9-exponential-foundations", questionId: "q2", answerIndex: 1, explanation: "2^(-3)=1/(2^3)=1/8." },
  { quizId: "mat111-week9-exponential-foundations", questionId: "q3", answerIndex: 0, explanation: "For a>1, the exponential function is increasing on all real numbers." },
  { quizId: "mat111-week9-exponential-foundations", questionId: "q4", answerIndex: -1, explanation: "For c>0, h(x)=f(x+c) shifts the graph of f(x) horizontally c units to the left." },

  { quizId: "mat111-week9-logarithms", questionId: "q1", answerIndex: 0, explanation: "The inverse definition is y=log_a(x) if and only if x=a^y." },
  { quizId: "mat111-week9-logarithms", questionId: "q2", answerIndex: 2, explanation: "10^4=10000, so log_10(10000)=4." },
  { quizId: "mat111-week9-logarithms", questionId: "q3", answerIndex: 0, explanation: "For positive x and y, the product law is ln(xy)=ln(x)+ln(y)." },
  { quizId: "mat111-week9-logarithms", questionId: "q4", answerIndex: -1, explanation: "The domain is (0,infinity), the range is all real numbers, the x-intercept is (1,0), and the y-axis is a vertical asymptote." },

  { quizId: "mat111-week10-exp-log-equations", questionId: "q1", answerIndex: 0, explanation: "One-to-one logarithms give 2x+1=3/5, so 2x=-2/5 and x=-1/5, which lies in the domain x>-1/2." },
  { quizId: "mat111-week10-exp-log-equations", questionId: "q2", answerIndex: 0, explanation: "2ln(x)=ln(x^2), so 6-5x=x^2 and (x+6)(x-1)=0. The logarithmic domain is 0<x<6/5, so only x=1 is valid." },
  { quizId: "mat111-week10-exp-log-equations", questionId: "q3", answerIndex: 0, explanation: "The quotient law gives log_2(2x/(x-1))=log_2(5), so 2x/(x-1)=5 and x=5/3, which satisfies x>1." },
  { quizId: "mat111-week10-exp-log-equations", questionId: "q4", answerIndex: -1, explanation: "Taking natural logs gives x ln 4=ln 100, so x=ln(100)/ln(4), approximately 3.32." },

  { quizId: "mat111-week10-angles-right-trig", questionId: "q1", answerIndex: 0, explanation: "150 degrees*(pi/180 degrees)=5pi/6." },
  { quizId: "mat111-week10-angles-right-trig", questionId: "q2", answerIndex: 0, explanation: "Radian measure is defined by theta=s/r, the signed arc length divided by the radius." },
  { quizId: "mat111-week10-angles-right-trig", questionId: "q3", answerIndex: 0, explanation: "For an acute angle in a right triangle, sine is opposite side divided by hypotenuse." },
  { quizId: "mat111-week10-angles-right-trig", questionId: "q4", answerIndex: -1, explanation: "With opposite=5, adjacent=12 and hypotenuse=13: sin(theta)=5/13, cos(theta)=12/13, tan(theta)=5/12, cot(theta)=12/5, csc(theta)=13/5 and sec(theta)=13/12." },

  { quizId: "mat111-week11-angle-values", questionId: "q1", answerIndex: 1, explanation: "By definition, sin(theta)=y/r." },
  { quizId: "mat111-week11-angle-values", questionId: "q2", answerIndex: 3, explanation: "For (-3,4), r=5 and cos(theta)=x/r=-3/5." },
  { quizId: "mat111-week11-angle-values", questionId: "q3", answerIndex: 2, explanation: "In Quadrant III, sine and cosine are negative while tangent is positive." },
  { quizId: "mat111-week11-angle-values", questionId: "q4", answerIndex: -1, explanation: "For (4,3), r=5. Therefore sin(theta)=3/5, cos(theta)=4/5, tan(theta)=3/4, cot(theta)=4/3, csc(theta)=5/3 and sec(theta)=5/4." },

  { quizId: "mat111-week11-reference-graphs", questionId: "q1", answerIndex: 2, explanation: "300 degrees is in Quadrant IV, so its reference angle is 360-300=60 degrees." },
  { quizId: "mat111-week11-reference-graphs", questionId: "q2", answerIndex: 1, explanation: "4pi/3 lies in Quadrant III with reference angle pi/3, so cos(4pi/3)=-cos(pi/3)=-1/2." },
  { quizId: "mat111-week11-reference-graphs", questionId: "q3", answerIndex: 2, explanation: "Both sine and cosine are 2pi-periodic." },
  { quizId: "mat111-week11-reference-graphs", questionId: "q4", answerIndex: -1, explanation: "For f(x)=sin(x), the domain is all real numbers, the range is [-1,1], the period is 2pi, and the graph is symmetric about the origin because sine is odd." },

  { quizId: "mat111-week13-identities", questionId: "q1", answerIndex: 0, explanation: "The quotient identity is tan(theta)=sin(theta)/cos(theta), where cosine is nonzero." },
  { quizId: "mat111-week13-identities", questionId: "q2", answerIndex: 0, explanation: "One Pythagorean identity is 1+tan^2(theta)=sec^2(theta)." },
  { quizId: "mat111-week13-identities", questionId: "q3", answerIndex: 0, explanation: "sin x + cot x cos x = sin x + cos^2 x/sin x = (sin^2 x+cos^2 x)/sin x = 1/sin x = csc x." },
  { quizId: "mat111-week13-identities", questionId: "q4", answerIndex: -1, explanation: "sec(u)=-3/2 gives cos(u)=-2/3. Since tan(u)>0 while cosine is negative, u is in Quadrant III, so sine is negative. From sin^2 u=1-4/9=5/9: sin(u)=-sqrt(5)/3. Then tan(u)=sqrt(5)/2, cot(u)=2sqrt(5)/5, sec(u)=-3/2 and csc(u)=-3sqrt(5)/5." },

  { quizId: "mat111-week13-trig-equations-formulas", questionId: "q1", answerIndex: 0, explanation: "2sin x-1=0 gives sin x=1/2, whose solutions in [0,2pi) are pi/6 and 5pi/6." },
  { quizId: "mat111-week13-trig-equations-formulas", questionId: "q2", answerIndex: 0, explanation: "Factor as (2sin x+1)(sin x-1)=0. In [0,2pi], sin x=-1/2 gives 7pi/6 and 11pi/6, while sin x=1 gives pi/2." },
  { quizId: "mat111-week13-trig-equations-formulas", questionId: "q3", answerIndex: 0, explanation: "cos(75)=cos(45+30)=cos45 cos30-sin45 sin30=(sqrt(6)-sqrt(2))/4." },
  { quizId: "mat111-week13-trig-equations-formulas", questionId: "q4", answerIndex: -1, explanation: "Use sin(2x)=2sin x cos x: 2cos x+2sin x cos x=2cos x(1+sin x)=0. Thus cos x=0 or sin x=-1. The general solutions reduce to x=pi/2+2npi or x=3pi/2+2npi, n an integer." },

  { quizId: "mat111-week14-complex-basics", questionId: "q1", answerIndex: 1, explanation: "The imaginary unit is defined so that i^2=-1." },
  { quizId: "mat111-week14-complex-basics", questionId: "q2", answerIndex: 0, explanation: "A complex number is written in standard form a+bi for real a and b." },
  { quizId: "mat111-week14-complex-basics", questionId: "q3", answerIndex: 0, explanation: "Equality requires the real parts and imaginary coefficients to match: a=c and b=d." },
  { quizId: "mat111-week14-complex-basics", questionId: "q4", answerIndex: -1, explanation: "The conjugate of z=a+bi is a-bi. Their product is (a+bi)(a-bi)=a^2-(bi)^2=a^2+b^2." },

  { quizId: "mat111-week14-complex-operations", questionId: "q1", answerIndex: 0, explanation: "Combining real and imaginary parts gives (3-i)+(2+3i)=5+2i." },
  { quizId: "mat111-week14-complex-operations", questionId: "q2", answerIndex: 1, explanation: "Using i^2=-1 gives (2-3i)(4+3i)=8+6i-12i-9i^2=17-6i." },
  { quizId: "mat111-week14-complex-operations", questionId: "q3", answerIndex: 0, explanation: "Multiplying numerator and denominator by 4+2i gives (14+6i)/20=7/10+(3/10)i." },
  { quizId: "mat111-week14-complex-operations", questionId: "q4", answerIndex: -1, explanation: "Using conjugates, 2/(1+i)=1-i and 3/(1-i)=3(1+i)/2. Subtracting gives -1/2-(5/2)i." },

  { quizId: "mat111-week15-complex-plane-polar", questionId: "q1", answerIndex: 0, explanation: "The real part a is the horizontal coordinate and imaginary coefficient b is the vertical coordinate, so z=a+bi is represented by (a,b)." },
  { quizId: "mat111-week15-complex-plane-polar", questionId: "q2", answerIndex: 0, explanation: "Pythagoras' theorem gives |z|=sqrt(a^2+b^2)." },
  { quizId: "mat111-week15-complex-plane-polar", questionId: "q3", answerIndex: 0, explanation: "For 1+sqrt(3)i, the modulus is 2 and the principal argument is pi/3, giving 2(cos(pi/3)+i sin(pi/3))." },
  { quizId: "mat111-week15-complex-plane-polar", questionId: "q4", answerIndex: -1, explanation: "For z=3-4i, |z|=sqrt(9+16)=5. The lecture gives principal argument approximately -3pi/10. Thus z=5(cos(-3pi/10)+i sin(-3pi/10)), using that lecture approximation for the argument." },

  { quizId: "mat111-week15-de-moivre-roots", questionId: "q1", answerIndex: 0, explanation: "De Moivre's theorem states (cos(theta)+i sin(theta))^n=cos(n theta)+i sin(n theta)." },
  { quizId: "mat111-week15-de-moivre-roots", questionId: "q2", answerIndex: 0, explanation: "1+i sqrt(3)=2(cos(pi/3)+i sin(pi/3)); raising to the sixth power gives 2^6(cos(2pi)+i sin(2pi))=64." },
  { quizId: "mat111-week15-de-moivre-roots", questionId: "q3", answerIndex: 0, explanation: "For z^4=1, the four equally spaced arguments are 0, pi/2, pi and 3pi/2, giving roots 1, i, -1 and -i." },
  { quizId: "mat111-week15-de-moivre-roots", questionId: "q4", answerIndex: -1, explanation: "If w=rho(cos(alpha)+i sin(alpha)), the n roots are z_k=rho^(1/n)[cos((alpha+2kpi)/n)+i sin((alpha+2kpi)/n)] for k=0,1,...,n-1. These give the n distinct roots." },
];

export function getMat111SeedQuizAnswer(quizId: string, questionId: string) {
  const answer = mat111SeedQuizAnswers.find((item) => item.quizId === quizId && item.questionId === questionId);

  if (!answer) {
    throw new Error(`Missing MAT111 answer authority for quiz ${quizId}, question ${questionId}.`);
  }

  return answer;
}
