import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/staffRbac";

const accessLevelValidator = v.union(v.literal("free"), v.literal("paid"));
const stimulusSourceStatusValidator = v.union(v.literal("source-text"), v.literal("reconstructed-visual"));

const paperInputArgs = {
  courseStableId: v.string(),
  title: v.string(),
  year: v.number(),
  paperCode: v.string(),
  session: v.optional(v.string()),
  description: v.optional(v.string()),
  estimatedTime: v.optional(v.string()),
  totalMarks: v.optional(v.number()),
  pageCount: v.optional(v.number()),
  accessLevel: accessLevelValidator,
  published: v.boolean(),
  order: v.number(),
};

const questionInputArgs = {
  questionNumber: v.string(),
  sectionLabel: v.optional(v.string()),
  prompt: v.string(),
  marks: v.optional(v.number()),
  stimulusTitle: v.optional(v.string()),
  stimulusText: v.optional(v.string()),
  stimulusAssetPath: v.optional(v.string()),
  stimulusAssetAlt: v.optional(v.string()),
  stimulusSourceStatus: v.optional(stimulusSourceStatusValidator),
  modelAnswer: v.string(),
  explanation: v.optional(v.string()),
  order: v.number(),
};

function cleanRequiredString(value: string, label: string) {
  const cleaned = value.trim();
  if (!cleaned) throw new Error(`${label} is required.`);
  return cleaned;
}

function cleanOptionalString(value: string | undefined) {
  const cleaned = value?.trim();
  return cleaned ? cleaned : undefined;
}

function assertStableId(value: string, label: string) {
  const stableId = cleanRequiredString(value, label).toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(stableId)) {
    throw new Error(`${label} must use lowercase letters, numbers, and single hyphens only.`);
  }
  return stableId;
}

