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

  it("makes past-paper-only courses selectable and exposes learner-visible paper counts", () => {
    const backend = source("convex/pastPapers.ts");
    const mobileCourses = source("src/components/education/mobile-quizzes-section.tsx");

    expect(backend).toContain("export const listPastPaperCourseSummaries");
    expect(backend).toContain("paperCount");
    expect(mobileCourses).toContain("convexApi.pastPapers.listPastPaperCourseSummaries");
    expect(mobileCourses).toContain("getCoursePaperCount");
    expect(mobileCourses).toContain("/mobile-past-papers?course=");
    expect(mobileCourses).toContain("Past Papers");
  });

  it("reveals answers on demand, persists paper position, and never navigates back to the web course surface", () => {
    const runner = source("src/components/education/mobile-past-papers.tsx");

    expect(runner).toContain("convexApi.pastPapers.getPastPaperAnswer");
    expect(runner).toContain(': "skip"');
    expect(runner).toContain("readMobilePastPaperProgress");
    expect(runner).toContain("writeMobilePastPaperProgress");
    expect(runner).toContain("/mobile-past-papers?course=");
    expect(runner).not.toContain("/courses/");
  });

  it("supports the full previous-next-finish lifecycle and saves completion for Progress and Profile", () => {
    const runner = source("src/components/education/mobile-past-papers.tsx");
    const progress = source("src/components/education/mobile-progress-content.tsx");
    const profile = source("src/components/education/mobile-profile-study-summary.tsx");

    expect(runner).toContain("Previous");
    expect(runner).toContain("Next");
    expect(runner).toContain("Finish");
    expect(runner).toContain("Paper complete");
    expect(runner).toContain("finished,");
    expect(progress).toContain("readMobilePastPaperProgresses");
    expect(progress).toContain("Past paper practice");
    expect(profile).toContain("completedPastPaperCount");
    expect(profile).toContain("inProgressPastPaperCount");
  });

  it("keeps completed papers out of Home resume while unfinished papers remain resumable", () => {
    const home = source("src/components/education/mobile-study-home.tsx");

    expect(home).toContain("progress && !progress.finished ? lastActivity : null");
    expect(home).toContain("!progress.finished && selectedCourseIds.includes(progress.courseId)");
    expect(home).toContain("Resume study");
  });

  it("does not hardcode a Convex deployment into shared education configuration", () => {
    const educationData = source("src/lib/education-data.ts");

    expect(educationData).not.toContain("wary-meerkat-937");
    expect(educationData).toContain("process.env.NEXT_PUBLIC_CONVEX_URL");
  });
});
