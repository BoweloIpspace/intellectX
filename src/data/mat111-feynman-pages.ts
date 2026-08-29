export type Mat111FeynmanPage = {
  title: string;
  simpleExplanation: string;
  workedExample: string;
  teachBack: string;
};

function page(
  title: string,
  simpleExplanation: string,
  workedExample: string,
  teachBack: string,
): Mat111FeynmanPage {
  return { title, simpleExplanation, workedExample, teachBack };
}

export const mat111FeynmanPagesByLesson: Record<string, Mat111FeynmanPage[]> = {
  "mat111-week-2": [
    page(
      "1. A function is a machine",
      "Think of a function as a machine with one job: take an allowed input, follow a rule, and produce one output. The domain is the list of inputs the machine accepts, while the range is the set of outputs it can actually produce.",
      "If f(x)=2x+3, feeding in x=4 gives f(4)=11. The input was 4, the rule was multiply by 2 then add 3, and the output was 11.",
      "Explain to a younger student why a function cannot give two different outputs for the same input.",
    ),
    page(
      "2. Combining functions point by point",
      "Adding, subtracting, multiplying, or dividing functions means combining their outputs at the same input x. You are not mixing the formulas randomly; you are asking both machines to process the same x, then combining the results.",
      "For f(x)=x+1 and g(x)=x^2, (f+g)(2)=f(2)+g(2)=3+4=7. The same idea works symbolically: (f+g)(x)=x^2+x+1.",
      "In your own words, explain the difference between fg and f o g.",
    ),
    page(
      "3. Domains survive only where every rule works",
      "When functions are combined, the new domain keeps only inputs that make every required part meaningful. Division adds one extra restriction: the denominator cannot be zero.",
      "If f(x)=sqrt(x) and g(x)=x-4, then f/g requires x>=0 and x!=4. The square root needs non-negative inputs, while the quotient rejects x=4.",
      "Teach back a simple checklist for finding the domain of a quotient of two functions.",
    ),
    page(
      "4. Composition means one machine feeds another",
      "Composition f(g(x)) means g acts first. Its output becomes the input of f. A reliable way to avoid order mistakes is to read from the inside out.",
      "If g(x)=x+2 and f(x)=x^2, then (f o g)(3)=f(g(3))=f(5)=25. Reversing the order gives g(f(3))=11, so order matters.",
      "Explain why f(g(x)) and g(f(x)) usually produce different results.",
    ),
    page(
      "5. The hidden domain condition in composition",
      "For f(g(x)) to exist, x must first be allowed by g, and then g(x) must land inside the domain of f. Composition therefore has a two-stage domain test.",
      "Let g(x)=x-5 and f(u)=sqrt(u). The composition sqrt(x-5) requires x-5>=0, so x>=5 even though g itself accepts every real number.",
      "Explain the two questions you ask before accepting an input into f o g.",
    ),
    page(
      "6. One-to-one means outputs are not reused",
      "A function is one-to-one when different inputs never share the same output. Graphically, a horizontal line may meet the graph at most once. This matters because an inverse must be able to reverse each output back to one unique input.",
      "The function f(x)=x^3 is one-to-one on all real numbers, but f(x)=x^2 is not because f(2)=f(-2)=4.",
      "Describe the horizontal line test without using the phrase 'horizontal line test'.",
    ),
    page(
      "7. Finding an inverse means undoing the recipe",
      "To find an inverse algebraically, write y=f(x), swap x and y, then solve for y. The swap represents reversing the roles of input and output.",
      "For y=3x-5, swap to x=3y-5, so y=(x+5)/3. Therefore f^(-1)(x)=(x+5)/3.",
      "Explain why swapping x and y is connected to reversing a function rather than being a random trick.",
    ),
    page(
      "8. Verify inverses by getting the input back",
      "Two functions are inverses when composing them in either order returns the original input. The identity result x is the proof that each function perfectly undoes the other on the relevant domains.",
      "If f(x)=2x+1 and g(x)=(x-1)/2, then f(g(x))=x and g(f(x))=x.",
      "Teach someone how composition can prove that a proposed inverse is correct.",
    ),
    page(
      "9. Common inverse mistakes",
      "The inverse function f^(-1) is not the reciprocal 1/f. Also, an inverse can only be a function when the original function is one-to-one on the chosen domain.",
      "For f(x)=2x, the inverse is x/2, while the reciprocal is 1/(2x). They answer completely different questions.",
      "Give a one-sentence warning that would stop a student confusing f^(-1) with 1/f.",
    ),
    page(
      "10. One-minute teach-back",
      "The whole week can be told as one story: functions transform inputs, combinations merge outputs, composition chains machines, and inverses reverse one-to-one machines. Domain rules tell you where each operation is actually legal.",
      "Start with f(x)=x+3 and g(x)=2x. Form f+g, f o g, g o f, and f^(-1), then state any domain restrictions.",
      "Close the notes and explain the entire topic aloud in under one minute. If you hesitate, name the exact step that needs another pass.",
    ),
  ],
  "mat111-week-3": [
    page(
      "1. A graph is a picture of a rule",
      "Every point (x,y) on a function graph says y=f(x). Instead of seeing a curve as decoration, read it as a visual record of how inputs become outputs.",
      "The point (2,5) on y=f(x) means f(2)=5. If (-1,3) is also on the graph, then f(-1)=3.",
      "Explain what one plotted point tells you about a function.",
    ),
    page(
      "2. Even functions mirror across the y-axis",
      "An even function satisfies f(-x)=f(x). Changing the sign of the input does not change the output, so the left half of the graph mirrors the right half across the y-axis.",
      "For f(x)=x^2+2, f(-x)=(-x)^2+2=x^2+2=f(x), so the graph is even.",
      "Explain why x^2 is even using both algebra and the shape of its graph.",
    ),
    page(
      "3. Odd functions rotate through the origin",
      "An odd function satisfies f(-x)=-f(x). If a point (x,y) is on the graph, then (-x,-y) is also there, giving symmetry about the origin.",
      "For f(x)=x^3, f(-x)=-x^3=-f(x), so x^3 is odd.",
      "Describe origin symmetry as if you were telling someone how to draw the missing half of an odd graph.",
    ),
    page(
      "4. Parent graphs are reusable shapes",
      "A parent graph is the simplest familiar version of a function family. Knowing the shapes of x, |x|, sqrt(x), x^2, x^3, and 1/x lets you recognize transformed versions quickly.",
      "y=(x-2)^2+4 is still the x^2 parabola; it has simply been moved right 2 and up 4.",
      "Pick one parent graph and explain the visual feature that makes you recognize it instantly.",
    ),
    page(
      "5. Outside changes move graphs vertically",
      "Adding a number after the function changes every output. f(x)+c moves the graph up c units, while f(x)-c moves it down c units.",
      "y=x^2+3 is the parabola y=x^2 shifted three units upward. Its vertex moves from (0,0) to (0,3).",
      "Explain why changing outputs produces a vertical shift.",
    ),
    page(
      "6. Inside changes move graphs horizontally",
      "Changing the input has the opposite-looking direction: f(x-c) moves right c, while f(x+c) moves left c. The sign seems reversed because you are changing which input reaches the old location.",
      "For f(x)=x^2, y=(x-4)^2 has its vertex at x=4, so the graph moved right 4.",
      "Teach back the 'opposite sign inside' rule without memorizing it blindly.",
    ),
    page(
      "7. Negative signs create reflections",
      "A minus outside, -f(x), flips every output and reflects the graph across the x-axis. A minus inside, f(-x), reverses inputs and reflects across the y-axis.",
      "From y=sqrt(x), y=-sqrt(x) flips downward, while y=sqrt(-x) moves the square-root branch to the left side.",
      "Explain the difference between -f(x) and f(-x) using the words input and output.",
    ),
    page(
      "8. Stretches and shrinks change scale",
      "Multiplying outputs by a number changes vertical scale. Multiplying x inside the function changes horizontal scale in the reciprocal way, because inputs reach the same old values sooner or later.",
      "y=3x^2 is vertically stretched by 3. y=(2x)^2 is horizontally compressed by factor 1/2 relative to y=x^2.",
      "Explain why f(2x) is horizontally compressed rather than stretched.",
    ),
    page(
      "9. Build complicated graphs one move at a time",
      "For a transformed expression, start from the parent graph and apply one transformation at a time. Naming each move prevents sign errors and makes the final shape predictable before plotting points.",
      "For y=3-(x+2)^2: start with x^2, shift left 2, reflect in the x-axis, then shift up 3.",
      "Say the transformation sequence for y=2|x-1|-4 and explain the order you would use.",
    ),
    page(
      "10. One-minute teach-back",
      "Graph transformations become simple when you separate input changes from output changes. Outside acts vertically, inside acts horizontally, and negative signs reflect. Symmetry tests tell you whether the original rule has a mirror pattern.",
      "Sketch mentally how y=-2(x-3)^2+1 differs from y=x^2, then state its vertex and opening direction.",
      "Close the notes and teach even, odd, vertical shift, horizontal shift, reflection, and scaling as one connected story.",
    ),
  ],
  "mat111-week-4": [
    page(
      "1. Coordinates are addresses",
      "A point (x,y) is an address: move x units horizontally from the origin, then y units vertically. Signs tell you direction, and the two axes divide the plane into four quadrants.",
      "The point (-3,2) lies three units left and two units up, placing it in Quadrant II.",
      "Explain how to locate (-4,-5) without drawing a grid first.",
    ),
    page(
      "2. Distance is Pythagoras on a grid",
      "The distance formula is just the Pythagorean theorem. Horizontal change gives one leg, vertical change gives the other, and the straight segment between the points is the hypotenuse.",
      "Between (1,2) and (4,6), the changes are 3 and 4, so distance=sqrt(3^2+4^2)=5.",
      "Explain where every part of sqrt((x2-x1)^2+(y2-y1)^2) comes from.",
    ),
    page(
      "3. Midpoint means average the coordinates",
      "The midpoint sits halfway in both the horizontal and vertical directions, so you average the x-coordinates and separately average the y-coordinates.",
      "The midpoint of (-2,5) and (6,1) is ((-2+6)/2,(5+1)/2)=(2,3).",
      "Explain why averaging coordinates finds the halfway point rather than merely producing a convenient formula.",
    ),
    page(
      "4. A circle is every point the same distance away",
      "A circle with centre (h,k) and radius r is the set of points exactly r units from that centre. The standard equation is simply the distance formula squared.",
      "Centre (2,-1), radius 3 gives (x-2)^2+(y+1)^2=9.",
      "Derive the circle equation from the sentence 'distance from (x,y) to (h,k) equals r'.",
    ),
    page(
      "5. A diameter gives the centre and radius",
      "If you know the endpoints of a diameter, the centre is their midpoint. The radius is half the distance between them. Those two facts are enough to build the standard circle equation.",
      "Diameter endpoints (0,0) and (6,8) have midpoint (3,4), diameter 10, radius 5, so (x-3)^2+(y-4)^2=25.",
      "Explain the full recipe for building a circle equation from two diameter endpoints.",
    ),
    page(
      "6. Slope measures steepness and direction",
      "Slope is change in y divided by change in x: rise over run. Positive slope rises left-to-right, negative slope falls, zero slope is horizontal, and a vertical line has undefined slope.",
      "Through (1,2) and (5,10), m=(10-2)/(5-1)=8/4=2.",
      "Explain what a slope of -3 means in movement language.",
    ),
    page(
      "7. Point-slope form builds a line from one point",
      "If you know a slope m and one point (x1,y1), then y-y1=m(x-x1). This formula says every other point on the line must keep the same rise-to-run ratio.",
      "Slope 4 through (2,-1) gives y+1=4(x-2), or y=4x-9.",
      "Teach someone when point-slope form is more convenient than slope-intercept form.",
    ),
    page(
      "8. Parallel and perpendicular slopes",
      "Parallel non-vertical lines have the same slope because they tilt equally. Perpendicular non-vertical lines have negative reciprocal slopes, so their product is -1.",
      "A line with slope 2/5 has parallel slope 2/5 and perpendicular slope -5/2.",
      "Explain why simply changing the sign is not enough to make a line perpendicular.",
    ),
    page(
      "9. Mix the tools instead of memorizing separate chapters",
      "Coordinate-geometry problems often combine distance, midpoint, slope, and line equations. The key is to translate each sentence into the geometric fact it gives you.",
      "If a line must pass through the midpoint of A and B and be perpendicular to AB, first find the midpoint, then AB's slope, then its negative reciprocal, then write the line.",
      "Explain how you would find the perpendicular bisector of a segment from its endpoints.",
    ),
    page(
      "10. One-minute teach-back",
      "Week 4 is one Pythagorean story: coordinates locate points, differences measure movement, distance measures length, midpoint finds halfway, slope measures direction, and circle equations keep distance constant.",
      "Given A(-1,2) and B(5,6), find their distance, midpoint, slope, and the equation of the line through them.",
      "Teach the topic aloud as if every formula had been erased and you had to rebuild it from geometry.",
    ),
  ],
  "mat111-week-5": [
    page(
      "1. A quadratic draws a parabola",
      "A quadratic has form ax^2+bx+c with a not equal to zero. Its graph is a parabola: a smooth U-shape when a>0 and an upside-down U when a<0.",
      "y=2x^2 opens upward and is narrower than y=x^2, while y=-x^2 opens downward.",
      "Explain how the sign of a tells you the parabola's opening direction.",
    ),
    page(
      "2. Intercepts are where the graph meets the axes",
      "The y-intercept comes from x=0, giving (0,c). The x-intercepts come from solving ax^2+bx+c=0. The discriminant b^2-4ac tells you how many real x-intercepts exist.",
      "For x^2-5x+6, the roots are 2 and 3, so the graph crosses the x-axis at (2,0) and (3,0).",
      "Explain what a negative discriminant means on the actual graph.",
    ),
    page(
      "3. The vertex is the turning point",
      "Every parabola has a vertex and a vertical axis of symmetry. In general form, the vertex x-coordinate is -b/(2a); substitute that value back into the function to get the y-coordinate.",
      "For f(x)=x^2-6x+5, x_vertex=3 and f(3)=-4, so the vertex is (3,-4).",
      "Explain why the vertex sits on the axis of symmetry.",
    ),
    page(
      "4. Vertex form shows the graph immediately",
      "In f(x)=a(x-h)^2+k, the vertex is (h,k). The coefficient a still controls opening direction and vertical stretch, so this form exposes the graph's key features at a glance.",
      "y=-2(x+1)^2+7 has vertex (-1,7), axis x=-1, opens downward, and is vertically stretched by 2.",
      "Teach someone how to read h and k without being fooled by the sign inside the bracket.",
    ),
    page(
      "5. Completing the square reorganizes the same quadratic",
      "Completing the square rewrites general form into vertex form. You create a perfect square by adding and subtracting the same amount, so the function's value never changes.",
      "x^2+6x+2=(x^2+6x+9)-9+2=(x+3)^2-7.",
      "Explain why adding 9 and subtracting 9 is legal and useful in the same step.",
    ),
    page(
      "6. The quadratic formula is a universal root finder",
      "When factorising is awkward, x=(-b±sqrt(b^2-4ac))/(2a) solves any quadratic. The same discriminant inside the square root explains why the number of real roots changes.",
      "For x^2-2x-1=0, x=(2±sqrt(4+4))/2=1±sqrt(2).",
      "Explain how the discriminant affects the quadratic formula's output.",
    ),
    page(
      "7. Maximum, minimum, and range come from the vertex",
      "If the parabola opens upward, the vertex is the minimum; if it opens downward, it is the maximum. The vertex y-value therefore gives one boundary of the range.",
      "For y=3(x-2)^2-5, the minimum is -5, so the range is y>=-5.",
      "Explain how you could state the range of a quadratic by looking only at vertex form.",
    ),
    page(
      "8. Quadratic transformations reuse graph rules",
      "Quadratics obey the same transformation rules as other functions. In a(x-h)^2+k, h shifts horizontally, k shifts vertically, and a controls reflection and vertical scale.",
      "From y=x^2 to y=-0.5(x-4)^2+3: move right 4, reflect in the x-axis, vertically shrink by 1/2, then move up 3.",
      "Say every transformation in y=4(x+2)^2-1.",
    ),
    page(
      "9. Real problems turn into quadratic models",
      "A quadratic often appears when one quantity grows while another shrinks, such as area, projectile height, or revenue. After building the model, the vertex often answers the practical maximum-or-minimum question.",
      "If h(t)=-5t^2+20t+1, the maximum occurs at t=-20/(2(-5))=2 seconds.",
      "Explain why finding a vertex can solve an optimization question without checking every possible input.",
    ),
    page(
      "10. One-minute teach-back",
      "A quadratic is one object seen in several forms. General form helps identify coefficients, factored form highlights roots, and vertex form highlights the turning point. Converting between them lets you answer different questions quickly.",
      "For y=x^2-4x-5, find the roots, vertex, axis of symmetry, y-intercept, opening direction, and range.",
      "Teach the three useful forms of a quadratic and say what information each form reveals fastest.",
    ),
  ],
  "mat111-week-9": [
    page(
      "1. Exponentials model repeated multiplication",
      "In an exponential function a^x, the variable sits in the exponent. Equal increases in x multiply the output by a constant factor instead of adding a constant amount.",
      "For f(x)=2^x, moving from x=1 to 2 to 3 changes outputs 2,4,8: each step multiplies by 2.",
      "Explain the difference between linear growth and exponential growth using 'add' versus 'multiply'.",
    ),
    page(
      "2. The basic exponential graph never reaches zero",
      "For a>0 and a!=1, a^x is always positive. Its domain is every real number, range is positive numbers, it crosses the y-axis at (0,1), and y=0 is a horizontal asymptote.",
      "For 3^x, 3^0=1 and 3^-2=1/9. Negative exponents make the graph approach zero without touching it.",
      "Explain why a^x can get very close to zero but cannot equal zero.",
    ),
    page(
      "3. The base decides growth or decay",
      "If a>1, a^x increases as x increases. If 0<a<1, each step multiplies by a fraction, so the function decreases. Both cases remain positive.",
      "2^x grows, while (1/2)^x decays. In fact, (1/2)^x=2^-x, showing a reflection relationship.",
      "Teach how you can predict growth or decay by looking only at the base.",
    ),
    page(
      "4. Exponential graphs transform like other functions",
      "Shifts, reflections, and stretches apply to exponentials too. Outside changes outputs; inside changes inputs. A vertical shift also moves the horizontal asymptote.",
      "y=2^x+3 has horizontal asymptote y=3. y=2^(x-1) moves the basic graph right 1.",
      "Explain why adding 3 moves the asymptote from y=0 to y=3.",
    ),
    page(
      "5. e is the natural growth base",
      "The number e≈2.71828 appears naturally in continuous growth and calculus. e^x behaves like any base greater than 1, but its special rate properties make it the standard natural exponential.",
      "e^0=1 and e^-x=1/e^x. The graph still has domain all reals, positive range, and asymptote y=0.",
      "Explain why e^x belongs to the same family as 2^x even though its base is unusual.",
    ),
    page(
      "6. A logarithm asks for the missing exponent",
      "log_a(x) is the inverse of a^x. The statement y=log_a(x) means exactly the same thing as a^y=x. A logarithm is therefore an exponent question.",
      "log_2(8)=3 because 2^3=8. log_10(0.01)=-2 because 10^-2=0.01.",
      "Explain logarithms without using the word 'inverse'.",
    ),
    page(
      "7. Log graphs swap exponential inputs and outputs",
      "Because logarithms invert exponentials, domain and range swap. log_a(x) accepts only positive x, has all real outputs, passes through (1,0), and has x=0 as a vertical asymptote.",
      "The exponential point (0,1) becomes the logarithmic point (1,0), reflecting across y=x.",
      "Explain why a logarithm cannot accept zero or a negative real input in this course.",
    ),
    page(
      "8. Log laws turn multiplication into addition",
      "Logarithms convert products to sums, quotients to differences, and powers to multipliers: log(xy)=log x+log y, log(x/y)=log x-log y, and log(x^r)=r log x.",
      "log_2(8x)=log_2(8)+log_2(x)=3+log_2(x), for x>0.",
      "Explain why the power rule lets an exponent move to the front of a logarithm.",
    ),
    page(
      "9. Switch forms to choose the easier language",
      "Exponential form is useful when the exponent is known; logarithmic form is useful when the exponent is unknown. Moving between the two forms often turns a difficult-looking equation into a familiar one.",
      "log_5(x)=3 becomes x=5^3=125. Likewise 7^x=20 becomes x=log_7(20).",
      "Teach a rule for deciding when to rewrite an equation in logarithmic form.",
    ),
    page(
      "10. One-minute teach-back",
      "Exponentials and logarithms are the same relationship viewed forward and backward. Exponentials tell the result of repeated multiplication; logarithms tell how many exponent steps were needed.",
      "Explain and solve both 3^x=81 and log_3(81)=x, then compare what each notation is asking.",
      "Close the notes and teach the graphs, domains, asymptotes, inverse relationship, and three log laws in one connected explanation.",
    ),
  ],
  "mat111-week-10": [
    page(
      "1. Same-base exponential equations",
      "If two exponentials have the same valid base, equal outputs require equal exponents. This is the one-to-one property of exponential functions.",
      "2^(3x-1)=2^5 gives 3x-1=5, so x=2.",
      "Explain why matching bases lets you compare exponents directly.",
    ),
    page(
      "2. Logs rescue equations with unmatched bases",
      "When you cannot rewrite both sides with the same base, take logarithms. The power rule brings the unknown exponent down where ordinary algebra can reach it.",
      "4^x=100 gives x ln4=ln100, so x=ln100/ln4.",
      "Teach the steps for solving a^x=b when b is not a convenient power of a.",
    ),
    page(
      "3. Log equations need a domain check",
      "Every logarithm argument must be positive. Algebra may produce a candidate that makes an original log undefined, so you must substitute or check inequalities before accepting a solution.",
      "ln(x-1)=ln(5) gives x=6, which is valid because x-1>0. A candidate x=0 would be rejected.",
      "Explain why domain checking is part of solving, not an optional final decoration.",
    ),
    page(
      "4. Expanding and condensing logs",
      "Expanding rewrites one logarithm as a sum or difference; condensing combines several logs into one. Both are the same laws used in opposite directions.",
      "2ln x-ln(x-1)=ln(x^2)-ln(x-1)=ln(x^2/(x-1)), where all original log arguments are positive.",
      "Explain when condensing logs can make an equation easier to solve.",
    ),
    page(
      "5. An angle records rotation",
      "In standard position, the vertex is at the origin and the initial side lies on the positive x-axis. Counterclockwise rotation is positive; clockwise rotation is negative.",
      "A 90-degree angle rotates one quarter-turn counterclockwise. -90 degrees rotates the same amount clockwise.",
      "Explain standard position as instructions for drawing an angle from scratch.",
    ),
    page(
      "6. Degrees and radians measure the same turn",
      "Radians measure angle through arc length: theta=s/r. One full turn is 2pi radians=360 degrees, so pi radians=180 degrees.",
      "150 degrees*(pi/180)=5pi/6. Conversely, 3pi/4*(180/pi)=135 degrees.",
      "Teach a conversion rule that explains why the pi and 180 factors appear.",
    ),
    page(
      "7. Coterminal angles land on the same side",
      "Angles that differ by complete revolutions share the same terminal side. Add or subtract 360 degrees, or 2pi radians, to generate coterminal angles.",
      "30 degrees, 390 degrees, and -330 degrees are coterminal.",
      "Explain why coterminal angles can have different numerical measures but the same trig values.",
    ),
    page(
      "8. Right-triangle trig compares side lengths",
      "For an acute angle, sine=opposite/hypotenuse, cosine=adjacent/hypotenuse, and tangent=opposite/adjacent. These ratios depend on the angle, not the overall triangle size.",
      "In a 3-4-5 triangle, if opposite=3 and adjacent=4, sin=3/5, cos=4/5, tan=3/4.",
      "Explain why similar right triangles give the same sine value for the same angle.",
    ),
    page(
      "9. The other three trig functions are reciprocals",
      "Cosecant, secant, and cotangent are reciprocals of sine, cosine, and tangent. This gives six functions from the same three side lengths.",
      "If sin theta=5/13, then csc theta=13/5. If tan theta=5/12, then cot theta=12/5.",
      "Teach all six right-triangle trig ratios without treating them as six unrelated formulas.",
    ),
    page(
      "10. One-minute teach-back",
      "Week 10 connects two ideas about undoing: logarithms undo exponentials, while trigonometric ratios turn geometric side information into angle information. In both cases, correct domains and definitions matter.",
      "Solve 5^x=17 with logs, convert 210 degrees to radians, and find all six trig ratios in a 5-12-13 triangle.",
      "Teach the week's exponential-solving and angle/trig ideas as two short stories, each starting from its basic definition.",
    ),
  ],
  "mat111-week-11": [
    page(
      "1. Any angle can use a terminal point",
      "For an angle in standard position, choose a point (x,y) on its terminal side and let r=sqrt(x^2+y^2). The right triangle formed with the axes extends trig beyond acute angles.",
      "For point (-3,4), r=5. The signs of x and y immediately tell you the terminal side lies in Quadrant II.",
      "Explain what x, y, and r represent geometrically for a terminal point.",
    ),
    page(
      "2. Sine, cosine, and tangent become coordinate ratios",
      "For any angle, sin=y/r, cos=x/r, and tan=y/x when the denominator is nonzero. This is the same right-triangle idea written with coordinates.",
      "At (-3,4) with r=5: sin=4/5, cos=-3/5, tan=-4/3.",
      "Explain why cosine uses x/r while sine uses y/r.",
    ),
    page(
      "3. Reciprocals complete the six functions",
      "csc=r/y, sec=r/x, and cot=x/y wherever those denominators are nonzero. Rather than memorizing fresh definitions, remember they are reciprocals of sine, cosine, and tangent.",
      "At (4,3), r=5: csc=5/3, sec=5/4, cot=4/3.",
      "Teach the six coordinate definitions as three ratios plus three reciprocals.",
    ),
    page(
      "4. Quadrants control signs",
      "The sign of each trig function follows the signs of x and y. Sine follows y, cosine follows x, and tangent follows y/x, so you can derive the quadrant sign pattern instead of memorizing a slogan.",
      "In Quadrant III, x<0 and y<0, so sin<0, cos<0, but tan>0 because negative divided by negative is positive.",
      "Explain the signs of sine, cosine, and tangent in Quadrant IV from x and y signs.",
    ),
    page(
      "5. Reference angles reduce unfamiliar angles",
      "A reference angle is the acute angle between the terminal side and the x-axis. It lets you use familiar first-quadrant magnitudes, then attach the sign required by the actual quadrant.",
      "300 degrees lies in Quadrant IV with reference angle 60 degrees, so cos300=+cos60=1/2.",
      "Teach a method for finding the reference angle of 220 degrees.",
    ),
    page(
      "6. The unit circle sets r=1",
      "On the unit circle, r=1, so cos theta=x and sin theta=y. Every point directly stores the cosine and sine of its angle.",
      "At theta=pi/3, the unit-circle point is (1/2,sqrt(3)/2), so cos=1/2 and sin=sqrt(3)/2.",
      "Explain why the unit circle turns the coordinate formulas into simple coordinates.",
    ),
    page(
      "7. Periodicity means rotations repeat",
      "A full turn returns to the same terminal side, so sine and cosine repeat every 2pi. Tangent repeats after pi because opposite terminal directions produce the same y/x ratio.",
      "sin(theta+2pi)=sin theta, while tan(theta+pi)=tan theta.",
      "Explain why tangent can repeat after half a full revolution.",
    ),
    page(
      "8. Even and odd trig behavior comes from symmetry",
      "Cosine is even: cos(-theta)=cos theta. Sine and tangent are odd: sin(-theta)=-sin theta and tan(-theta)=-tan theta. These facts match reflections on the unit circle.",
      "cos(-60°)=cos60°=1/2, while sin(-60°)=-sqrt(3)/2.",
      "Teach why cosine keeps its sign when the angle changes from theta to -theta.",
    ),
    page(
      "9. Sine and cosine graphs are rotating coordinates over time",
      "As an angle increases around the unit circle, the y-coordinate traces sine and the x-coordinate traces cosine. Both stay between -1 and 1 and repeat every 2pi.",
      "Sine begins at 0 when theta=0, while cosine begins at 1; both complete one cycle by 2pi.",
      "Explain the sine graph as the vertical coordinate of a point moving around a circle.",
    ),
    page(
      "10. One-minute teach-back",
      "Any-angle trigonometry is coordinate geometry on a circle. The terminal point gives signs and ratios, the unit circle gives exact values, reference angles reuse familiar magnitudes, and periodicity explains repetition.",
      "For a terminal point (-5,-12), find r and all six trig functions, then state the quadrant and signs.",
      "Close the notes and rebuild the topic from the single picture of a terminal point (x,y) and radius r.",
    ),
  ],
  "mat111-week-13": [
    page(
      "1. An identity is true for every allowed input",
      "A trigonometric identity is an equation that is true for all values where both sides are defined. That is different from a trig equation, which is true only for particular angle values.",
      "sin^2 x+cos^2 x=1 is an identity. sin x=1/2 is an equation with specific solutions.",
      "Explain the difference between verifying an identity and solving an equation.",
    ),
    page(
      "2. Reciprocal and quotient identities reduce the vocabulary",
      "sec=1/cos, csc=1/sin, cot=1/tan, tan=sin/cos, and cot=cos/sin. These let you rewrite unfamiliar expressions in terms of sine and cosine.",
      "sec x tan x can become (1/cos x)(sin x/cos x)=sin x/cos^2 x.",
      "Teach why converting to sine and cosine is often a useful simplification strategy.",
    ),
    page(
      "3. Pythagorean identities come from the unit circle",
      "The unit-circle equation x^2+y^2=1 becomes cos^2 theta+sin^2 theta=1. Dividing by cos^2 or sin^2 produces the other two Pythagorean identities.",
      "Divide sin^2+cos^2=1 by cos^2 to get tan^2+1=sec^2.",
      "Derive 1+cot^2=csc^2 instead of recalling it from memory.",
    ),
    page(
      "4. Verify identities by transforming one side",
      "When proving an identity, work on one side until it becomes the other. Useful moves include factoring, common denominators, Pythagorean substitutions, and converting to sine and cosine.",
      "sin x+cot x cos x = sin x+cos^2 x/sin x = (sin^2 x+cos^2 x)/sin x = csc x.",
      "Explain why changing both sides at once can make an identity proof harder to follow.",
    ),
    page(
      "5. Solving trig equations needs periodic solutions",
      "After isolating a trig function, first find basic angles, then use periodicity to capture every required solution in the interval or all real solutions.",
      "sin x=1/2 gives x=pi/6 and 5pi/6 in [0,2pi), then repeats every 2pi.",
      "Teach a checklist for solving a trig equation on a specified interval.",
    ),
    page(
      "6. Sum and difference formulas combine angles",
      "The sine and cosine of A±B can be expressed using sine and cosine of A and B. These formulas let you build exact values for angles that are not basic unit-circle angles.",
      "cos(45°+30°)=cos45 cos30 - sin45 sin30.",
      "Explain why 75 degrees is a natural candidate for a sum formula.",
    ),
    page(
      "7. Double-angle formulas are sum formulas with the same angle twice",
      "Set A=B=theta in the sum formulas. This gives sin2theta=2sin theta cos theta and several equivalent forms for cos2theta.",
      "If sin theta=3/5 and cos theta=4/5, then sin2theta=2(3/5)(4/5)=24/25.",
      "Teach how the double-angle formula for sine can be remembered from the sum formula.",
    ),
    page(
      "8. Half-angle and power-reducing formulas change the form of a problem",
      "Half-angle formulas relate theta/2 to theta, while power-reducing formulas rewrite sin^2 or cos^2 using cos2theta. They are useful when the original expression has squared trig functions or half angles.",
      "cos^2 x=(1+cos2x)/2 turns a squared cosine into a first-power cosine.",
      "Explain what kind of expression should make you think of a power-reducing identity.",
    ),
    page(
      "9. Choose identities by the shape you want",
      "Identity work is less about memorizing every formula and more about recognizing the target form. Ask what is making the expression complicated, then choose a formula that removes that obstacle.",
      "If you see 1-sin^2 x, replace it with cos^2 x. If you see tan and sec together, 1+tan^2=sec^2 may connect them.",
      "Explain how the desired final expression can guide your first algebraic move.",
    ),
    page(
      "10. One-minute teach-back",
      "Analytic trigonometry is algebra with a special toolbox. Fundamental identities rewrite expressions, periodicity solves equations, and angle formulas connect new angles to known ones.",
      "Simplify (1-sin^2 x)/cos x, solve sin x=0 on [0,2pi], and evaluate sin75 using a sum formula.",
      "Teach the topic by grouping formulas into three jobs: rewrite, solve, and build new angle values.",
    ),
  ],
  "mat111-week-14": [
    page(
      "1. i lets us name square roots of negative numbers",
      "Real numbers cannot square to -1, so complex numbers introduce i with i^2=-1. This extends the number system rather than breaking the old algebra rules.",
      "sqrt(-9)=3i because (3i)^2=9i^2=-9.",
      "Explain why i is defined by i^2=-1 instead of treated as an ordinary real number.",
    ),
    page(
      "2. Complex numbers have real and imaginary parts",
      "A complex number is written a+bi, where a and b are real. a is the real part and b is the coefficient of the imaginary part.",
      "For z=-4+7i, Re(z)=-4 and Im(z)=7.",
      "Teach how to identify the real and imaginary parts without saying the imaginary part is '7i'.",
    ),
    page(
      "3. Equality means both parts match",
      "Two complex numbers are equal only when their real parts are equal and their imaginary coefficients are equal. Think of them as ordered pairs with two coordinates that must both agree.",
      "If 2x+(y-1)i=6+3i, then 2x=6 and y-1=3, so x=3 and y=4.",
      "Explain why matching only the real parts is not enough to prove two complex numbers are equal.",
    ),
    page(
      "4. Add and subtract by grouping like parts",
      "Complex addition works like collecting like terms: combine real parts with real parts and imaginary parts with imaginary parts.",
      "(3+2i)+(-5+7i)=-2+9i. Subtraction works the same way with signs distributed carefully.",
      "Teach complex addition as if it were adding two coordinate pairs.",
    ),
    page(
      "5. Multiply normally, then replace i^2 with -1",
      "Use ordinary distributive algebra when multiplying complex numbers. The only special cleanup rule is i^2=-1, which converts the squared imaginary term back into a real number.",
      "(2+3i)(4-i)=8-2i+12i-3i^2=11+10i.",
      "Explain the exact point in a multiplication where the complex-number rule i^2=-1 is used.",
    ),
    page(
      "6. The conjugate flips only the imaginary sign",
      "The conjugate of a+bi is a-bi. Multiplying a complex number by its conjugate cancels the imaginary middle terms and produces the real number a^2+b^2.",
      "(3+4i)(3-4i)=9-16i^2=25.",
      "Explain why conjugates are useful whenever you want an imaginary part to disappear.",
    ),
    page(
      "7. Division uses a conjugate to make the denominator real",
      "To divide by c+di, multiply top and bottom by c-di. The denominator becomes c^2+d^2, an ordinary positive real number unless the divisor is zero.",
      "(1+2i)/(3+i) * (3-i)/(3-i) = (5+5i)/10 = (1+i)/2.",
      "Teach complex division as a rationalizing process rather than a new unrelated rule.",
    ),
    page(
      "8. a^2+b^2 measures complex size",
      "The product z times its conjugate is a^2+b^2. Its square root becomes the modulus |z|, which is the distance of the complex number from zero in the complex plane.",
      "For z=5-12i, z conjugate(z)=25+144=169, so |z|=13.",
      "Explain the connection between a^2+b^2 and the Pythagorean theorem.",
    ),
    page(
      "9. Complex roots finish quadratic equations",
      "When a real quadratic has a negative discriminant, the quadratic formula still works if sqrt(-1) is written as i. Complex numbers therefore give roots where the real number system stops.",
      "x^2+4=0 gives x^2=-4, so x=±2i.",
      "Explain what complex numbers add to the quadratic formula's ability to solve equations.",
    ),
    page(
      "10. One-minute teach-back",
      "Complex arithmetic behaves like familiar algebra plus one defining fact: i^2=-1. Standard form separates real and imaginary parts, while conjugates make division and size calculations manageable.",
      "Compute (2-3i)+(5+i), (2-3i)(5+i), and (2-3i)/(5+i) in standard form.",
      "Close the notes and teach i, standard form, arithmetic, conjugates, and division as one connected number-system extension.",
    ),
  ],
  "mat111-week-15": [
    page(
      "1. The complex plane turns a+bi into a point",
      "In an Argand diagram, a+bi becomes the point (a,b). The horizontal axis stores the real part and the vertical axis stores the imaginary part.",
      "z=-2+3i is plotted at (-2,3), exactly like a coordinate point in Quadrant II.",
      "Explain how the complex plane is the Cartesian plane with new labels on the axes.",
    ),
    page(
      "2. Modulus is distance from the origin",
      "The modulus |z|=sqrt(a^2+b^2) is the distance from (0,0) to (a,b). It is therefore always non-negative and comes directly from Pythagoras.",
      "For z=3-4i, |z|=sqrt(9+16)=5.",
      "Teach modulus as geometry rather than as a formula to memorize.",
    ),
    page(
      "3. Argument is direction",
      "The argument theta is the angle the vector from the origin to z makes with the positive real axis. The signs of a and b determine the quadrant, so quadrant awareness is essential when choosing theta.",
      "For z=-1+i, the point is in Quadrant II and has principal argument 3pi/4.",
      "Explain why arctan(b/a) alone can give the wrong argument if you ignore the quadrant.",
    ),
    page(
      "4. Rectangular form converts to polar form",
      "Find r=|z| and an argument theta, then write z=r(cos theta+i sin theta). Polar form stores a complex number as length and direction instead of horizontal and vertical components.",
      "1+sqrt(3)i has r=2 and theta=pi/3, so z=2(cos(pi/3)+i sin(pi/3)).",
      "Teach the two measurements needed to convert a+bi into polar form.",
    ),
    page(
      "5. Polar form converts back with coordinates",
      "From r(cos theta+i sin theta), the real part is r cos theta and the imaginary coefficient is r sin theta. This is ordinary polar-to-Cartesian coordinate conversion.",
      "4(cos(pi/6)+i sin(pi/6))=2sqrt(3)+2i.",
      "Explain why cosine gives the real part and sine gives the imaginary part.",
    ),
    page(
      "6. Multiplication in polar form combines size and direction",
      "When multiplying complex numbers in polar form, multiply their moduli and add their arguments. Division divides moduli and subtracts arguments.",
      "2cis30° times 3cis40° = 6cis70°, where cis theta means cos theta+i sin theta.",
      "Teach the geometric meaning of multiplying moduli and adding arguments.",
    ),
    page(
      "7. De Moivre makes powers easy",
      "De Moivre's theorem says [cos theta+i sin theta]^n=cos(n theta)+i sin(n theta). With modulus r, raise r to n and multiply the angle by n.",
      "(2cis30°)^3=8cis90°=8i.",
      "Explain why repeated multiplication causes the angle to be added repeatedly.",
    ),
    page(
      "8. nth roots reverse the power process",
      "To solve z^n=w in polar form, take the nth root of the modulus and divide all possible arguments by n. Because adding 2pi gives the same direction before division, n distinct roots appear.",
      "The cube roots of 8 have modulus 2 and arguments 0, 2pi/3, and 4pi/3.",
      "Teach why an nth-root problem produces n different angular answers.",
    ),
    page(
      "9. Complex roots form symmetric patterns",
      "The n roots of a nonzero complex number have equal modulus and are equally spaced in angle by 2pi/n. On the complex plane they form the vertices of a regular polygon.",
      "The fourth roots of 1 lie at angles 0, pi/2, pi, and 3pi/2, forming a square on the unit circle.",
      "Explain the geometric pattern you expect before calculating the fifth roots of a complex number.",
    ),
    page(
      "10. One-minute teach-back",
      "Rectangular form is best for addition; polar form is best for multiplication, powers, and roots. Modulus records size, argument records direction, and De Moivre turns repeated complex multiplication into simple operations on those two quantities.",
      "Convert 1+i to polar form, square it with De Moivre, then convert the result back to rectangular form.",
      "Close the notes and teach rectangular form, polar form, multiplication, De Moivre, and roots as one geometry-of-rotation story.",
    ),
  ],
};

export function getMat111FeynmanPages(lessonId: string) {
  return mat111FeynmanPagesByLesson[lessonId] ?? [];
}
