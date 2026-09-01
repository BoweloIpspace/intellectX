import type { SeedQuizAnswer } from "./seedQuizAnswers";

function quizAnswers(
  quizId: string,
  answerIndexes: [number, number, number, number],
  explanations: [string, string, string, string],
): SeedQuizAnswer[] {
  return answerIndexes.map((answerIndex, index) => ({
    quizId,
    questionId: `q${index + 1}`,
    answerIndex,
    explanation: explanations[index],
  }));
}

export const mat111FeynmanSeedQuizAnswers: SeedQuizAnswer[] = [
  ...quizAnswers(
    "mat111-week2-feynman-concepts",
    [0, 1, 2, -1],
    [
      "A function assigns each allowed input exactly one output. The rule may have any valid mathematical form; it does not need to be quadratic or cross an axis.",
      "Composition is evaluated from the inside outward, so in f(g(x)) the function g acts first and its output becomes the input of f.",
      "An inverse reverses outputs back to inputs. If two inputs shared one output, that output would not know which input to return to, so the inverse would fail the function rule.",
      "Combining functions means using the same input in both functions and then adding, subtracting, multiplying, or dividing their outputs. Composition sends one function's output into another function. An inverse reverses a one-to-one function so that composing the function and its inverse returns the original input.",
    ],
  ),
  ...quizAnswers(
    "mat111-week2-worked-reasoning",
    [0, 2, 0, -1],
    [
      "g(3)=6 and then f(6)=6+4=10, so (f o g)(3)=10.",
      "Because f(u)=sqrt(u-1), its input u must satisfy u-1>=0. Therefore the inner output must satisfy g(x)>=1.",
      "Write y=3x+6, swap x and y, and solve x=3y+6 for y. This gives y=(x-6)/3.",
      "f(g(x))=2((x+5)/2)-5=x and g(f(x))=((2x-5)+5)/2=x. Both compositions are the identity, proving the functions undo each other and are inverses on their domains.",
    ],
  ),
  ...quizAnswers(
    "mat111-week2-teach-back-mastery",
    [2, 0, 1, -1],
    [
      "f^(-1) denotes the inverse function: the rule that reverses f when f is one-to-one on the chosen domain. It is not the reciprocal 1/f.",
      "Restricting x^2 to x>=0 makes it one-to-one. Solving y=x^2 with x>=0 gives x=sqrt(y), so the inverse is sqrt(x).",
      "sqrt(x) requires x>=0, while division by x-2 excludes x=2. The combined domain is [0,2) union (2,infinity).",
      "A complete teach-back should say: a function gives one output per allowed input; f(g(x)) applies g first; composition keeps only x for which g is defined and g(x) is allowed by f; one-to-one means outputs are not reused; and an inverse is verified by getting x from both f(f^(-1)(x)) and f^(-1)(f(x)).",
    ],
  ),

  ...quizAnswers(
    "mat111-week3-feynman-concepts",
    [0, 1, 2, -1],
    [
      "f(-x)=f(x) is the algebraic test for an even function, whose graph is symmetric about the y-axis.",
      "Replacing x by x-5 means the old input x is reached five units later, so the graph moves five units to the right.",
      "-f(x) multiplies every output by -1, flipping y-values and reflecting the graph across the x-axis.",
      "Inside changes alter which input reaches a particular old point, so they act horizontally and appear with the opposite direction. Outside changes directly alter outputs, so they act vertically in the same sign direction.",
    ],
  ),
  ...quizAnswers(
    "mat111-week3-worked-reasoning",
    [1, 1, 0, -1],
    [
      "Vertex form y=(x-h)^2+k has vertex (h,k). Here x+3=x-(-3), so the vertex is (-3,-2).",
      "For f(x)=x^3-x, f(-x)=-x^3+x=-(x^3-x), so the function is odd.",
      "In f(2x), the same old input is reached with half the x-coordinate, so the graph is horizontally compressed by factor 1/2.",
      "Start with y=x^2. Replace x by x-4 to shift right 4, multiply outputs by -2 to reflect across the x-axis and vertically stretch by factor 2, then add 3 to shift upward. The vertex becomes (4,3) and the parabola opens downward.",
    ],
  ),
  ...quizAnswers(
    "mat111-week3-teach-back-mastery",
    [2, 0, 1, -1],
    [
      "Even symmetry mirrors points across the y-axis, so (4,-3) requires (-4,-3).",
      "f(-x) reverses the sign of every input and therefore reflects the graph across the y-axis.",
      "x+2 shifts left 2, the leading minus reflects across the x-axis, and +3 shifts upward 3.",
      "Outside operations change outputs, giving vertical shifts, vertical scale changes, or x-axis reflection. Inside operations change inputs, giving horizontal shifts or horizontal scale changes, while f(-x) gives y-axis reflection. Thinking in inputs and outputs explains the directions instead of relying on memorized arrows.",
    ],
  ),

  ...quizAnswers(
    "mat111-week4-feynman-concepts",
    [0, 1, 2, -1],
    [
      "Coordinate differences form the horizontal and vertical legs of a right triangle. Pythagoras squares those legs, adds them, and takes the square root for the hypotenuse distance.",
      "Standard circle form is (x-h)^2+(y-k)^2=r^2, so h=3 and k=-2. The centre is (3,-2).",
      "Perpendicular non-vertical slopes are negative reciprocals, so their product is -1.",
      "Coordinate differences encode movement. Distance uses both changes with Pythagoras; midpoint averages endpoints; slope compares vertical to horizontal change; a line equation keeps that slope through a point; and a circle equation keeps the distance from a centre fixed.",
    ],
  ),
  ...quizAnswers(
    "mat111-week4-worked-reasoning",
    [1, 1, 0, -1],
    [
      "Average coordinates separately: ((-4+6)/2,(7+(-1))/2)=(1,3).",
      "m=(-1-5)/(8-2)=-6/6=-1.",
      "The negative reciprocal of -3/4 is 4/3, and (-3/4)(4/3)=-1.",
      "The centre is the midpoint (1,5). The diameter length is sqrt(6^2+8^2)=10, so the radius is 5. Therefore the circle is (x-1)^2+(y-5)^2=25.",
    ],
  ),
  ...quizAnswers(
    "mat111-week4-teach-back-mastery",
    [2, 0, 1, -1],
    [
      "Point-slope form through (1,2) with slope 5 is y-2=5(x-1).",
      "A perpendicular slope is the negative reciprocal of 2, which is -1/2.",
      "The radius is the distance from (0,0) to (5,12): sqrt(25+144)=13. Squaring the radius gives x^2+y^2=169.",
      "Find the midpoint of the two endpoints; that point must lie on the perpendicular bisector. Find the segment slope, take its negative reciprocal for the perpendicular slope, then use point-slope form through the midpoint. Handle horizontal/vertical special cases directly.",
    ],
  ),

  ...quizAnswers(
    "mat111-week5-feynman-concepts",
    [0, 1, 2, -1],
    [
      "The coefficient a controls the leading x^2 term: a>0 opens the parabola upward and a<0 opens it downward.",
      "Vertex form a(x-h)^2+k shows the turning point immediately as (h,k).",
      "A zero discriminant makes the quadratic formula produce one repeated real root, so the parabola touches the x-axis at its vertex instead of crossing it twice.",
      "General form ax^2+bx+c exposes coefficients and the y-intercept; factored form a(x-r1)(x-r2) exposes roots; vertex form a(x-h)^2+k exposes the vertex, axis, and max/min. They describe the same parabola in forms optimized for different questions.",
    ],
  ),
  ...quizAnswers(
    "mat111-week5-worked-reasoning",
    [1, 1, 0, -1],
    [
      "x_vertex=-b/(2a)=8/2=4. Substituting gives 16-32+11=-5, so the vertex is (4,-5).",
      "Half of 10 is 5, so x^2+10x+7=(x+5)^2-25+7=(x+5)^2-18.",
      "The parabola opens downward because a=-2, and its vertex is (1,6), so the maximum value is 6.",
      "Factorising gives (x-7)(x+1)=0, so x=7 or -1. The quadratic formula gives the same two roots. On the graph, these are the two x-intercepts where y=0.",
    ],
  ),
  ...quizAnswers(
    "mat111-week5-teach-back-mastery",
    [2, 1, 1, -1],
    [
      "An upward-opening parabola has its minimum at the vertex. With vertex y=-3, the range is y>=-3.",
      "Vertex (-4,5) requires y=a(x+4)^2+5; the listed basic choice has a=1.",
      "The vertex time is -b/(2a)=-24/(2(-4))=3, so the maximum occurs at t=3.",
      "A complete sketching method identifies the sign of a for opening, uses x=0 for the y-intercept, solves ax^2+bx+c=0 for real x-intercepts, finds x=-b/(2a) for the axis, evaluates the vertex y-value, and then uses the vertex plus opening direction to state the range.",
    ],
  ),

  ...quizAnswers(
    "mat111-week9-feynman-concepts",
    [0, 1, 2, -1],
    [
      "Linear change adds a constant amount for equal x-steps; exponential change multiplies by a constant factor for equal x-steps.",
      "log_a(x) asks which exponent y makes a^y=x. It is the reverse question of exponentiation.",
      "A real logarithm log_a(x) requires x>0. Its range is all real numbers, but its input cannot be zero or negative.",
      "For example, 2^3=8 says exponent 3 produces output 8, while log_2(8)=3 asks which exponent produces 8. The two notations encode the same relationship with input and output roles reversed.",
    ],
  ),
  ...quizAnswers(
    "mat111-week9-worked-reasoning",
    [1, 1, 0, -1],
    [
      "3^4=81, so log_3(81)=4.",
      "x-3 shifts the exponential graph right 3 and +4 shifts it upward 4.",
      "The power law gives ln(x^3)=3ln x and the quotient law subtracts ln y, producing 3ln x-ln y.",
      "For y=log_2 x: domain x>0, range all real y, x-intercept (1,0), vertical asymptote x=0. These features swap the exponential function's domain/range and reflect its key point (0,1) to (1,0) because logarithm and exponential are inverses.",
    ],
  ),
  ...quizAnswers(
    "mat111-week9-teach-back-mastery",
    [2, 0, 2, -1],
    [
      "When 0<a<1, each increase of 1 multiplies by a fraction, so a^x decreases toward zero while staying positive.",
      "log_5(125)=3 means exactly that 5^3=125.",
      "Subtracting 7 from 3^x moves every output down 7, so the horizontal asymptote moves from y=0 to y=-7.",
      "Product: log(xy)=log x+log y because exponent counts add when powers with the same base multiply. Quotient: log(x/y)=log x-log y because exponent counts subtract in division. Power: log(x^r)=r log x because raising a quantity to r multiplies its exponent count by r.",
    ],
  ),

  ...quizAnswers(
    "mat111-week10-feynman-concepts",
    [0, 2, 2, -1],
    [
      "For base 3>0 and not equal to 1, 3^x is one-to-one. Equal outputs therefore come from equal exponents, so 2x=8.",
      "Radian measure is defined geometrically by theta=s/r, arc length divided by radius.",
      "Tangent compares opposite to adjacent: tan theta=opposite/adjacent.",
      "Logarithms undo exponentiation by turning an unknown exponent into an ordinary algebraic quantity. Trig ratios connect an angle to fixed side-length proportions in similar right triangles, letting side information determine angle relationships and vice versa.",
    ],
  ),
  ...quizAnswers(
    "mat111-week10-worked-reasoning",
    [1, 0, 1, -1],
    [
      "Taking natural logs gives x ln5=ln40, so x=ln40/ln5.",
      "225*(pi/180)=225pi/180=5pi/4.",
      "With opposite=7, adjacent=24, hypotenuse=25, cosine is adjacent/hypotenuse=24/25.",
      "The log argument requires x-2>0, so x>2. Equal natural logs imply x-2=7, giving x=9, which satisfies the domain. The domain check prevents accepting algebraic candidates for which the original logarithm does not exist.",
    ],
  ),
  ...quizAnswers(
    "mat111-week10-teach-back-mastery",
    [2, 0, 1, -1],
    [
      "Add 360 degrees to -30 degrees to get 330 degrees, so the two angles share a terminal side.",
      "Cosecant is the reciprocal of sine, so csc theta=17/8.",
      "2ln x=ln(x^2), and subtracting ln y corresponds to division, giving ln(x^2/y).",
      "For a^x=b, take logs and use the power law to solve x=ln b/ln a. Convert degrees to radians by multiplying pi/180 and radians to degrees by 180/pi. In a right triangle, build sin, cos, tan from opposite/adjacent/hypotenuse and get csc, sec, cot as reciprocals.",
    ],
  ),

  ...quizAnswers(
    "mat111-week11-feynman-concepts",
    [0, 1, 2, -1],
    [
      "The radius r is the distance from the origin to (x,y), so Pythagoras gives r=sqrt(x^2+y^2).",
      "Cosine is horizontal coordinate divided by radius: cos theta=x/r.",
      "In Quadrant III, x<0 and y<0. Since tan theta=y/x, dividing two negatives gives a positive result.",
      "Draw the radius from the origin to (x,y). That creates a right-triangle relationship with horizontal leg x, vertical leg y, and hypotenuse r. Then sin=y/r, cos=x/r, tan=y/x, with reciprocal functions obtained by flipping those ratios; quadrant signs come from x and y.",
    ],
  ),
  ...quizAnswers(
    "mat111-week11-worked-reasoning",
    [1, 1, 2, -1],
    [
      "r=sqrt(8^2+(-15)^2)=sqrt(64+225)=sqrt289=17.",
      "210 degrees lies in Quadrant III, so its reference angle is 210-180=30 degrees.",
      "5pi/6 is 150 degrees in Quadrant II with reference angle pi/6. Sine is positive there, so sin(5pi/6)=1/2.",
      "For (-5,12), r=13. Therefore sin=12/13, cos=-5/13, tan=-12/5, csc=13/12, sec=-13/5, cot=-5/12. Quadrant II predicts sine positive, cosine negative, and tangent negative before any division is done.",
    ],
  ),
  ...quizAnswers(
    "mat111-week11-teach-back-mastery",
    [2, 0, 1, -1],
    [
      "Cosine is even, so reflecting an angle from x to -x preserves the cosine value: cos(-x)=cos x.",
      "Sine repeats after one full revolution, so its period is 2pi.",
      "On the unit circle r=1, so cos theta=x and sin theta=y. The point is therefore (cos theta,sin theta).",
      "Quadrant signs come from the signs of x and y. A reference angle supplies the first-quadrant magnitude. The unit circle stores exact sine/cosine coordinates, parity handles negative angles, and periodicity lets full or half rotations reuse known values.",
    ],
  ),

  ...quizAnswers(
    "mat111-week13-feynman-concepts",
    [2, 1, 2, -1],
    [
      "sin^2 x+cos^2 x=1 is true for every x, so it is an identity. The other choices are equations true only at selected angles.",
      "The quotient identity is tan x=sin x/cos x where cosine is nonzero.",
      "Dividing sin^2+cos^2=1 by cos^2 gives tan^2+1=sec^2.",
      "Verifying an identity means transforming one side until it matches the other for all allowed inputs; there is no list of x-values to find. Solving a trig equation means finding the specific angles that make the statement true, including periodic solutions or solutions in a requested interval.",
    ],
  ),
  ...quizAnswers(
    "mat111-week13-worked-reasoning",
    [1, 2, 0, -1],
    [
      "1-sin^2 x=cos^2 x, so cos^2 x/cos x=cos x wherever cos x is nonzero.",
      "Sine is zero at integer multiples of pi. On the closed interval [0,2pi], the solutions are 0, pi, and 2pi.",
      "The sine double-angle identity is sin(2x)=2sin x cos x.",
      "sin75=sin(45+30)=sin45 cos30+cos45 sin30=(sqrt2/2)(sqrt3/2)+(sqrt2/2)(1/2)=(sqrt6+sqrt2)/4. Splitting 75 into familiar angles provides exact known values.",
    ],
  ),
  ...quizAnswers(
    "mat111-week13-teach-back-mastery",
    [2, 0, 1, -1],
    [
      "The power-reducing identity is cos^2 x=(1+cos2x)/2.",
      "By definition, sin x/cos x=tan x where cos x is nonzero.",
      "Expressions containing tan and sec often simplify with 1+tan^2=sec^2; rewriting in sine and cosine is also a reliable fallback. The goal is to choose an identity matching the expression's structure.",
      "Use reciprocal identities when sec/csc/cot need rewriting, quotient identities when tan/cot should become sine/cosine, Pythagorean identities when squares appear, sum/difference formulas for combined angles, double-angle formulas for 2x, and power-reducing formulas for sin^2 or cos^2. Choose by the obstacle you want to remove.",
    ],
  ),

  ...quizAnswers(
    "mat111-week14-feynman-concepts",
    [0, 1, 2, -1],
    [
      "The defining property of the imaginary unit is i^2=-1. Ordinary algebra then continues with this substitution whenever i is squared.",
      "In a+bi, the imaginary part is the real coefficient b. For 4-7i, b=-7.",
      "The conjugate keeps the real part and reverses the imaginary sign, so the conjugate of 3+5i is 3-5i.",
      "Complex numbers add a direction corresponding to i so equations such as x^2=-1 have solutions. Conjugates are useful because (a+bi)(a-bi)=a^2+b^2 is real, allowing denominators to be rationalized and connecting complex arithmetic to modulus.",
    ],
  ),
  ...quizAnswers(
    "mat111-week14-worked-reasoning",
    [1, 1, 1, -1],
    [
      "Combine like parts: 2+5=7 and 3i-4i=-i, giving 7-i.",
      "(1+2i)(3-i)=3-i+6i-2i^2=3+5i+2=5+5i.",
      "A number times its conjugate is a^2+b^2, so (4+3i)(4-3i)=16+9=25.",
      "Multiply numerator and denominator by the conjugate 1+2i: ((2+i)(1+2i))/((1-2i)(1+2i))=(2+5i-2)/(1+4)=5i/5=i. The conjugate makes the denominator real.",
    ],
  ),
  ...quizAnswers(
    "mat111-week14-teach-back-mastery",
    [2, 0, 2, -1],
    [
      "Equality of complex numbers requires real parts to match: 2x=8, so x=4.",
      "sqrt(-49)=sqrt(49)sqrt(-1)=7i for the principal square root.",
      "z times its conjugate is (a+bi)(a-bi)=a^2+b^2, which is always real and nonnegative.",
      "Add by combining real and imaginary parts separately. Multiply with ordinary distributive algebra and replace i^2 by -1. Divide by multiplying numerator and denominator by the denominator's conjugate so the denominator becomes real, then simplify back to a+bi form.",
    ],
  ),

  ...quizAnswers(
    "mat111-week15-feynman-concepts",
    [2, 1, 2, -1],
    [
      "The modulus |a+bi|=sqrt(a^2+b^2) is the distance from the origin to the point (a,b) in the Argand plane.",
      "In polar form, r records size while theta records the direction, called the argument.",
      "Multiplying polar complex numbers adds their arguments because rotations combine by adding angles.",
      "Rectangular form a+bi stores horizontal and vertical components and is convenient for addition/subtraction. Polar form r(cos theta+i sin theta) stores size and direction and makes multiplication, division, powers, and roots much simpler.",
    ],
  ),
  ...quizAnswers(
    "mat111-week15-worked-reasoning",
    [1, 1, 2, -1],
    [
      "|-6+8i|=sqrt(36+64)=sqrt100=10.",
      "2cos(pi/3)=1 and 2sin(pi/3)=sqrt3, so the rectangular form is 1+sqrt3 i.",
      "De Moivre multiplies the argument by the power: (cis30°)^3=cis90°.",
      "Write 8 as 8cis(2kpi). Cube roots have modulus 2 and arguments (2kpi)/3 for k=0,1,2: 0, 2pi/3, and 4pi/3. They are separated by 2pi/3=120 degrees because three roots must be evenly spaced around a full turn.",
    ],
  ),
  ...quizAnswers(
    "mat111-week15-teach-back-mastery",
    [2, 0, 0, -1],
    [
      "Four roots are equally spaced around 2pi, so the spacing is 2pi/4=pi/2.",
      "The MAT111 convention for principal argument is (-pi,pi].",
      "Division in polar form divides moduli and subtracts arguments: (r1/r2)cis(a-b).",
      "Plot a+bi as (a,b), compute modulus sqrt(a^2+b^2), choose the correct argument from the quadrant, and write r cis theta. Multiplication multiplies moduli and adds arguments; powers use De Moivre; nth roots take the nth root of the modulus and generate n equally spaced arguments (theta+2kpi)/n.",
    ],
  ),
];