function assertNonNegativeInteger(value: number | undefined, label: string) {
  if (value === undefined) return;
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative whole number.`);
  }
}

function normalizePaperInput(args: typeof paperInputArgs extends never ? never : any) {
  const year = args.year as number;
  const order = args.order as number;
  assertNonNegativeInteger(year, "Year");
  assertNonNegativeInteger(order, "Order");
  assertNonNegativeInteger(args.totalMarks, "Total marks");
  assertNonNegativeInteger(args.pageCount, "Page count");

  if (year < 1900 || year > 2200) {
    throw new Error("Year must be between 1900 and 2200.");
  }

  return {
    courseStableId: assertStableId(args.courseStableId, "Course stable ID"),
    title: cleanRequiredString(args.title, "Title"),
    year,
    paperCode: cleanRequiredString(args.paperCode, "Paper code"),
    session: cleanOptionalString(args.session),
    description: cleanOptionalString(args.description),
    estimatedTime: cleanOptionalString(args.estimatedTime),
    totalMarks: args.totalMarks,
    pageCount: args.pageCount,
    accessLevel: args.accessLevel as "free" | "paid",
    published: Boolean(args.published),
    order,
  };
}

function normalizeQuestionInput(args: typeof questionInputArgs extends never ? never : any) {
  assertNonNegativeInteger(args.marks, "Marks");
  assertNonNegativeInteger(args.order, "Order");

  const stimulusAssetPath = cleanOptionalString(args.stimulusAssetPath);
  if (stimulusAssetPath && !stimulusAssetPath.startsWith("/")) {
    throw new Error("Stimulus asset path must be an app-relative path beginning with '/'.");
  }

  return {
    questionNumber: cleanRequiredString(args.questionNumber, "Question number"),
    sectionLabel: cleanOptionalString(args.sectionLabel),
    prompt: cleanRequiredString(args.prompt, "Prompt"),
    marks: args.marks,
    stimulusTitle: cleanOptionalString(args.stimulusTitle),
    stimulusText: cleanOptionalString(args.stimulusText),
    stimulusAssetPath,
    stimulusAssetAlt: cleanOptionalString(args.stimulusAssetAlt),
    stimulusSourceStatus: args.stimulusSourceStatus as "source-text" | "reconstructed-visual" | undefined,
    modelAnswer: cleanRequiredString(args.modelAnswer, "Model answer"),
    explanation: cleanOptionalString(args.explanation),
    order: args.order as number,
  };
}

async function getPaperOrThrow(ctx: any, stableId: string) {
  const paper = await ctx.db
    .query("pastPapers")
    .withIndex("by_stable_id", (q: any) => q.eq("stableId", stableId))
    .first();
  if (!paper) throw new Error("Past Paper not found.");
  return paper;
}

async function getQuestionOrThrow(ctx: any, stableId: string) {
  const question = await ctx.db
    .query("pastPaperQuestions")
    .withIndex("by_stable_id", (q: any) => q.eq("stableId", stableId))
    .first();
  if (!question) throw new Error("Past Paper question not found.");
  return question;
}

async function assertCourseExists(ctx: any, courseStableId: string) {
  const course = await ctx.db
    .query("courses")
    .withIndex("by_stable_id", (q: any) => q.eq("stableId", courseStableId))
    .first();
  if (!course) throw new Error("Course not found.");
  return course;
}

async function assertUniqueStableId(ctx: any, table: "pastPapers" | "pastPaperQuestions", stableId: string) {
  const existing = await ctx.db
    .query(table)
    .withIndex("by_stable_id", (q: any) => q.eq("stableId", stableId))
    .first();
  if (existing) throw new Error(`${table === "pastPapers" ? "Past Paper" : "Question"} stable ID already exists.`);
}

function paperSnapshot(paper: any) {
  return {
    stableId: paper.stableId,
    courseStableId: paper.courseStableId,
    title: paper.title,
    year: paper.year,
    paperCode: paper.paperCode,
    session: paper.session,
    description: paper.description,
    estimatedTime: paper.estimatedTime,
    totalMarks: paper.totalMarks,
    pageCount: paper.pageCount,
    accessLevel: paper.accessLevel,
    seedManaged: paper.seedManaged,
    published: paper.published,
    order: paper.order,
  };
}

function questionSnapshot(question: any) {
  return {
    stableId: question.stableId,
    paperStableId: question.paperStableId,
    questionNumber: question.questionNumber,
    sectionLabel: question.sectionLabel,
    prompt: question.prompt,
    marks: question.marks,
    stimulusTitle: question.stimulusTitle,
    stimulusText: question.stimulusText,
    stimulusAssetPath: question.stimulusAssetPath,
    stimulusAssetAlt: question.stimulusAssetAlt,
    stimulusSourceStatus: question.stimulusSourceStatus,
    modelAnswer: question.modelAnswer,
    explanation: question.explanation,
    order: question.order,
    seedManaged: question.seedManaged,
  };
}

async function writeAuditLog(
  ctx: any,
  actor: ReturnType<typeof requireAdmin>,
  input: { eventType: string; targetType: string; targetId: string; before?: unknown; after?: unknown },
) {
  await ctx.db.insert("auditLogs", {
    eventType: input.eventType,
    actorUserId: actor.actorUserId,
    actorRole: actor.role,
    targetType: input.targetType,
    targetId: input.targetId,
    createdAt: Date.now(),
    before: input.before,
    after: input.after,
  });
}

export const listAdminPastPaperCourses = queryGeneric({
  args: {},
  handler: async (ctx) => {
    requireAdmin(await ctx.auth.getUserIdentity());
    const courses = await ctx.db.query("courses").collect();
    return courses
      .map((course: any) => ({ stableId: course.stableId, title: course.title, subject: course.subject }))
      .sort((left: any, right: any) => left.title.localeCompare(right.title));
  },
});

export const listAdminPastPapers = queryGeneric({
  args: {},
  handler: async (ctx) => {
    requireAdmin(await ctx.auth.getUserIdentity());
    const [papers, courses] = await Promise.all([ctx.db.query("pastPapers").collect(), ctx.db.query("courses").collect()]);
    const courseTitles = new Map(courses.map((course: any) => [course.stableId, course.title]));

    const summaries = await Promise.all(
      papers.map(async (paper: any) => {
        const questions = await ctx.db
          .query("pastPaperQuestions")
          .withIndex("by_paper_stable_id", (q: any) => q.eq("paperStableId", paper.stableId))
          .collect();
        return {
          ...paper,
          courseTitle: courseTitles.get(paper.courseStableId) ?? paper.courseStableId,
          questionCount: questions.length,
        };
      }),
    );

    return summaries.sort((left: any, right: any) => {
      if (left.courseTitle !== right.courseTitle) return left.courseTitle.localeCompare(right.courseTitle);
      if (left.year !== right.year) return right.year - left.year;
      return left.order - right.order;
    });
  },
});

export const getAdminPastPaper = queryGeneric({
  args: { stableId: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(await ctx.auth.getUserIdentity());
    const paper = await ctx.db
      .query("pastPapers")
      .withIndex("by_stable_id", (q: any) => q.eq("stableId", args.stableId))
      .first();
    if (!paper) return null;

    const questions = await ctx.db
      .query("pastPaperQuestions")
      .withIndex("by_paper_stable_id", (q: any) => q.eq("paperStableId", paper.stableId))
      .collect();
    const auditLogs = await ctx.db
      .query("auditLogs")
      .withIndex("by_target", (q: any) => q.eq("targetType", "past-paper").eq("targetId", paper.stableId))
      .collect();

    return {
      paper,
      questions: questions.sort((left: any, right: any) => left.order - right.order),
      auditLogs: auditLogs.sort((left: any, right: any) => right.createdAt - left.createdAt),
    };
  },
});

export const createPastPaper = mutationGeneric({
  args: { stableId: v.string(), ...paperInputArgs },
  handler: async (ctx, args) => {
    const actor = requireAdmin(await ctx.auth.getUserIdentity());
    const stableId = assertStableId(args.stableId, "Past Paper stable ID");
    await assertUniqueStableId(ctx, "pastPapers", stableId);
    const input = normalizePaperInput(args);
    await assertCourseExists(ctx, input.courseStableId);
    const now = Date.now();
    const doc = { stableId, ...input, seedManaged: false, updatedAt: now };
    await ctx.db.insert("pastPapers", doc);
    await writeAuditLog(ctx, actor, {
      eventType: "past_paper.created",
      targetType: "past-paper",
      targetId: stableId,
      after: doc,
    });
    return { stableId };
  },
});

export const updatePastPaper = mutationGeneric({
  args: { stableId: v.string(), ...paperInputArgs },
  handler: async (ctx, args) => {
    const actor = requireAdmin(await ctx.auth.getUserIdentity());
    const stableId = assertStableId(args.stableId, "Past Paper stable ID");
    const paper = await getPaperOrThrow(ctx, stableId);
    const input = normalizePaperInput(args);
    await assertCourseExists(ctx, input.courseStableId);
    const after = { ...paperSnapshot(paper), ...input, seedManaged: false };
    await ctx.db.patch(paper._id, { ...input, seedManaged: false, updatedAt: Date.now() });
    await writeAuditLog(ctx, actor, {
      eventType: "past_paper.updated",
      targetType: "past-paper",
      targetId: stableId,
      before: paperSnapshot(paper),
      after,
    });
    return { stableId };
  },
});

export const deletePastPaper = mutationGeneric({
  args: { stableId: v.string() },
  handler: async (ctx, args) => {
    const actor = requireAdmin(await ctx.auth.getUserIdentity());
    const stableId = assertStableId(args.stableId, "Past Paper stable ID");
    const paper = await getPaperOrThrow(ctx, stableId);
    const questions = await ctx.db
      .query("pastPaperQuestions")
      .withIndex("by_paper_stable_id", (q: any) => q.eq("paperStableId", stableId))
      .collect();

    for (const question of questions) await ctx.db.delete(question._id);
    await ctx.db.delete(paper._id);
    await writeAuditLog(ctx, actor, {
      eventType: "past_paper.deleted",
      targetType: "past-paper",
      targetId: stableId,
      before: { ...paperSnapshot(paper), questionCount: questions.length },
    });
    return { stableId, deletedQuestionCount: questions.length };
  },
});

export const createPastPaperQuestion = mutationGeneric({
  args: { stableId: v.string(), paperStableId: v.string(), ...questionInputArgs },
  handler: async (ctx, args) => {
    const actor = requireAdmin(await ctx.auth.getUserIdentity());
    const stableId = assertStableId(args.stableId, "Question stable ID");
    const paperStableId = assertStableId(args.paperStableId, "Past Paper stable ID");
    await getPaperOrThrow(ctx, paperStableId);
    await assertUniqueStableId(ctx, "pastPaperQuestions", stableId);
    const input = normalizeQuestionInput(args);
    const doc = { stableId, paperStableId, ...input, seedManaged: false, updatedAt: Date.now() };
    await ctx.db.insert("pastPaperQuestions", doc);
    await writeAuditLog(ctx, actor, {
      eventType: "past_paper_question.created",
      targetType: "past-paper",
      targetId: paperStableId,
      after: doc,
    });
    return { stableId, paperStableId };
  },
});

export const updatePastPaperQuestion = mutationGeneric({
  args: { stableId: v.string(), paperStableId: v.string(), ...questionInputArgs },
  handler: async (ctx, args) => {
    const actor = requireAdmin(await ctx.auth.getUserIdentity());
    const stableId = assertStableId(args.stableId, "Question stable ID");
    const paperStableId = assertStableId(args.paperStableId, "Past Paper stable ID");
    await getPaperOrThrow(ctx, paperStableId);
    const question = await getQuestionOrThrow(ctx, stableId);
    if (question.paperStableId !== paperStableId) {
      throw new Error("Question does not belong to this Past Paper.");
    }
    const input = normalizeQuestionInput(args);
    const after = { ...questionSnapshot(question), ...input, seedManaged: false };
    await ctx.db.patch(question._id, { ...input, seedManaged: false, updatedAt: Date.now() });
    await writeAuditLog(ctx, actor, {
      eventType: "past_paper_question.updated",
      targetType: "past-paper",
      targetId: paperStableId,
      before: questionSnapshot(question),
      after,
    });
    return { stableId, paperStableId };
  },
});

export const deletePastPaperQuestion = mutationGeneric({
  args: { stableId: v.string(), paperStableId: v.string() },
  handler: async (ctx, args) => {
    const actor = requireAdmin(await ctx.auth.getUserIdentity());
    const stableId = assertStableId(args.stableId, "Question stable ID");
    const paperStableId = assertStableId(args.paperStableId, "Past Paper stable ID");
    const question = await getQuestionOrThrow(ctx, stableId);
    if (question.paperStableId !== paperStableId) {
      throw new Error("Question does not belong to this Past Paper.");
    }
    await ctx.db.delete(question._id);
    await writeAuditLog(ctx, actor, {
      eventType: "past_paper_question.deleted",
      targetType: "past-paper",
      targetId: paperStableId,
      before: questionSnapshot(question),
    });
    return { stableId, paperStableId };
  },
});
