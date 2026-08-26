import { listLearnerVisibleCourses, type Course } from "../../src/data/courses";
import { courseMatchesAcademicTrack, type AcademicProfile } from "../../src/lib/academic-profile";
import { APPROVED, PUBLISHED } from "../../src/lib/course-workflow-policy";
import { describe, expect, it } from "vitest";

function makeCourse(overrides: Partial<Course> = {}): Course {
  return {
    id: "course-1",
    slug: "course-1",
    title: "Course 1",
    description: "Course description",
    subject: "Study",
    level: "Beginner",
    duration: "Self-paced",
    progress: 0,
    lessonIds: [],
    quizIds: [],
    accent: "from-slate-500 to-slate-700",
    reviewStatus: APPROVED,
    publicationStatus: PUBLISHED,
    ...overrides,
  };
}

const seniorBotswanaForm5: AcademicProfile = {
  educationLevel: "Senior",
  curriculumOrInstitution: "Botswana curriculum",
  gradeOrYear: "Form 5",
  subjectsOrModules: [],
};

const ubYear1: AcademicProfile = {
  educationLevel: "University / Varsity",
  curriculumOrInstitution: "UB",
  gradeOrYear: "Year 1",
  subjectsOrModules: [],
};

describe("course academic targeting", () => {
  it("matches a school course to the same level and curriculum", () => {
    const biology = makeCourse({
      id: "bgcse-biology",
      educationLevel: "Senior",
      curriculumOrInstitution: "Botswana curriculum",
    });

    expect(courseMatchesAcademicTrack(biology, seniorBotswanaForm5)).toBe(true);
  });

  it("does not leak a school course into a university profile", () => {
    const biology = makeCourse({
      id: "bgcse-biology",
      educationLevel: "Senior",
      curriculumOrInstitution: "Botswana curriculum",
    });

    expect(courseMatchesAcademicTrack(biology, ubYear1)).toBe(false);
  });

  it("honors an exact grade or year target when one is supplied", () => {
    const mat111 = makeCourse({
      id: "mat111-introductory-mathematics-i",
      educationLevel: "University / Varsity",
      curriculumOrInstitution: "UB",
      gradeOrYear: "Year 1",
    });

    expect(courseMatchesAcademicTrack(mat111, ubYear1)).toBe(true);
    expect(courseMatchesAcademicTrack(mat111, { ...ubYear1, gradeOrYear: "Year 2" })).toBe(false);
    expect(courseMatchesAcademicTrack(mat111, { ...ubYear1, curriculumOrInstitution: "BIUST" })).toBe(false);
  });

  it("does not expose a published course with no academic target to native matching", () => {
    expect(courseMatchesAcademicTrack(makeCourse(), seniorBotswanaForm5)).toBe(false);
  });

  it("publishes only the canonical UB Year 1 course set for that academic track", () => {
    const matchingCourseIds = listLearnerVisibleCourses()
      .filter((course) => courseMatchesAcademicTrack(course, ubYear1))
      .map((course) => course.id)
      .sort();

    expect(matchingCourseIds).toEqual(
      [
        "biology-101",
        "chemistry-101",
        "mat111-introductory-mathematics-i",
        "physics-101",
      ].sort(),
    );
  });

  it("does not leak UB Year 1 science courses into another year", () => {
    const ubYear2 = { ...ubYear1, gradeOrYear: "Year 2" };
    const matchingScienceIds = listLearnerVisibleCourses()
      .filter((course) => ["biology-101", "physics-101", "chemistry-101"].includes(course.id))
      .filter((course) => courseMatchesAcademicTrack(course, ubYear2))
      .map((course) => course.id);

    expect(matchingScienceIds).toEqual([]);
  });
});
