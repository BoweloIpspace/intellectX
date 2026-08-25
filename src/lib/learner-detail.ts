import { getE2eLearnerCatalogFixtures } from "@/lib/e2e-learner-catalog-fixtures";
import { getLearnerLessonDetail, getLearnerQuizDetail } from "@/lib/learner-catalog";

const e2eCatalogFixturesEnabled = process.env.NEXT_PUBLIC_E2E_CATALOG_FIXTURES === "1";

function getE2eCourse(courseId: string) {
  const fixtures = getE2eLearnerCatalogFixtures();
  const course = fixtures.courses.find((item) => item.id === courseId || item.slug === courseId) ?? null;

  if (!course) {
    return null;
  }

  const lessons = fixtures.lessons.filter((lesson) => lesson.courseId === course.id);
  const quizzes = fixtures.quizzes.filter((quiz) => quiz.courseId === course.id);

  return {
    course: {
      ...course,
      lessonIds: lessons.map((lesson) => lesson.id),
      quizIds: quizzes.map((quiz) => quiz.id),
    },
    lessons,
    quizzes,
  };
}

export async function getLearnerLessonPageDetail(lessonId: string) {
  if (!e2eCatalogFixturesEnabled) {
    return getLearnerLessonDetail(lessonId);
  }

  const fixtures = getE2eLearnerCatalogFixtures();
  const lesson = fixtures.lessons.find((item) => item.id === lessonId) ?? null;

  if (!lesson) {
    return null;
  }

  const courseDetail = getE2eCourse(lesson.courseId);
  return courseDetail ? { lesson, course: courseDetail.course, lessons: courseDetail.lessons } : null;
}

export async function getLearnerQuizPageDetail(quizId: string) {
  if (!e2eCatalogFixturesEnabled) {
    return getLearnerQuizDetail(quizId);
  }

  const fixtures = getE2eLearnerCatalogFixtures();
  const quiz = fixtures.quizzes.find((item) => item.id === quizId) ?? null;

  if (!quiz) {
    return null;
  }

  const courseDetail = getE2eCourse(quiz.courseId);
  return courseDetail ? { quiz, course: courseDetail.course } : null;
}
