import { internalMutationGeneric } from "convex/server";

const academicTargets = [
  {
    stableId: "bgcse-biology",
    educationLevel: "Senior",
    curriculumOrInstitution: "Botswana curriculum",
  },
  {
    stableId: "mat111-introductory-mathematics-i",
    educationLevel: "University / Varsity",
    curriculumOrInstitution: "UB",
    gradeOrYear: "Year 1",
  },
] as const;

export const reconcile = internalMutationGeneric({
  args: {},
  handler: async (ctx) => {
    let updated = 0;
    const missing: string[] = [];

    for (const target of academicTargets) {
      const course = await ctx.db
        .query("courses")
        .withIndex("by_stable_id", (q: any) => q.eq("stableId", target.stableId))
        .first();

      if (!course) {
        missing.push(target.stableId);
        continue;
      }

      await ctx.db.patch(course._id, {
        educationLevel: target.educationLevel,
        curriculumOrInstitution: target.curriculumOrInstitution,
        ...(target.gradeOrYear ? { gradeOrYear: target.gradeOrYear } : {}),
      });
      updated += 1;
    }

    return { updated, missing };
  },
});
