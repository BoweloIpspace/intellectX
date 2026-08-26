import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("GIC programming pass 2", () => {
  it("keeps the sitemap limited to stable public routes", () => {
    const sitemap = source("src/app/sitemap.ts");

    expect(sitemap).not.toContain('@/data/courses');
    expect(sitemap).not.toContain('@/data/lessons');
    expect(sitemap).not.toContain('@/data/quizzes');
    expect(sitemap).toContain('"/privacy-policy"');
    expect(sitemap).toContain('"/terms-and-conditions"');
    expect(sitemap).toContain('"/refund-policy"');
    expect(sitemap).not.toContain('"/dashboard"');
    expect(sitemap).not.toContain('"/progress"');
    expect(sitemap).not.toContain('`/learn/${');
    expect(sitemap).not.toContain('`/quiz/${');
  });

  it("does not expose the unavailable AI lesson tutor", () => {
    const lessonPage = source("src/app/learn/[lessonId]/page.tsx");

    expect(lessonPage).not.toContain("AiLessonTutorPanel");
    expect(lessonPage).not.toContain("AI lesson tutor");
  });

  it("retires native Notes and Flashcards routes without touching web Flashcards", () => {
    const notesPage = source("src/app/mobile-notes/page.tsx");
    const nativeFlashcardsPage = source("src/app/mobile-flashcards/page.tsx");
    const webFlashcardsPage = source("src/app/flashcards/page.tsx");

    expect(notesPage).toContain('redirect("/mobile-study")');
    expect(nativeFlashcardsPage).toContain('redirect("/mobile-study")');
    expect(webFlashcardsPage).not.toContain('redirect("/mobile-study")');
  });

  it("adds focused Firefox and WebKit browser coverage", () => {
    const playwright = source("playwright.config.ts");
    const workflow = source(".github/workflows/build-test.yml");
    const smoke = source("tests/e2e/cross-browser-smoke.spec.ts");

    expect(playwright).toContain('name: "firefox"');
    expect(playwright).toContain('name: "webkit"');
    expect(playwright).toContain("cross-browser-smoke\\.spec\\.ts");
    expect(workflow).toContain("playwright install --with-deps chromium firefox webkit");
    expect(smoke).toContain("public landing renders core navigation");
    expect(smoke).toContain("learner login renders usable credentials fields");
    expect(smoke).toContain("privacy policy renders as a public support page");
  });
});
