"use client";

import { courses as staticCourses, type Course } from "@/data/courses";
import { lessons as staticLessons, type Lesson } from "@/data/lessons";
import { MAT111_COURSE_ID, mat111Course } from "@/data/mat111-course";
import { mat111Lessons } from "@/data/mat111-lessons";
import { mat111Quizzes } from "@/data/mat111-quizzes";
import { quizzes as staticQuizzes, type Quiz } from "@/data/quizzes";
import { convexApi } from "@/lib/convex-api";
import { convexEnv } from "@/lib/education-data";
import {
  normalizeLearnerCourse,
  normalizeLearnerLesson,
  normalizeLearnerQuiz,
  type ConvexCourseRecord,
  type ConvexLessonRecord,
  type ConvexQuizRecord,
} from "@/lib/learner-catalog";
import { useQuery } from "convex/react";
import { useMemo } from "react";

export type LearnerCatalog = {
  courses: Course[];
  lessons: Lesson[];
  quizzes: Quiz[];
  courseById: Map<string, Course>;
  lessonById: Map<string, Lesson>;
  quizById: Map<string, Quiz>;
  isLive: boolean;
  isLoading: boolean;
};

const e2eCatalogFixturesEnabled = process.env.NEXT_PUBLIC_E2E_CATALOG_FIXTURES === "1";

function buildE2eFixtureCatalog(): LearnerCatalog {
  const courses = staticCourses.some((course) => course.id === MAT111_COURSE_ID)
    ? [...staticCourses]
    : [...staticCourses, mat111Course];
  const existingLessonIds = new Set(staticLessons.map((lesson) => lesson.id));
  const existingQuizIds = new Set(staticQuizzes.map((quiz) => quiz.id));
  const lessons = [...staticLessons, ...mat111Lessons.filter((lesson) => !existingLessonIds.has(lesson.id))];
  const quizzes = [...staticQuizzes, ...mat111Quizzes.filter((quiz) => !existingQuizIds.has(quiz.id))];
  const coursesWithRelationships = courses.map((course) => ({
    ...course,
    lessonIds: lessons.filter((lesson) => lesson.courseId === course.id).map((lesson) => lesson.id),
    quizIds: quizzes.filter((quiz) => quiz.courseId === course.id).map((quiz) => quiz.id),
  }));

  return {
    courses: coursesWithRelationships,
    lessons,
    quizzes,
    courseById: new Map(coursesWithRelationships.map((course) => [course.id, course])),
    lessonById: new Map(lessons.map((lesson) => [lesson.id, lesson])),
    quizById: new Map(quizzes.map((quiz) => [quiz.id, quiz])),
    isLive: false,
    isLoading: false,
  };
}

export function buildLearnerCatalog(input?: {
  convexCourses?: ConvexCourseRecord[] | null;
  convexLessons?: ConvexLessonRecord[] | null;
  convexQuizzes?: ConvexQuizRecord[] | null;
}): LearnerCatalog {
  if (!input && e2eCatalogFixturesEnabled) {
    return buildE2eFixtureCatalog();
  }

  const normalizedCourses = (input?.convexCourses ?? [])
    .map((course) => normalizeLearnerCourse(course))
    .filter((course): course is Course => Boolean(course));
  const initialCourseById = new Map(normalizedCourses.map((course) => [course.id, course]));

  const quizzesByCourseId = new Map<string, ConvexQuizRecord[]>();
  for (const quiz of input?.convexQuizzes ?? []) {
    const courseQuizzes = quizzesByCourseId.get(quiz.courseStableId) ?? [];
    courseQuizzes.push(quiz);
    quizzesByCourseId.set(quiz.courseStableId, courseQuizzes);
  }

  const lessonsByCourseId = new Map<string, ConvexLessonRecord[]>();
  for (const lesson of input?.convexLessons ?? []) {
    const courseLessons = lessonsByCourseId.get(lesson.courseStableId) ?? [];
    courseLessons.push(lesson);
    lessonsByCourseId.set(lesson.courseStableId, courseLessons);
  }

  const quizzes = (input?.convexQuizzes ?? [])
    .map((quiz) =>
      normalizeLearnerQuiz(quiz, {
        course: initialCourseById.get(quiz.courseStableId) ?? null,
      }),
    )
    .filter((quiz): quiz is Quiz => Boolean(quiz));

  const lessons = (input?.convexLessons ?? [])
    .map((lesson) =>
      normalizeLearnerLesson(lesson, {
        course: initialCourseById.get(lesson.courseStableId) ?? null,
        lessons: lessonsByCourseId.get(lesson.courseStableId),
        quizzes: quizzesByCourseId.get(lesson.courseStableId),
      }),
    )
    .filter((lesson): lesson is Lesson => Boolean(lesson));

  const courses = normalizedCourses.map((course) => ({
    ...course,
    lessonIds: lessons.filter((lesson) => lesson.courseId === course.id).map((lesson) => lesson.id),
    quizIds: quizzes.filter((quiz) => quiz.courseId === course.id).map((quiz) => quiz.id),
  }));

  return {
    courses,
    lessons,
    quizzes,
    courseById: new Map(courses.map((course) => [course.id, course])),
    lessonById: new Map(lessons.map((lesson) => [lesson.id, lesson])),
    quizById: new Map(quizzes.map((quiz) => [quiz.id, quiz])),
    isLive: Boolean(
      input &&
        (input.convexCourses !== undefined || input.convexLessons !== undefined || input.convexQuizzes !== undefined),
    ),
    isLoading: false,
  };
}

type ConvexCatalogQuery = Parameters<typeof useQuery>[0];

function useOptionalConvexQuery(query: ConvexCatalogQuery) {
  if (!convexEnv.isConfigured) {
    return undefined;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks -- guard above is a build-time constant
  return useQuery(query, {});
}

export function useLearnerCatalog() {
  const convexCourses = useOptionalConvexQuery(convexApi.courses.listCourses);
  const convexLessons = useOptionalConvexQuery(convexApi.lessons.listLessons);
  const convexQuizzes = useOptionalConvexQuery(convexApi.quizzes.listQuizzes);

  return useMemo(() => {
    if (!convexEnv.isConfigured) {
      return buildLearnerCatalog();
    }

    if (convexCourses === undefined || convexLessons === undefined || convexQuizzes === undefined) {
      return {
        ...buildLearnerCatalog({ convexCourses: [], convexLessons: [], convexQuizzes: [] }),
        isLoading: true,
      };
    }

    return buildLearnerCatalog({
      convexCourses: convexCourses as ConvexCourseRecord[],
      convexLessons: convexLessons as ConvexLessonRecord[],
      convexQuizzes: convexQuizzes as ConvexQuizRecord[],
    });
  }, [convexCourses, convexLessons, convexQuizzes]);
}
