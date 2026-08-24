import { internalMutationGeneric } from "convex/server";
import { v } from "convex/values";
import {
  BIOLOGY_2019_PAPER_STABLE_ID,
  BIOLOGY_2019_QUESTION_STABLE_IDS,
  BIOLOGY_COURSE_STABLE_ID,
  isBiology2019Paper3ResetCandidate,
} from "./lib/biologyPastPaperSeedPolicy";

export {
  BIOLOGY_2019_PAPER_STABLE_ID,
  BIOLOGY_2019_QUESTION_STABLE_IDS,
  BIOLOGY_COURSE_STABLE_ID,
} from "./lib/biologyPastPaperSeedPolicy";

const expectedQuestionIds = new Set<string>(BIOLOGY_2019_QUESTION_STABLE_IDS);

async function collectByStableId(ctx: any, table: "pastPapers" | "pastPaperQuestions", stableId: string) {
  return await ctx.db
    .query(table)
    .withIndex("by_stable_id", (q: any) => q.eq("stableId", stableId))
    .collect();
}

export const reconcile = internalMutationGeneric({
  args: { reset: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const result = {
      paper: {
        markedSeedManaged: 0,
        duplicateRowsRemoved: 0,
        staleRowsRemoved: 0,
        staleRowsProtectedByManualQuestions: 0,
      },
      questions: { markedSeedManaged: 0, duplicateRowsRemoved: 0, staleRowsRemoved: 0 },
    };

    const paperRows = await collectByStableId(ctx, "pastPapers", BIOLOGY_2019_PAPER_STABLE_ID);
    if (paperRows.length === 0) {
      throw new Error("Biology 2019 Paper 3 must be seeded before reconciliation.");
    }

    const canonicalPaper = paperRows[0];
    await ctx.db.patch(canonicalPaper._id, { seedManaged: true });
    result.paper.markedSeedManaged = 1;

    if (args.reset === true) {
      for (const duplicate of paperRows.slice(1)) {
        await ctx.db.delete(duplicate._id);
        result.paper.duplicateRowsRemoved += 1;
      }
    }

    for (const stableId of BIOLOGY_2019_QUESTION_STABLE_IDS) {
      const rows = await collectByStableId(ctx, "pastPaperQuestions", stableId);
      if (rows.length === 0) {
        throw new Error(`Expected seeded Past Paper question is missing: ${stableId}`);
      }

      await ctx.db.patch(rows[0]._id, {
        paperStableId: BIOLOGY_2019_PAPER_STABLE_ID,
        seedManaged: true,
      });
      result.questions.markedSeedManaged += 1;

      if (args.reset === true) {
        for (const duplicate of rows.slice(1)) {
          await ctx.db.delete(duplicate._id);
          result.questions.duplicateRowsRemoved += 1;
        }
      }
    }

    if (args.reset === true) {
      const allQuestionsForPaper = await ctx.db
        .query("pastPaperQuestions")
        .withIndex("by_paper_stable_id", (q: any) => q.eq("paperStableId", BIOLOGY_2019_PAPER_STABLE_ID))
        .collect();

      for (const question of allQuestionsForPaper) {
        const looksLikeLegacyBiologySeed = question.stableId.startsWith("bgcse-bio-2019-p3-");
        const isObsoleteSeedRow = question.seedManaged === true && !expectedQuestionIds.has(question.stableId);
        const isObsoleteLegacySeedRow =
          question.seedManaged !== false && looksLikeLegacyBiologySeed && !expectedQuestionIds.has(question.stableId);

        if (isObsoleteSeedRow || isObsoleteLegacySeedRow) {
          await ctx.db.delete(question._id);
          result.questions.staleRowsRemoved += 1;
        }
      }

      const allBiologyPapers = await ctx.db
        .query("pastPapers")
        .withIndex("by_course_stable_id", (q: any) => q.eq("courseStableId", BIOLOGY_COURSE_STABLE_ID))
        .collect();

      for (const paper of allBiologyPapers) {
        if (!isBiology2019Paper3ResetCandidate(paper)) continue;

        const childQuestions = await ctx.db
          .query("pastPaperQuestions")
          .withIndex("by_paper_stable_id", (q: any) => q.eq("paperStableId", paper.stableId))
          .collect();
        const hasManualQuestions = childQuestions.some((question: any) => question.seedManaged === false);

        if (hasManualQuestions) {
          result.paper.staleRowsProtectedByManualQuestions += 1;
          continue;
        }

        for (const question of childQuestions) {
          // Rows from before seed provenance existed have seedManaged undefined.
          // Once the parent is positively identified as a stale 2019 seed row,
          // every non-manual child must be removed with it to avoid orphans.
          if (question.seedManaged !== false) {
            await ctx.db.delete(question._id);
            result.questions.staleRowsRemoved += 1;
          }
        }
        await ctx.db.delete(paper._id);
        result.paper.staleRowsRemoved += 1;
      }
    }

    return result;
  },
});
