import "server-only";

export type Mat111ExamAnswer = {
  modelAnswer: string;
  explanation?: string;
};

const answers: Record<string, Record<string, Mat111ExamAnswer>> = {
  "mat111-practice-paper-1-functions-geometry": {
    p1q1: {
      modelAnswer:
        "(f+g)(x)=x^2+2x-4.\n(f-g)(x)=-x^2+2x-2.\n(fg)(x)=(2x-3)(x^2-1)=2x^3-3x^2-2x+3.\n(f/g)(x)=(2x-3)/(x^2-1), with x != -1 and x != 1.",
      explanation: "The first three operations are pointwise. For the quotient, x^2-1 cannot be zero.",
    },
    p1q2: {
      modelAnswer:
        "Let y=(5-3x)/2. Then 2y=5-3x, so x=(5-2y)/3. Hence f^(-1)(x)=(5-2x)/3.\n\nf(f^(-1)(x))=(5-3((5-2x)/3))/2=x, and f^(-1)(f(x))=(5-2((5-3x)/2))/3=x.",
      explanation: "Both compositions reduce to the identity, which verifies the inverse relationship.",
    },
    p1q3: {
      modelAnswer:
        "From y=x^2: first reflect in the x-axis to get y=-x^2; shift 2 units left to get y=-(x+2)^2; then shift 3 units up to get y=3-(x+2)^2. The vertex is (-2,3) and the axis of symmetry is x=-2.",
    },
    p1q4: {
      modelAnswer:
        "PQ=sqrt((3-(-2))^2+(4-1)^2)=sqrt(25+9)=sqrt(34)≈5.83.\nMidpoint=((-2+3)/2,(1+4)/2)=(1/2,5/2).",
      explanation: "Distance uses the Pythagorean distance formula; midpoint averages the corresponding coordinates.",
    },
    p1q5: {
      modelAnswer:
        "Centre=((−4+3)/2,(2+5)/2)=(-1/2,7/2).\nDiameter=sqrt((3+4)^2+(5-2)^2)=sqrt(58), so r=sqrt(58)/2.\nEquation: (x+1/2)^2+(y-7/2)^2=58/4=29/2.",
    },
    p1q6: {
      modelAnswer:
        "Use f(x)=a(x-1)^2+2. Since the graph passes through (3,-6), -6=4a+2, so a=-2. Therefore f(x)=-2(x-1)^2+2. It opens downward and has maximum value 2 at x=1.",
    },
  },
  "mat111-practice-paper-2-exp-trig": {
    p2q1: {
      modelAnswer:
        "The domain requires x>0 and 6-5x>0, so 0<x<6/5.\n2ln(x)=ln(x^2), hence 6-5x=x^2. Thus x^2+5x-6=0=(x+6)(x-1), giving x=-6 or x=1. Only x=1 lies in the logarithmic domain.",
    },
    p2q2: {
      modelAnswer: "4^x=100 => ln(4^x)=ln(100) => x ln 4=ln 100. Therefore x=ln(100)/ln(4)≈3.32.",
    },
    p2q3: {
      modelAnswer:
        "(a) 150 degrees * pi/180 degrees = 5pi/6.\n(b) sin(theta)=5/13, cos(theta)=12/13, tan(theta)=5/12, cot(theta)=12/5, csc(theta)=13/5, sec(theta)=13/12.",
    },
    p2q4: {
      modelAnswer:
        "r=sqrt((-3)^2+4^2)=5. The point is in Quadrant II.\nsin(theta)=4/5, cos(theta)=-3/5, tan(theta)=-4/3, cot(theta)=-3/4, csc(theta)=5/4, sec(theta)=-5/3.",
      explanation: "In Quadrant II, sine is positive while cosine and tangent are negative.",
    },
    p2q5: {
      modelAnswer:
        "(a) 300 degrees is in Quadrant IV, so the reference angle is 360-300=60 degrees. Hence cos(300 degrees)=cos(60 degrees)=1/2.\n(b) For y=sin(x): domain is all real numbers, range is [-1,1], period is 2pi, and the graph is symmetric about the origin because sine is odd.",
    },
    p2q6: {
      modelAnswer:
        "2sin^2(x)-sin(x)-1=0 factors as (2sin(x)+1)(sin(x)-1)=0.\nSo sin(x)=-1/2 or sin(x)=1. In [0,2pi], the solutions are x=7pi/6, 11pi/6, and pi/2.",
    },
  },
  "mat111-practice-paper-3-complex": {
    p3q1: {
      modelAnswer: "(2-3i)(4+3i)=8+6i-12i-9i^2=8-6i+9=17-6i, since i^2=-1.",
    },
    p3q2: {
      modelAnswer:
        "Multiply by the conjugate 4+2i:\n(2+3i)/(4-2i) * (4+2i)/(4+2i) = (14+16i? no)\nNumerator: (2+3i)(4+2i)=8+4i+12i+6i^2=2+16i.\nDenominator: 4^2+2^2=20.\nTherefore the quotient is 1/10+(4/5)i.",
      explanation: "This model answer recomputes the displayed expression directly; the conjugate makes the denominator real.",
    },
    p3q3: {
      modelAnswer: "For z=a+bi, the conjugate is z-bar=a-bi. Then (a+bi)(a-bi)=a^2-(bi)^2=a^2-b^2i^2=a^2+b^2 because i^2=-1.",
    },
    p3q4: {
      modelAnswer:
        "For z=1+sqrt(3)i, |z|=sqrt(1+3)=2. Its principal argument is pi/3 because cos(theta)=1/2 and sin(theta)=sqrt(3)/2. The point is (1,sqrt(3)) in Quadrant I. Thus z=2(cos(pi/3)+i sin(pi/3)).",
    },
    p3q5: {
      modelAnswer:
        "1+i sqrt(3)=2(cos(pi/3)+i sin(pi/3)). By De Moivre, (1+i sqrt(3))^6=2^6(cos(2pi)+i sin(2pi))=64.",
    },
    p3q6: {
      modelAnswer:
        "Write 1=cos(0)+i sin(0). The fourth roots have modulus 1 and arguments (0+2kpi)/4 for k=0,1,2,3: 0, pi/2, pi, 3pi/2. Therefore the roots are 1, i, -1, -i.",
      explanation: "The nth-root rule gives exactly n equally spaced roots when the target complex number is nonzero.",
    },
  },
};

export function getMat111ExamAnswer(paperId: string, questionId: string) {
  return answers[paperId]?.[questionId] ?? null;
}
