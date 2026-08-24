import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("mobile learner UX checklist", () => {
  it("routes Android Back through browser history before Activity exit", () => {
    const activity = source("android/app/src/main/java/com/intellectx/app/MainActivity.java");
    expect(activity).toContain("window.history.length > 1");
    expect(activity).toContain("window.history.back();");
    expect(activity).toContain("webView.canGoBack()");
    expect(activity).toContain("webView.goBack()");
    expect(activity).toContain("fallBackToSystemBack");
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
    expect(shell).toContain("grid-cols-4");
  });

  it("wires the mobile quiz surface to mixed MCQ and structured-question behavior", () => {
    const page = source("src/components/education/quiz-page-content.tsx");
    const mixedPlayer = source("src/components/education/mixed-quiz-player.tsx");
    const integrity = source("convex/lib/quizIntegrity.ts");
    expect(page).toContain('import { MixedQuizPlayer }');
    expect(page).toContain("mobileSurface ? <MixedQuizPlayer quiz={quiz} />");
    expect(mixedPlayer).toContain('action: "check"');
    expect(mixedPlayer).toContain('action: "reveal"');
    expect(mixedPlayer).toContain("Time left:");
    expect(mixedPlayer).toContain("Reveal answer");
    expect(mixedPlayer).toContain("question.diagramPath");
    expect(mixedPlayer).toContain("grayscale contrast-125 dark:invert");
    expect(integrity).toContain("gradableQuestions");
  });

  it("removes the synthetic mobile quiz injection and keeps course-topic-quiz marks", () => {
    const catalog = source("src/lib/learner-catalog-client.ts");
    const quizzes = source("src/components/education/mobile-quizzes-section.tsx");
    expect(catalog).not.toContain("mobileTopicQuizzes");
    expect(existsSync(resolve(process.cwd(), "src/data/mobile-topic-quizzes.ts"))).toBe(false);
    expect(quizzes).toContain("/mobile-quizzes?course=");
    expect(quizzes).toContain("&topic=");
    expect(quizzes).toContain("latestByQuizId");
    expect(quizzes).toContain("{attempt.score}/{attempt.totalQuestions} · {attempt.percentage}%");
  });

  it("provides snap-scrolling infographies and a separate structured exams area", () => {
    const infographies = source("src/components/education/mobile-infographies.tsx");
    const exams = source("src/components/education/mobile-exams-home.tsx");
    expect(infographies).toContain("catalog.lessons");
    expect(infographies).toContain("snap-y snap-mandatory");
    expect(infographies).toContain("snap-start snap-always");
    expect(infographies).not.toContain("setInterval");
    expect(exams).toContain("Long-form exam practice");
    expect(exams).toContain("published structured papers");
  });

  it("starts native launches on authentication and uses a themed recovery surface", () => {
    const capacitor = source("capacitor.config.ts");
    const boundary = source("src/components/providers/native-mobile-surface-boundary.tsx");
    const learnerForm = source("src/components/auth/learner-session-form.tsx");
    const errorPage = source("public/mobile-error.html");
    expect(capacitor).toContain("appStartPath: `/login?nativeShellVersion=");
    expect(boundary).toContain("hasNativeLaunchAuthorization");
    expect(boundary).toContain("router.replace(MOBILE_LOGIN_ROUTE)");
    expect(learnerForm).toContain("authorizeNativeLaunch()");
    expect(errorPage).toContain("You're offline.");
    expect(errorPage).toContain("intellectX");
  });
});
