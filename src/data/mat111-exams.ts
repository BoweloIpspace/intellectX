import { MAT111_COURSE_ID } from "./mat111-course";

export type Mat111ExamQuestion = {
  stableId: string;
  questionNumber: string;
  sectionLabel?: string;
  prompt: string;
  marks?: number;
  stimulusTitle?: string;
  stimulusText?: string;
  stimulusAssetPath?: string;
  stimulusAssetAlt?: string;
  stimulusSourceStatus?: "source-text" | "reconstructed-visual";
  order: number;
};

export type Mat111ExamPaper = {
  stableId: string;
  courseStableId: string;
  title: string;
  year: number;
  paperCode: string;
  session?: string;
  description?: string;
  estimatedTime?: string;
  totalMarks?: number;
  pageCount?: number;
  order: number;
  questions: Mat111ExamQuestion[];
};

export const mat111ExamPapers: Mat111ExamPaper[] = [
  {
    stableId: "mat111-practice-paper-1-functions-geometry",
    courseStableId: MAT111_COURSE_ID,
    title: "MAT111 Practice Paper 1: Functions and Geometry",
    year: 2026,
    paperCode: "MAT111-P1",
    session: "Lecture-note practice",
    description: "Structured practice from Weeks 2, 3, 4 and 5.",
    estimatedTime: "90 min",
    totalMarks: 60,
    order: 1,
    questions: [
      {
        stableId: "p1q1",
        questionNumber: "1",
        sectionLabel: "Functions",
        prompt: "Let f(x)=2x-3 and g(x)=x^2-1. Find (f+g)(x), (f-g)(x), (fg)(x), and (f/g)(x). State the values of x excluded from the quotient.",
        marks: 10,
        order: 1,
      },
      {
        stableId: "p1q2",
        questionNumber: "2",
        sectionLabel: "Inverse functions",
        prompt: "Find the inverse of f(x)=(5-3x)/2. Then verify your result by composing f with your inverse in both orders.",
        marks: 10,
        stimulusTitle: "Function and inverse",
        stimulusAssetPath: "/mat111/week2-functions.svg",
        stimulusAssetAlt: "Function composition and inverse relationship diagram",
        stimulusSourceStatus: "reconstructed-visual",
        order: 2,
      },
      {
        stableId: "p1q3",
        questionNumber: "3",
        sectionLabel: "Graph transformations",
        prompt: "Starting from the parent graph y=x^2, describe the transformations required to obtain y=3-(x+2)^2. State the vertex and axis of symmetry of the transformed graph.",
        marks: 10,
        stimulusTitle: "Parent and transformed graphs",
        stimulusAssetPath: "/mat111/week3-graphs.svg",
        stimulusAssetAlt: "Parent and transformed graph study diagram",
        stimulusSourceStatus: "reconstructed-visual",
        order: 3,
      },
      {
        stableId: "p1q4",
        questionNumber: "4",
        sectionLabel: "Coordinate geometry",
        prompt: "For P(-2,1) and Q(3,4), calculate the distance PQ and the midpoint of PQ. Give the distance exactly and to two decimal places.",
        marks: 10,
        stimulusTitle: "Coordinate geometry",
        stimulusAssetPath: "/mat111/week4-coordinate-geometry.svg",
        stimulusAssetAlt: "Cartesian plane with points, midpoint, slope triangle and circle",
        stimulusSourceStatus: "reconstructed-visual",
        order: 4,
      },
      {
        stableId: "p1q5",
        questionNumber: "5",
        sectionLabel: "Circles",
        prompt: "A circle has diameter endpoints A(-4,2) and B(3,5). Find its centre and radius, then write the equation of the circle in standard form.",
        marks: 10,
        order: 5,
      },
      {
        stableId: "p1q6",
        questionNumber: "6",
        sectionLabel: "Quadratic functions",
        prompt: "A parabola has vertex (1,2) and passes through (3,-6). Determine its equation in standard form. State whether it opens upward or downward and identify its maximum or minimum value.",
        marks: 10,
        stimulusTitle: "Quadratic structure",
        stimulusAssetPath: "/mat111/week5-quadratics.svg",
        stimulusAssetAlt: "Parabola with vertex and axis of symmetry",
        stimulusSourceStatus: "reconstructed-visual",
        order: 6,
      },
    ],
  },
  {
    stableId: "mat111-practice-paper-2-exp-trig",
    courseStableId: MAT111_COURSE_ID,
    title: "MAT111 Practice Paper 2: Exponentials and Trigonometry",
    year: 2026,
    paperCode: "MAT111-P2",
    session: "Lecture-note practice",
    description: "Structured practice from Weeks 9, 10, 11 and 13.",
    estimatedTime: "100 min",
    totalMarks: 60,
    order: 2,
    questions: [
      {
        stableId: "p2q1",
        questionNumber: "1",
        sectionLabel: "Log equations",
        prompt: "Solve ln(6-5x)=2ln(x). State the domain before solving and explain why any rejected algebraic root is invalid.",
        marks: 10,
        stimulusTitle: "Exponential and logarithmic inverse graphs",
        stimulusAssetPath: "/mat111/week9-exp-log.svg",
        stimulusAssetAlt: "Exponential and logarithmic curves reflected across y equals x",
        stimulusSourceStatus: "reconstructed-visual",
        order: 1,
      },
      {
        stableId: "p2q2",
        questionNumber: "2",
        sectionLabel: "Exponential equations",
        prompt: "Solve 4^x=100 by taking natural logarithms. Give your answer as an exact logarithmic expression and as a decimal to two decimal places.",
        marks: 10,
        order: 2,
      },
      {
        stableId: "p2q3",
        questionNumber: "3",
        sectionLabel: "Angles and right triangles",
        prompt: "(a) Convert 150 degrees to radians. (b) For an acute angle theta in a 5-12-13 right triangle with opposite side 5, determine all six trigonometric functions.",
        marks: 10,
        stimulusTitle: "Angles and right-triangle trigonometry",
        stimulusAssetPath: "/mat111/week10-angles-trig.svg",
        stimulusAssetAlt: "Angle in standard position and a labelled right triangle",
        stimulusSourceStatus: "reconstructed-visual",
        order: 3,
      },
      {
        stableId: "p2q4",
        questionNumber: "4",
        sectionLabel: "Any-angle trigonometry",
        prompt: "The point (-3,4) lies on the terminal side of theta. Determine r and the exact values of all six trigonometric functions of theta. State the quadrant and use it to check the signs.",
        marks: 10,
        stimulusTitle: "Terminal side and quadrant signs",
        stimulusAssetPath: "/mat111/week11-trig-any-angle.svg",
        stimulusAssetAlt: "Unit-circle style terminal-side diagram with quadrant sign summary",
        stimulusSourceStatus: "reconstructed-visual",
        order: 4,
      },
      {
        stableId: "p2q5",
        questionNumber: "5",
        sectionLabel: "Reference angles and graphs",
        prompt: "(a) Find the reference angle for 300 degrees and hence evaluate its cosine exactly. (b) State the domain, range, period and symmetry of y=sin(x).",
        marks: 10,
        order: 5,
      },
      {
        stableId: "p2q6",
        questionNumber: "6",
        sectionLabel: "Analytic trigonometry",
        prompt: "Solve 2sin^2(x)-sin(x)-1=0 for x in [0,2pi]. Show the factorisation and list every solution in the interval.",
        marks: 10,
        stimulusTitle: "Analytic trigonometry identity map",
        stimulusAssetPath: "/mat111/week13-analytic-trig.svg",
        stimulusAssetAlt: "Formula map for quotient, reciprocal, Pythagorean and double-angle identities",
        stimulusSourceStatus: "reconstructed-visual",
        order: 6,
      },
    ],
  },
  {
    stableId: "mat111-practice-paper-3-complex",
    courseStableId: MAT111_COURSE_ID,
    title: "MAT111 Practice Paper 3: Complex Numbers",
    year: 2026,
    paperCode: "MAT111-P3",
    session: "Lecture-note practice",
    description: "Structured practice from Weeks 14 and 15.",
    estimatedTime: "80 min",
    totalMarks: 60,
    order: 3,
    questions: [
      {
        stableId: "p3q1",
        questionNumber: "1",
        sectionLabel: "Complex arithmetic",
        prompt: "Evaluate (2-3i)(4+3i) and write the answer in standard form a+bi. Show how i^2=-1 is used.",
        marks: 10,
        stimulusTitle: "Complex numbers and conjugates",
        stimulusAssetPath: "/mat111/week14-complex-numbers.svg",
        stimulusAssetAlt: "Complex-number standard form and conjugate relationship",
        stimulusSourceStatus: "reconstructed-visual",
        order: 1,
      },
      {
        stableId: "p3q2",
        questionNumber: "2",
        sectionLabel: "Complex division",
        prompt: "Write (2+3i)/(4-2i) in standard form. Show the conjugate used and simplify the real denominator.",
        marks: 10,
        order: 2,
      },
      {
        stableId: "p3q3",
        questionNumber: "3",
        sectionLabel: "Conjugates",
        prompt: "For z=a+bi, state the complex conjugate of z and prove algebraically that z times its conjugate equals a^2+b^2.",
        marks: 10,
        order: 3,
      },
      {
        stableId: "p3q4",
        questionNumber: "4",
        sectionLabel: "Complex plane",
        prompt: "For z=1+sqrt(3)i, find the modulus and principal argument, plot its location conceptually on an Argand diagram, and write z in polar form.",
        marks: 10,
        stimulusTitle: "Argand diagram and polar form",
        stimulusAssetPath: "/mat111/week15-complex-plane.svg",
        stimulusAssetAlt: "Argand diagram showing a complex-number vector, modulus and argument",
        stimulusSourceStatus: "reconstructed-visual",
        order: 4,
      },
      {
        stableId: "p3q5",
        questionNumber: "5",
        sectionLabel: "De Moivre",
        prompt: "Use polar form and De Moivre's theorem to evaluate (1+i sqrt(3))^6 in standard form.",
        marks: 10,
        order: 5,
      },
      {
        stableId: "p3q6",
        questionNumber: "6",
        sectionLabel: "Complex roots",
        prompt: "Solve z^4=1 using the nth-root formula in polar form. Give all four distinct roots and show the arguments corresponding to k=0,1,2,3.",
        marks: 10,
        order: 6,
      },
    ],
  },
];

export function getMat111ExamPaper(id: string) {
  return mat111ExamPapers.find((paper) => paper.stableId === id);
}

export function getMat111ExamPapersByCourse(courseId: string) {
  return courseId === MAT111_COURSE_ID ? mat111ExamPapers : [];
}
