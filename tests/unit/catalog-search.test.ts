import { describe, expect, it } from "vitest";

import { searchLearnerCatalog } from "@/lib/catalog-search";
import { buildLearnerCatalog } from "@/lib/learner-catalog-client";
import { isLearnerAppPath } from "@/lib/learner-routes";

const catalog = buildLearnerCatalog({
  convexCourses: [
    {
      stableId: "critical-thinking",
      slug: "critical-thinking",
      title: "Critical Thinking",
      description: "Build deliberate reasoning and decision-making skills.",
      subject: "Critical thinking",
      level: "Beginner",
      duration: "2h",
      accent: "from-sky-500/20 via-white to-emerald-400/20",
      reviewStatus: "approved",
      publicationStatus: "published",
    },
  ],
  convexLessons: [
    {
      stableId: "memory-systems",
      courseStableId: "critical-thinking",
      title: "Memory Systems",
      duration: "12 min",
      summary: "Practice memory retrieval and durable recall.",
      content: ["Use retrieval practice to strengthen long-term memory."],
      order: 1,
    },
  ],
  convexQuizzes: [
    {
      stableId: "exam-accelerator-check",
      courseStableId: "critical-thinking",
      lessonStableId: "memory-systems",
      title: "Exam Accelerator Check",
      difficulty: "Applied",
      estimatedTime: "5 min",
      questions: [
        {
          stableId: "q1",
          prompt: "Which strategy strengthens retrieval?",
          choices: ["Passive rereading", "Practice recall"],
          order: 1,
        },
      ],
    },
  ],
});

describe("learner catalog search", () => {
  it("searches published courses, lessons, and quizzes across useful metadata", () => {
    expect(searchLearnerCatalog(catalog, "critical thinking").courses.map((course) => course.id)).toContain("critical-thinking");
    expect(searchLearnerCatalog(catalog, "memory retrieval").lessons.map((lesson) => lesson.id)).toContain("memory-systems");
    expect(searchLearnerCatalog(catalog, "exam accelerator").quizzes.map((quiz) => quiz.id)).toContain("exam-accelerator-check");
  });

  it("handles empty and unmatched searches without exposing unrelated results", () => {
    expect(searchLearnerCatalog(catalog, "")).toEqual({ courses: [], lessons: [], quizzes: [] });
    expect(searchLearnerCatalog(catalog, "not-a-real-topic")).toEqual({ courses: [], lessons: [], quizzes: [] });
  });

  it("keeps search behind the learner app route guard", () => {
    expect(isLearnerAppPath("/search")).toBe(true);
  });
});
