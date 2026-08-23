import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(file: string) {
  return readFileSync(path.resolve(process.cwd(), file), "utf8");
}

describe("native past paper flow", () => {
  it("keeps model answers out of the initial paper payload", () => {
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

  it("reveals answers on demand and never navigates back to the web course surface", () => {
    const runner = source("src/components/education/mobile-past-papers.tsx");

    expect(runner).toContain("convexApi.pastPapers.getPastPaperAnswer");
    expect(runner).toContain(': "skip"');
    expect(runner).toContain("/mobile-past-papers?course=");
    expect(runner).not.toContain("/courses/");
  });

  it("does not hardcode a Convex deployment into shared education configuration", () => {
    const educationData = source("src/lib/education-data.ts");

    expect(educationData).not.toContain("wary-meerkat-937");
    expect(educationData).toContain("process.env.NEXT_PUBLIC_CONVEX_URL");
  });
});
