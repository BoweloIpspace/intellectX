import type { Lesson } from "./lessons";
import {
  BGCSE_MATHS_COURSE_ID,
  BGCSE_MATHS_TOPIC_16_ID,
  BGCSE_MATHS_TOPIC_17_ID,
  BGCSE_MATHS_TOPIC_18_ID,
} from "./bgcse-maths-course";

export const bgcseMathsTopic16To18Lessons: Lesson[] = [
  {
    id: BGCSE_MATHS_TOPIC_16_ID,
    courseId: BGCSE_MATHS_COURSE_ID,
    title: "Mensuration: Area, Surface Area, Volume & Density",
    duration: "4 quizzes",
    summary: "Calculate areas, surface areas, volumes and density for the solids and composite shapes used in BGCSE-style problems.",
    content: [
      "Use the correct formula for area, curved surface area and total surface area, and keep units squared for area.",
      "Calculate volumes of cylinders, cones, spheres, hemispheres, prisms and pyramids, including composite and hollow solids.",
      "Use density = mass ÷ volume and rearrange it to find mass or volume when required.",
      "Check whether a question needs an exposed surface, a submerged surface, a composite volume or a rounded final answer.",
    ],
    nextLessonId: BGCSE_MATHS_TOPIC_17_ID,
  },
  {
    id: BGCSE_MATHS_TOPIC_17_ID,
    courseId: BGCSE_MATHS_COURSE_ID,
    title: "Statistics",
    duration: "4 quizzes",
    summary: "Work with averages, spread, grouped data, variance, standard deviation, quartiles and cumulative frequency.",
    content: [
      "Find the mean, median, mode and range from raw data and frequency tables.",
      "For grouped data, use class midpoints to estimate the mean, variance and standard deviation.",
      "Use cumulative frequency positions to estimate the median, quartiles, percentiles and interquartile range.",
      "Interpret each statistic in context and distinguish measures of centre from measures of spread.",
    ],
    nextLessonId: BGCSE_MATHS_TOPIC_18_ID,
  },
  {
    id: BGCSE_MATHS_TOPIC_18_ID,
    courseId: BGCSE_MATHS_COURSE_ID,
    title: "Probability",
    duration: "3 quizzes",
    summary: "Calculate simple probabilities and probabilities from two selections without replacement in BGCSE-style contexts.",
    content: [
      "Write probability as favourable outcomes divided by the total number of equally likely outcomes.",
      "Use complementary probability when it is easier to calculate the event not happening.",
      "For selections without replacement, reduce the total number of available items after the first selection.",
      "For events that can happen in more than one order, calculate each valid order and add the probabilities.",
    ],
  },
];
