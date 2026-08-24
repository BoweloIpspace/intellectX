import { describe, expect, it } from "vitest";
import {
  BIOLOGY_2019_PAPER_STABLE_ID,
  isBiology2019Paper3ResetCandidate,
} from "../../convex/lib/biologyPastPaperSeedPolicy";

const canonical = {
  stableId: BIOLOGY_2019_PAPER_STABLE_ID,
  courseStableId: "bgcse-biology",
  year: 2019,
  paperCode: "0572/03",
  session: "October/November 2019",
  seedManaged: true,
};

describe("Biology 2019 Past Paper seed reset policy", () => {
  it("never treats the canonical paper itself as stale", () => {
    expect(isBiology2019Paper3ResetCandidate(canonical)).toBe(false);
  });

  it("recognizes only seed-managed Biology 2019 Paper 3 legacy rows", () => {
    expect(
      isBiology2019Paper3ResetCandidate({
        ...canonical,
        stableId: "bgcse-biology-2019-paper-3-legacy",
      }),
    ).toBe(true);

    expect(
      isBiology2019Paper3ResetCandidate({
        ...canonical,
        stableId: "legacy-row-from-2019-import",
      }),
    ).toBe(true);
  });

  it("protects manual rows even when their metadata matches the canonical paper", () => {
    expect(
      isBiology2019Paper3ResetCandidate({
        ...canonical,
        stableId: "bgcse-biology-2019-paper-3-manual-copy",
        seedManaged: false,
      }),
    ).toBe(false);
  });

  it("protects future seed-managed Biology papers from a 2019 reset", () => {
    expect(
      isBiology2019Paper3ResetCandidate({
        ...canonical,
        stableId: "bgcse-biology-2020-paper-3",
        year: 2020,
        session: "October/November 2020",
      }),
    ).toBe(false);

    expect(
      isBiology2019Paper3ResetCandidate({
        ...canonical,
        stableId: "bgcse-biology-2019-paper-2",
        paperCode: "0572/02",
      }),
    ).toBe(false);
  });

  it("protects seed-managed papers belonging to other courses", () => {
    expect(
      isBiology2019Paper3ResetCandidate({
        ...canonical,
        stableId: "other-course-2019-paper-3",
        courseStableId: "another-biology-course",
      }),
    ).toBe(false);
  });
});
