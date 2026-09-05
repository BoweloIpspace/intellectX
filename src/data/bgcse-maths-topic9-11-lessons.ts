import type { Lesson } from "./lessons";
import {
  BGCSE_MATHS_COURSE_ID,
  BGCSE_MATHS_TOPIC_9_ID,
  BGCSE_MATHS_TOPIC_10_ID,
  BGCSE_MATHS_TOPIC_11_ID,
} from "./bgcse-maths-course";

export const bgcseMathsTopic9To11Lessons: Lesson[] = [
  {
    id: BGCSE_MATHS_TOPIC_9_ID,
    courseId: BGCSE_MATHS_COURSE_ID,
    title: "Rates, Speed, Distance-Time & Speed-Time Graphs",
    duration: "3 quizzes",
    summary: "Calculate rates and speed, convert units, and interpret distance-time and speed-time graphs in BGCSE-style problems.",
    content: [
      "Use speed = distance ÷ time and rearrange the formula to find distance or time.",
      "Convert consistently between km/h and m/s before calculating.",
      "On distance-time graphs, gradient represents speed; on speed-time graphs, gradient represents acceleration.",
      "Find distance from the area under a speed-time graph by splitting the region into rectangles, triangles and trapezia.",
    ],
    nextLessonId: BGCSE_MATHS_TOPIC_10_ID,
  },
  {
    id: BGCSE_MATHS_TOPIC_10_ID,
    courseId: BGCSE_MATHS_COURSE_ID,
    title: "Constructions & Loci",
    duration: "2 quizzes",
    summary: "Use scale drawings, bearings, geometric constructions and loci to solve BGCSE-style location problems.",
    content: [
      "Use a ruler and compass to construct perpendicular bisectors, angle bisectors and triangles from given lengths.",
      "Use scale drawings carefully, converting measured lengths back to actual distances.",
      "Recognise standard loci: circles around fixed points, perpendicular bisectors of two points, and angle bisectors of intersecting lines.",
      "Combine two locus conditions and use their intersections to locate a point satisfying both constraints.",
    ],
    nextLessonId: BGCSE_MATHS_TOPIC_11_ID,
  },
  {
    id: BGCSE_MATHS_TOPIC_11_ID,
    courseId: BGCSE_MATHS_COURSE_ID,
    title: "Transformations & Symmetry",
    duration: "3 quizzes",
    summary: "Describe and perform translations, reflections, rotations and enlargements, and identify line and rotational symmetry.",
    content: [
      "Describe translations using vectors and reflections using the mirror line.",
      "Describe rotations using centre, angle and direction, then track each vertex accurately.",
      "For enlargements, use the centre and scale factor; a negative scale factor places the image on the opposite side of the centre.",
      "Identify line symmetry and rotational symmetry, and use coordinate rules to check transformed points.",
    ],
  },
];
