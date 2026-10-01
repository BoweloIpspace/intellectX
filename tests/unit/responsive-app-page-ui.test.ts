import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(file: string) {
  return readFileSync(path.resolve(process.cwd(), file), "utf8");
}

describe("responsive app page UI contract", () => {
  it("centralizes web and staff page layout primitives", () => {
    const primitives = source("src/components/ui/app-page-primitives.tsx");

    expect(primitives).toContain("AppPageStack");
    expect(primitives).toContain("AppPageHeader");
    expect(primitives).toContain("AppSurface");
    expect(primitives).toContain("AppListRow");
    expect(primitives).toContain("AppMetricCard");
    expect(primitives).toContain("min-w-0");
    expect(primitives).toContain("text-balance");
  });

  it("uses shared page headers across learner, instructor, and admin destinations", () => {
    const files = [
      "src/app/dashboard/page.tsx",
      "src/app/courses/page.tsx",
      "src/app/progress/page.tsx",
      "src/app/learn/[lessonId]/page.tsx",
      "src/app/instructor/page.tsx",
      "src/app/instructor/courses/page.tsx",
      "src/app/instructor/courses/new/page.tsx",
      "src/app/admin/page.tsx",
      "src/app/admin/course-review/page.tsx",
      "src/app/admin/instructors/page.tsx",
      "src/app/admin/past-papers/page.tsx",
    ];

    for (const file of files) {
      expect(source(file)).toContain("AppPage");
    }
  });

  it("uses reusable responsive surfaces in the core content components", () => {
    const files = [
      "src/components/education/course-card.tsx",
      "src/components/education/local-dashboard-content.tsx",
      "src/components/education/local-progress-content.tsx",
      "src/components/instructor/instructor-dashboard.tsx",
      "src/components/instructor/instructor-course-list.tsx",
      "src/components/admin/admin-dashboard.tsx",
    ];

    for (const file of files) {
      const component = source(file);
      expect(component).toContain("AppSurface");
      expect(component).not.toContain("glassCardClassName");
      expect(component).not.toContain("clickableGlassCardClassName");
      expect(component).not.toContain("elevatedGlassCardClassName");
    }
  });

  it("keeps dynamic course and lesson pages responsive without legacy card wrappers", () => {
    const course = source("src/app/courses/[id]/page.tsx");
    const lesson = source("src/app/learn/[lessonId]/page.tsx");

    expect(course).toContain("AppListRow");
    expect(course).toContain("AppSurface");
    expect(lesson).toContain("AppPageHeader");
    expect(lesson).toContain("AppSurface");
    expect(course).not.toContain("<Card ");
    expect(lesson).not.toContain("<Card ");
  });
});
