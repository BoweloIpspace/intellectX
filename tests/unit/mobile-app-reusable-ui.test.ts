import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(file: string) {
  return readFileSync(path.resolve(process.cwd(), file), "utf8");
}

describe("mobile app reusable UI contract", () => {
  it("centralizes responsive learner layout primitives", () => {
    const primitives = source("src/components/ui/mobile-app-primitives.tsx");

    expect(primitives).toContain("MobilePageStack");
    expect(primitives).toContain("MobilePageHeader");
    expect(primitives).toContain("MobileSurface");
    expect(primitives).toContain("MobileListRow");
    expect(primitives).toContain("MobileEmptyState");
    expect(primitives).toContain("MobileMetricCard");
    expect(primitives).toContain("min-w-0");
    expect(primitives).toContain("touch-manipulation");
  });

  it("uses the shared primitives across the main learner destinations", () => {
    const files = [
      "src/components/education/mobile-study-home.tsx",
      "src/components/education/mobile-course-topics.tsx",
      "src/components/education/mobile-quizzes-section.tsx",
      "src/components/education/mobile-exams-home.tsx",
      "src/components/education/mobile-progress-content.tsx",
    ];

    for (const file of files) {
      const component = source(file);
      expect(component).toContain("MobilePage");
    }

    expect(source("src/components/education/course-selection-card.tsx")).toContain("MobileSurface");
    expect(source("src/components/education/mobile-profile-study-summary.tsx")).toContain("MobileMetricCard");
  });

  it("renders one complete feature slide on phone widths", () => {
    const carousel = source("src/components/features/features-carousel.tsx");

    expect(carousel).toContain("basis-full");
    expect(carousel).not.toContain("basis-[88%]");
    expect(carousel).not.toContain("--carousel-item-width:240px");
  });
});
