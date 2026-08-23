import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(file: string) {
  return readFileSync(path.resolve(process.cwd(), file), "utf8");
}

describe("native past paper flow", () => {
  it("keeps the final backend contract ready for answer-on-demand rollout", () => {
    const backend = source("convex/pastPapers.ts");
    const detailQuery = backend.slice(
      backend.indexOf("export const getPastPaperById"),
      backend.indexOf("export const getPastPaperAnswer"),
    );

    expect(detailQuery).not.toContain("modelAnswer");
    expect(detailQuery).not.toContain("explanation: question.explanation");
    expect(backend).toContain("export const getPastPaperAnswer");
  });

  it("makes past-paper-only courses selectable and reachable from the native course flow", () => {
    const mobileCourses = source("src/components/education/mobile-quizzes-section.tsx");

    expect(mobileCourses).toContain("convexApi.pastPapers.listPastPaperCourseIds");
    expect(mobileCourses).toContain("pastPaperCourseIds.includes(course.id)");
    expect(mobileCourses).toContain("/mobile-past-papers?course=");
    expect(mobileCourses).toContain("Past Papers");
  });

  it("device-test runner reveals the already-deployed answer payload and stays inside mobile routes", () => {
    const runner = source("src/components/education/mobile-past-papers.tsx");

    expect(runner).toContain("current.modelAnswer");
    expect(runner).toContain("Reveal answer");
    expect(runner).toContain("/mobile-past-papers?course=");
    expect(runner).not.toContain("/courses/");
  });

  it("device-test branch explicitly binds to the seeded development deployment", () => {
    const educationData = source("src/lib/education-data.ts");

    expect(educationData).toContain("Device-test branch only");
    expect(educationData).toContain("wary-meerkat-937");
    expect(educationData).toContain("process.env.NEXT_PUBLIC_CONVEX_URL");
  });
});
