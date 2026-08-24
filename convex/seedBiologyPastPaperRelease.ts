import { internalActionGeneric, makeFunctionReference } from "convex/server";
import { v } from "convex/values";

const seedBiologyPastPaper = makeFunctionReference<"mutation">("seedBiologyPastPaper:seed");
const reconcileBiologyPastPaper = makeFunctionReference<"mutation">("seedBiologyPastPaperReconcile:reconcile");

export const run = internalActionGeneric({
  args: { reset: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const seeded = await ctx.runMutation(seedBiologyPastPaper, {});
    const reconciled = await ctx.runMutation(reconcileBiologyPastPaper, { reset: args.reset });

    return {
      seeded,
      reconciled,
      reset: args.reset === true,
    };
  },
});
