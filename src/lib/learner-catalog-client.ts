"use client";

import type { Course } from "@/data/courses";
import type { Lesson } from "@/data/lessons";
import type { Quiz } from "@/data/quizzes";
import {
  ACADEMIC_PROFILE_CHANGE_EVENT,
  type AcademicProfile,
  courseMatchesAcademicTrack,
  isAcademicTrackComplete,
  loadAcademicProfile,
} from "@/lib/academic-profile";
import { convexApi } from "@/lib/convex-api";
import { convexEnv } from "@/lib/education-data";
import { getE2eLearnerCatalogFixtures } from "@/lib/e2e-learner-catalog-fixtures";
import { isMobileAppRuntime } from "@/lib/feature-scope";
import {
  normalizeLearnerCourse,
  normalizeLearnerLesson,
  normalizeLearnerQuiz,
  type ConvexCourseRecord,
  type ConvexLessonRecord,
  type ConvexQuizRecord,
} from "@/lib/learner-catalog";
import { useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";

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
  const fixtures = getE2eLearnerCatalogFixtures();
  const courses = fixtures.courses.map((course) => ({
    ...course,
    lessonIds: fixtures.lessons.filter((lesson) => lesson.courseId === course.id).map((lesson) => lesson.id),
    quizIds: fixtures.quizzes.filter((quiz) => quiz.courseId === course.id).map((quiz) => quiz.id),
  }));

  return {
    courses,
    lessons: fixtures.lessons,
    quizzes: fixtures.quizzes,
    courseById: new Map(courses.map((course) => [course.id, course])),
    lessonById: new Map(fixtures.lessons.map((lesson) => [lesson.id, lesson])),
    quizById: new Map(fixtures.quizzes.map((quiz) => [quiz.id, quiz])),
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

function filterCatalogForAcademicProfile(catalog: LearnerCatalog, profile: AcademicProfile | null): LearnerCatalog {
  if (!profile || !isAcademicTrackComplete(profile)) {
    return {
      ...catalog,
      courses: [],
      lessons: [],
      quizzes: [],
      courseById: new Map(),
      lessonById: new Map(),
      quizById: new Map(),
    };
  }

  const courses = catalog.courses.filter((course) => courseMatchesAcademicTrack(course, profile));
  const courseIds = new Set(courses.map((course) => course.id));
  const lessons = catalog.lessons.filter((lesson) => courseIds.has(lesson.courseId));
  const quizzes = catalog.quizzes.filter((quiz) => courseIds.has(quiz.courseId));

  return {
    ...catalog,
    courses,
    lessons,
    quizzes,
    courseById: new Map(courses.map((course) => [course.id, course])),
    lessonById: new Map(lessons.map((lesson) => [lesson.id, lesson])),
    quizById: new Map(quizzes.map((quiz) => [quiz.id, quiz])),
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
  const [nativeProfileState, setNativeProfileState] = useState<{
    ready: boolean;
    native: boolean;
    profile: AcademicProfile | null;
  }>({ ready: false, native: false, profile: null });

  useEffect(() => {
    const native = isMobileAppRuntime();

    function syncProfile() {
      setNativeProfileState({
        ready: true,
        native,
        profile: native ? loadAcademicProfile() : null,
      });
    }

    syncProfile();

    if (!native) {
      return;
    }

    window.addEventListener(ACADEMIC_PROFILE_CHANGE_EVENT, syncProfile);
    window.addEventListener("storage", syncProfile);
    window.addEventListener("pageshow", syncProfile);

    return () => {
      window.removeEventListener(ACADEMIC_PROFILE_CHANGE_EVENT, syncProfile);
      window.removeEventListener("storage", syncProfile);
      window.removeEventListener("pageshow", syncProfile);
    };
  }, []);

  const catalog = useMemo(() => {
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

  return useMemo(() => {
    if (!nativeProfileState.ready) {
      return { ...catalog, isLoading: true };
    }

    if (!nativeProfileState.native || catalog.isLoading) {
      return catalog;
    }

    return filterCatalogForAcademicProfile(catalog, nativeProfileState.profile);
  }, [catalog, nativeProfileState]);
}
