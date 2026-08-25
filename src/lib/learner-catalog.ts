import type { Course, CourseLevel } from "@/data/courses";
import type { Lesson } from "@/data/lessons";
import type { Quiz, QuizQuestion } from "@/data/quizzes";
import { convexApi } from "@/lib/convex-api";
import { convexEnv } from "@/lib/education-data";
import { getContentAccessLevel, getEntitlementAccessDecision, type ContentAccessLevel } from "@/lib/entitlements";
import { isLearnerVisibleCourse } from "@/lib/course-workflow-policy";
import { ConvexHttpClient } from "convex/browser";

export type ConvexCourseRecord = {
  stableId: string;
  slug: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  duration: string;
  accent: string;
  accessLevel?: ContentAccessLevel;
  reviewStatus?: Course["reviewStatus"];
  publicationStatus?: Course["publicationStatus"];
};

export type ConvexLessonRecord = {
  stableId: string;
  courseStableId: string;
  title: string;
  duration: string;
  summary: string;
  content: string[];
  videoUrl?: string;
  posterUrl?: string;
  accessLevel?: ContentAccessLevel;
  order?: number;
};

export type ConvexQuestionRecord = {
  stableId?: unknown;
  prompt?: unknown;
  choices?: unknown;
  questionType?: unknown;
  diagramPath?: unknown;
  diagramAlt?: unknown;
  order?: unknown;
};

export type ConvexQuizRecord = {
  stableId: string;
  courseStableId: string;
  lessonStableId?: string;
  title: string;
  difficulty: string;
  estimatedTime: string;
  accessLevel?: ContentAccessLevel;
  questions?: ConvexQuestionRecord[];
};

export type LearnerCourseDetail = {
  course: Course;
  lessons: Lesson[];
  quizzes: Quiz[];
};

function getConvexClient() {
  return convexEnv.url ? new ConvexHttpClient(convexEnv.url) : null;
}

function isCourseLevel(value: string): value is CourseLevel {
  return value === "Beginner" || value === "Intermediate" || value === "Advanced";
}

function isQuizDifficulty(value: string): value is Quiz["difficulty"] {
  return value === "Foundational" || value === "Applied" || value === "Challenge";
}

function accessAllowed(value: { accessLevel?: ContentAccessLevel }) {
  return getEntitlementAccessDecision({ accessLevel: getContentAccessLevel(value) }).allowed;
}

export function normalizeLearnerCourse(course: ConvexCourseRecord, fallback?: Course): Course | null {
  const workflowState =
    !course.reviewStatus && !course.publicationStatus && fallback
      ? {
          ...course,
          reviewStatus: fallback.reviewStatus,
          publicationStatus: fallback.publicationStatus,
        }
      : course;

  if (!isLearnerVisibleCourse(workflowState)) {
    return null;
  }

  if (!accessAllowed(course)) {
    return null;
  }

  return {
    id: course.stableId,
    slug: course.slug,
    title: course.title,
    description: course.description,
    subject: course.subject,
    level: isCourseLevel(course.level) ? course.level : (fallback?.level ?? "Beginner"),
    duration: course.duration,
    progress: fallback?.progress ?? 0,
    lessonIds: fallback?.lessonIds ?? [],
    quizIds: fallback?.quizIds ?? [],
    accent: course.accent,
    accessLevel: course.accessLevel ?? fallback?.accessLevel,
    reviewStatus: workflowState.reviewStatus,
    publicationStatus: workflowState.publicationStatus,
  };
}

export function normalizeLearnerLesson(
  lesson: ConvexLessonRecord,
  options: {
    course: Course | null;
    lessons?: ConvexLessonRecord[];
    quizzes?: ConvexQuizRecord[];
    fallback?: Lesson;
  },
): Lesson | null {
  if (!options.course || !accessAllowed(lesson)) {
    return null;
  }

  const orderedLessons = [...(options.lessons ?? [])].sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
  const lessonIndex = orderedLessons.findIndex((item) => item.stableId === lesson.stableId);
  const nextLesson = lessonIndex >= 0 ? orderedLessons[lessonIndex + 1] : null;
  const relatedQuiz = options.quizzes?.find((quiz) => quiz.lessonStableId === lesson.stableId) ?? options.quizzes?.[0];

  return {
    id: lesson.stableId,
    courseId: lesson.courseStableId,
    title: lesson.title,
    duration: lesson.duration,
    videoUrl: lesson.videoUrl,
    posterUrl: lesson.posterUrl ?? options.fallback?.posterUrl,
    summary: lesson.summary,
    content: lesson.content.length > 0 ? lesson.content : (options.fallback?.content ?? []),
    blocks: options.fallback?.blocks,
    nextLessonId: nextLesson?.stableId ?? options.fallback?.nextLessonId,
    quizId: relatedQuiz?.stableId ?? options.fallback?.quizId,
    accessLevel: lesson.accessLevel ?? options.fallback?.accessLevel,
  };
}

