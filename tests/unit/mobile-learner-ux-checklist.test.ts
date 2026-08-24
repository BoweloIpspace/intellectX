import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("mobile learner UX checklist", () => {
  it("uses WebView history for the Android system Back button", () => {
    const activity = source("android/app/src/main/java/com/intellectx/app/MainActivity.java");
    expect(activity).toContain("bridge.getWebView().canGoBack()");
    expect(activity).toContain("bridge.getWebView().goBack()");
  });

  it("keeps the requested native header and four bottom destinations", () => {
    const shell = source("src/components/education/mobile-app-shell.tsx");
    expect(shell).toContain("intellectX");
    expect(shell).toContain('label: "Home"');
    expect(shell).toContain('label: "Infographies"');
    expect(shell).toContain('label: "Quizzes"');
    expect(shell).toContain('label: "Exams"');
    expect(shell).toContain('aria-label="Notifications"');
    expect(shell).toContain('aria-label="Progress"');
    expect(shell).toContain('aria-label="Profile"');
  });

  it("wires the mobile quiz surface to mixed MCQ and structured-question behavior", () => {
    const page = source("src/components/education/quiz-page-content.tsx");
    const mixedPlayer = source("src/components/education/mixed-quiz-player.tsx");
    expect(page).toContain('import { MixedQuizPlayer }');
    expect(page).toContain("mobileSurface ? <MixedQuizPlayer quiz={quiz} />");
    expect(mixedPlayer).toContain('action: "check"');
    expect(mixedPlayer).toContain('action: "reveal"');
    expect(mixedPlayer).toContain("Time left:");
    expect(mixedPlayer).toContain("Reveal answer");
    expect(mixedPlayer).toContain("question.diagramPath");
  });

  it("removes the synthetic mobile quiz injection and keeps the course-topic-quiz route", () => {
    const catalog = source("src/lib/learner-catalog-client.ts");
    const quizzes = source("src/components/education/mobile-quizzes-section.tsx");
    expect(catalog).not.toContain("mobileTopicQuizzes");
    expect(quizzes).toContain("/mobile-quizzes?course=");
    expect(quizzes).toContain("&topic=");
    expect(quizzes).toContain("latestByQuizId");
  });

  it("starts native launches on authentication and uses a themed recovery surface", () => {
    const capacitor = source("capacitor.config.ts");
    const boundary = source("src/components/providers/native-mobile-surface-boundary.tsx");
    const errorPage = source("public/mobile-error.html");
    expect(capacitor).toContain("appStartPath: `/login?nativeShellVersion=");
    expect(boundary).toContain("hasNativeLaunchAuthorization");
    expect(errorPage).toContain("You're offline.");
    expect(errorPage).toContain("intellectX");
  });
});
