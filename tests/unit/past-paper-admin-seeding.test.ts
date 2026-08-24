import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(file: string) {
  return readFileSync(path.resolve(process.cwd(), file), "utf8");
}

describe("Past Paper admin and release seeding", () => {
  it("tracks seed-managed provenance separately from manual admin records", () => {
    const schema = source("convex/schema.ts");
    const admin = source("convex/adminPastPapers.ts");

    expect(schema.match(/seedManaged: v\.optional\(v\.boolean\(\)\)/g)?.length ?? 0).toBeGreaterThanOrEqual(6);
    expect(admin).toContain("seedManaged: false");
    expect(admin).toContain("createPastPaper");
    expect(admin).toContain("updatePastPaper");
    expect(admin).toContain("createPastPaperQuestion");
    expect(admin).toContain("updatePastPaperQuestion");
  });

  it("requires trusted admin identity for every management query and mutation", () => {
    const admin = source("convex/adminPastPapers.ts");
    const exportedFunctions = [
      "listAdminPastPaperCourses",
      "listAdminPastPapers",
      "getAdminPastPaper",
      "createPastPaper",
      "updatePastPaper",
      "deletePastPaper",
      "createPastPaperQuestion",
      "updatePastPaperQuestion",
      "deletePastPaperQuestion",
    ];

    for (const name of exportedFunctions) {
      const start = admin.indexOf(`export const ${name}`);
      expect(start).toBeGreaterThan(-1);
      const nextExport = admin.indexOf("export const ", start + 12);
      const section = admin.slice(start, nextExport === -1 ? undefined : nextExport);
      expect(section).toContain("requireAdmin(await ctx.auth.getUserIdentity())");
    }
  });

  it("cascade-deletes questions with a paper and records append-only audit events", () => {
    const admin = source("convex/adminPastPapers.ts");
    const deleteSection = admin.slice(admin.indexOf("export const deletePastPaper"), admin.indexOf("export const createPastPaperQuestion"));

    expect(deleteSection).toContain('query("pastPaperQuestions")');
    expect(deleteSection).toContain("for (const question of questions) await ctx.db.delete(question._id)");
    expect(deleteSection).toContain("await ctx.db.delete(paper._id)");
    expect(admin).toContain('eventType: "past_paper.created"');
    expect(admin).toContain('eventType: "past_paper.updated"');
    expect(admin).toContain('eventType: "past_paper.deleted"');
    expect(admin).toContain('eventType: "past_paper_question.created"');
    expect(admin).toContain('eventType: "past_paper_question.updated"');
    expect(admin).toContain('eventType: "past_paper_question.deleted"');
  });

  it("provides a deterministic release seed with explicit reset cleanup", () => {
    const releaseSeed = source("convex/seedBiologyPastPaperRelease.ts");
    const reconcile = source("convex/seedBiologyPastPaperReconcile.ts");

    expect(releaseSeed).toContain('makeFunctionReference<"mutation">("seedBiologyPastPaper:seed")');
    expect(releaseSeed).toContain('makeFunctionReference<"mutation">("seedBiologyPastPaperReconcile:reconcile")');
    expect(releaseSeed).toContain("reset: v.optional(v.boolean())");
    expect(reconcile).toContain("BIOLOGY_2019_QUESTION_STABLE_IDS");
    expect(reconcile).toContain("seedManaged: true");
    expect(reconcile).toContain("if (args.reset === true)");
    expect(reconcile).toContain("duplicateRowsRemoved");
    expect(reconcile).toContain("staleRowsRemoved");
    expect(reconcile).toContain('question.stableId.startsWith("bgcse-bio-2019-p3-")');
  });

  it("keeps learner paper payloads answer-free until Reveal answer", () => {
    const learner = source("convex/pastPapers.ts");
    const detailSection = learner.slice(learner.indexOf("export const getPastPaperById"), learner.indexOf("export const getPastPaperAnswer"));

    expect(detailSection).not.toContain("modelAnswer");
    expect(detailSection).not.toContain("explanation: question.explanation");
    expect(learner).toContain("export const getPastPaperAnswer");
  });

  it("wires an admin-only Past Papers workspace to real Convex mutations", () => {
    const page = source("src/app/admin/past-papers/page.tsx");
    const workspace = source("src/components/admin/admin-past-papers-workspace.tsx");
    const api = source("src/lib/convex-api.ts");
    const nav = source("src/components/admin/admin-workspace-nav.tsx");

    expect(page).toContain('StaffRouteGuard pathname="/admin/past-papers"');
    expect(workspace).toContain("convexApi.adminPastPapers.createPastPaper");
    expect(workspace).toContain("convexApi.adminPastPapers.updatePastPaper");
    expect(workspace).toContain("convexApi.adminPastPapers.deletePastPaper");
    expect(workspace).toContain("convexApi.adminPastPapers.createPastPaperQuestion");
    expect(workspace).toContain("convexApi.adminPastPapers.updatePastPaperQuestion");
    expect(workspace).toContain("convexApi.adminPastPapers.deletePastPaperQuestion");
    expect(api).toContain("adminPastPapers:");
    expect(nav).toContain('href="/admin/past-papers"');
  });
});