export function normalizeLearnerQuiz(
  quiz: ConvexQuizRecord,
  options: {
    course: Course | null;
    fallback?: Quiz;
  },
): Quiz | null {
  if (!options.course || !accessAllowed(quiz)) {
    return null;
  }

  const questions = (Array.isArray(quiz.questions) ? [...quiz.questions] : [])
    .sort((left, right) => getQuestionOrder(left) - getQuestionOrder(right))
    .map(normalizeLearnerQuizQuestion)
    .filter((question): question is QuizQuestion => Boolean(question));

  if (questions.length === 0) {
    return null;
  }

  return {
    id: quiz.stableId,
    courseId: quiz.courseStableId,
    lessonId: quiz.lessonStableId,
    title: quiz.title,
    difficulty: isQuizDifficulty(quiz.difficulty) ? quiz.difficulty : (options.fallback?.difficulty ?? "Foundational"),
    estimatedTime: quiz.estimatedTime,
    questions,
    accessLevel: quiz.accessLevel ?? options.fallback?.accessLevel,
  };
}

function normalizeLearnerQuizQuestion(question: ConvexQuestionRecord): QuizQuestion | null {
  if (
    typeof question.stableId !== "string" ||
    typeof question.prompt !== "string" ||
    !Array.isArray(question.choices) ||
    !question.choices.every((choice) => typeof choice === "string")
  ) {
    return null;
  }

  // Zero choices is the published structured-question convention: the model
  // answer remains server-side and is exposed only when the learner taps
  // Reveal answer. One choice is invalid; two or more choices are normal MCQ.
  if (!question.prompt || question.choices.length === 1) {
    return null;
  }

  return {
    id: question.stableId,
    prompt: question.prompt,
    choices: question.choices,
    answerIndex: -1,
    explanation: "",
    diagramPath: typeof question.diagramPath === "string" ? question.diagramPath : undefined,
    diagramAlt: typeof question.diagramAlt === "string" ? question.diagramAlt : undefined,
  };
}

function getQuestionOrder(question: ConvexQuestionRecord) {
  return typeof question.order === "number" ? question.order : 0;
}

export async function getLearnerCourseDetail(id: string): Promise<LearnerCourseDetail | null> {
  const client = getConvexClient();

  if (!client) {
    return null;
  }

  const convexCourse =
    ((await client.query(convexApi.courses.getCourseByStableId, { stableId: id })) as ConvexCourseRecord | null) ??
    ((await client.query(convexApi.courses.getCourseBySlug, { slug: id })) as ConvexCourseRecord | null);

  if (!convexCourse) {
    return null;
  }

  const course = normalizeLearnerCourse(convexCourse);

  if (!course) {
    return null;
  }

  const [convexLessons, convexQuizzes] = await Promise.all([
    client.query(convexApi.lessons.getLessonsByCourse, { courseStableId: course.id }) as Promise<ConvexLessonRecord[]>,
    client.query(convexApi.quizzes.getQuizzesByCourse, { courseStableId: course.id }) as Promise<ConvexQuizRecord[]>,
  ]);

  const lessons = convexLessons
    .map((lesson) =>
      normalizeLearnerLesson(lesson, {
        course,
        lessons: convexLessons,
        quizzes: convexQuizzes,
      }),
    )
    .filter((lesson): lesson is Lesson => Boolean(lesson));
  const quizzes = convexQuizzes
    .map((quiz) => normalizeLearnerQuiz(quiz, { course }))
    .filter((quiz): quiz is Quiz => Boolean(quiz));

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

export async function getLearnerLessonDetail(lessonId: string) {
  const client = getConvexClient();

  if (!client) {
    return null;
  }

  const convexLesson = (await client.query(convexApi.lessons.getLessonById, { lessonId })) as ConvexLessonRecord | null;

  if (!convexLesson) {
    return null;
  }

  const courseDetail = await getLearnerCourseDetail(convexLesson.courseStableId);
  const lesson = courseDetail?.lessons.find((item) => item.id === lessonId) ?? null;

  return lesson && courseDetail ? { lesson, course: courseDetail.course, lessons: courseDetail.lessons } : null;
}

export async function getLearnerQuizDetail(quizId: string) {
  const client = getConvexClient();

  if (!client) {
    return null;
  }

  const convexQuiz = (await client.query(convexApi.quizzes.getQuizById, { quizId })) as ConvexQuizRecord | null;

  if (!convexQuiz) {
    return null;
  }

  const courseDetail = await getLearnerCourseDetail(convexQuiz.courseStableId);
  const quiz = normalizeLearnerQuiz(convexQuiz, {
    course: courseDetail?.course ?? null,
  });

  return quiz && courseDetail ? { quiz, course: courseDetail.course } : null;
}
