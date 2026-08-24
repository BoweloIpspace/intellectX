import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(file: string) {
  return readFileSync(path.resolve(process.cwd(), file), "utf8");
}

describe("mobile Home, course, and quiz contracts", () => {
  it("describes selected courses by actual quizzes and past papers and exposes Resume Study", () => {
    const home = source("src/components/education/mobile-study-home.tsx");

    expect(home).toContain("listPastPaperCourseSummaries");
    expect(home).toContain("paperCount");
    expect(home).toContain("quizCount");
    expect(home).toContain("Resume study");
    expect(home).toContain("readMobileStudyActivity");
    expect(home).not.toContain("Open a course, choose a topic, then pick a quiz for that topic.");
  });

  it("preserves course and topic origin when opening a native quiz", () => {
    const courses = source("src/components/education/mobile-quizzes-section.tsx");
    const quizPage = source("src/app/quiz/[quizId]/page.tsx");
    const quizContent = source("src/components/education/quiz-page-content.tsx");

    expect(courses).toContain("&course=${encodeURIComponent(mobileContext.courseId)}&topic=${encodeURIComponent(mobileContext.topicId)}");
    expect(quizPage).toContain('label: "Back to topic"');
    expect(quizContent).toContain("mobileReturnHref");
    expect(quizContent).not.toContain('mobileSurface ? "/mobile-quizzes"');
  });

  it("restores mobile quiz state against an absolute deadline and clears it on completion", () => {
    const player = source("src/components/education/secure-quiz-player.tsx");

    expect(player).toContain("readMobileQuizProgress");
    expect(player).toContain("writeMobileQuizProgress");
    expect(player).toContain("deadlineAtRef");
    expect(player).toContain("saved.deadlineAt - Date.now()");
    expect(player).toContain("clearMobileQuizProgress");
    expect(player).toContain('role="radiogroup"');
    expect(player).toContain('role="radio"');
  });
});
