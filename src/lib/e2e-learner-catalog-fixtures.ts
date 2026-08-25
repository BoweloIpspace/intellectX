import { courses } from "@/data/courses";
import { lessons } from "@/data/lessons";
import { MAT111_COURSE_ID, mat111Course } from "@/data/mat111-course";
import { mat111Lessons } from "@/data/mat111-lessons";
import { mat111Quizzes } from "@/data/mat111-quizzes";
import { quizzes } from "@/data/quizzes";

export function getE2eLearnerCatalogFixtures() {
  const fixtureCourses = courses.some((course) => course.id === MAT111_COURSE_ID)
    ? [...courses]
    : [...courses, mat111Course];
  const existingLessonIds = new Set(lessons.map((lesson) => lesson.id));
  const existingQuizIds = new Set(quizzes.map((quiz) => quiz.id));

  return {
    courses: fixtureCourses,
    lessons: [...lessons, ...mat111Lessons.filter((lesson) => !existingLessonIds.has(lesson.id))],
    quizzes: [...quizzes, ...mat111Quizzes.filter((quiz) => !existingQuizIds.has(quiz.id))],
  };
}
