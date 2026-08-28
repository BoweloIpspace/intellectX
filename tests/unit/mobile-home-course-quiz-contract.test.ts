import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(file: string) {
  return readFileSync(path.resolve(process.cwd(), file), "utf8");
}

describe("mobile Home, course, infographic, and quiz contracts", () => {
  it("describes selected courses by actual quizzes and past papers and exposes Resume Study", () => {
    const home = source("src/components/education/mobile-study-home.tsx");

    expect(home).toContain("listPastPaperCourseSummaries");
    expect(home).toContain("paperCount");
    expect(home).toContain("quizCount");
    expect(home).toContain("Resume study");
    expect(home).toContain("readMobileStudyActivity");
    expect(home).toContain("/mobile-study/${encodeURIComponent(course.id)}");
    expect(home).not.toContain("href={`/mobile-quizzes?course=${encodeURIComponent(course.id)}`}");
  });

  it("forces the native course flow through exact topic infographics before topic quizzes", () => {
    const courseTopics = source("src/components/education/mobile-course-topics.tsx");
    const infographies = source("src/components/education/mobile-infographies.tsx");
    const quizzes = source("src/components/education/mobile-quizzes-section.tsx");

    expect(courseTopics).toContain("Choose a topic to study its infographic before starting the topic quiz.");
    expect(courseTopics).toContain(
      "/mobile-infographies?course=${encodeURIComponent(courseId)}&topic=${encodeURIComponent(topic.id)}",
    );
    expect(infographies).toContain('return "Start topic quiz"');
    expect(infographies).toContain(
      "/quiz/${card.quizIds[0]}?from=mobile&course=${encodeURIComponent(card.courseId)}&topic=${encodeURIComponent(card.id)}",
    );
    expect(infographies).toContain(
      "/mobile-quizzes?course=${encodeURIComponent(card.courseId)}&topic=${encodeURIComponent(card.id)}",
    );
    expect(quizzes).toContain("<CourseRouteRedirect courseId={selectedCourse.id} />");
    expect(quizzes).toContain("/mobile-study/${encodeURIComponent(courseId)}");
  });

  it("preserves course and topic origin and returns a native quiz to its exact infographic", () => {
    const courses = source("src/components/education/mobile-quizzes-section.tsx");
    const quizPage = source("src/app/quiz/[quizId]/page.tsx");
    const quizContent = source("src/components/education/quiz-page-content.tsx");

    expect(courses).toContain("&course=${encodeURIComponent(mobileContext.courseId)}&topic=${encodeURIComponent(mobileContext.topicId)}");
    expect(quizPage).toContain('label: "Back to infographic"');
    expect(quizPage).toContain(
      "/mobile-infographies?course=${encodeURIComponent(courseId)}&topic=${encodeURIComponent(requestedTopicId)}",
    );
    expect(quizContent).toContain("mobileReturnHref");
    expect(quizContent).toContain("/mobile-study/${encodeURIComponent(courseId)}");
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
