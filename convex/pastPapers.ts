import { queryGeneric } from "convex/server";
import { v } from "convex/values";
import { isLearnerVisibleCourseRecord, learnerCourseVisibilityOptions } from "./lib/courseWorkflow";

function hasFreeLearnerAccess(record: { accessLevel?: string }) {
  return record.accessLevel !== "paid";
}

async function getVisibleCourse(ctx: any, courseStableId: string) {
  const course = await ctx.db
    .query("courses")
    .withIndex("by_stable_id", (q: any) => q.eq("stableId", courseStableId))
    .first();

  if (!course || !isLearnerVisibleCourseRecord(course, learnerCourseVisibilityOptions) || !hasFreeLearnerAccess(course)) {
    return null;
  }

  return course;
}

async function getVisiblePaper(ctx: any, paperId: string) {
  const paper = await ctx.db
    .query("pastPapers")
    .withIndex("by_stable_id", (q: any) => q.eq("stableId", paperId))
    .first();

  if (!paper || !paper.published || !hasFreeLearnerAccess(paper)) {
    return null;
  }

  const course = await getVisibleCourse(ctx, paper.courseStableId);
  return course ? paper : null;
}

export const listPastPaperCourseIds = queryGeneric({
  args: {},
  handler: async (ctx) => {
    const papers = await ctx.db.query("pastPapers").collect();
    const candidateCourseIds = Array.from(
      new Set(
        papers
          .filter((paper: any) => paper.published && hasFreeLearnerAccess(paper))
          .map((paper: any) => paper.courseStableId),
      ),
    );

    const visibleCourseIds: string[] = [];
    for (const courseStableId of candidateCourseIds) {
      if (await getVisibleCourse(ctx, courseStableId)) {
        visibleCourseIds.push(courseStableId);
      }
    }

    return visibleCourseIds;
  },
});

export const getPastPapersByCourse = queryGeneric({
  args: { courseStableId: v.string() },
  handler: async (ctx, args) => {
    const course = await getVisibleCourse(ctx, args.courseStableId);
    if (!course) return [];

    const papers = await ctx.db
      .query("pastPapers")
      .withIndex("by_course_stable_id", (q: any) => q.eq("courseStableId", args.courseStableId))
      .collect();

    return papers
      .filter((paper: any) => paper.published && hasFreeLearnerAccess(paper))
      .sort((left: any, right: any) => left.order - right.order)
      .map((paper: any) => ({
        stableId: paper.stableId,
        courseStableId: paper.courseStableId,
        title: paper.title,
        year: paper.year,
        paperCode: paper.paperCode,
        session: paper.session,
        description: paper.description,
        estimatedTime: paper.estimatedTime,
        order: paper.order,
      }));
  },
});

export const getPastPaperById = queryGeneric({
  args: { paperId: v.string() },
  handler: async (ctx, args) => {
    const paper = await getVisiblePaper(ctx, args.paperId);
    if (!paper) return null;

    const questions = await ctx.db
      .query("pastPaperQuestions")
      .withIndex("by_paper_stable_id", (q: any) => q.eq("paperStableId", paper.stableId))
      .collect();

    return {
      stableId: paper.stableId,
      courseStableId: paper.courseStableId,
      title: paper.title,
      year: paper.year,
      paperCode: paper.paperCode,
      session: paper.session,
      description: paper.description,
      estimatedTime: paper.estimatedTime,
      order: paper.order,
      questions: questions
        .sort((left: any, right: any) => left.order - right.order)
        .map((question: any) => ({
          stableId: question.stableId,
          questionNumber: question.questionNumber,
          prompt: question.prompt,
          marks: question.marks,
          order: question.order,
        })),
    };
  },
});

export const getPastPaperAnswer = queryGeneric({
  args: { paperId: v.string(), questionId: v.string() },
  handler: async (ctx, args) => {
    const paper = await getVisiblePaper(ctx, args.paperId);
    if (!paper) return null;

    const question = await ctx.db
      .query("pastPaperQuestions")
      .withIndex("by_stable_id", (q: any) => q.eq("stableId", args.questionId))
      .first();

    if (!question || question.paperStableId !== paper.stableId) {
      return null;
    }

    return {
      modelAnswer: question.modelAnswer,
      explanation: question.explanation,
    };
  },
});
