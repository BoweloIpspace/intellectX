import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(file: string) {
  return readFileSync(path.resolve(process.cwd(), file), "utf8");
}

const seed = source("convex/seedBiologyPastPaper.ts");
const questionsBlock = seed.slice(seed.indexOf("const questions = ["), seed.indexOf("export const seed"));

const stimulusAssets = [
  "public/past-papers/bgcse-biology/2019-paper-3/q1-fungus.svg",
  "public/past-papers/bgcse-biology/2019-paper-3/q2-left-heart.svg",
  "public/past-papers/bgcse-biology/2019-paper-3/q3-male-reproductive.svg",
  "public/past-papers/bgcse-biology/2019-paper-3/q4-yeast-temperature.svg",
  "public/past-papers/bgcse-biology/2019-paper-3/q5-adrenaline-graph.svg",
  "public/past-papers/bgcse-biology/2019-paper-3/q6-vegetative-propagation.svg",
];

describe("BGCSE Biology 0572/03 October/November 2019 digital fidelity", () => {
  it("preserves the verified paper metadata, seven-question structure, and 70-mark total", () => {
    expect(seed).toContain('paperCode: "0572/03"');
    expect(seed).toContain('session: "October/November 2019"');
    expect(seed).toContain('estimatedTime: "1 hour 15 minutes"');
    expect(seed).toContain("totalMarks: 70");
    expect(seed).toContain("pageCount: 8");

    const stableIds = questionsBlock.match(/stableId: "bgcse-bio-2019-p3-q\d"/g) ?? [];
    const marks = [...questionsBlock.matchAll(/\n\s+marks: (\d+),/g)].map((match) => Number(match[1]));

    expect(stableIds).toHaveLength(7);
    expect(marks).toEqual([8, 7, 7, 7, 11, 15, 15]);
    expect(marks.reduce((total, mark) => total + mark, 0)).toBe(70);
    expect(questionsBlock.match(/sectionLabel: "Section A"/g)).toHaveLength(5);
    expect(questionsBlock.match(/sectionLabel: "Section B"/g)).toHaveLength(2);
  });

  it("gives every visual-dependent question accessible source material instead of missing-figure instructions", () => {
    for (const asset of stimulusAssets) {
      expect(existsSync(path.resolve(process.cwd(), asset)), asset).toBe(true);
      expect(source(asset)).toContain("<svg");
      expect(source(asset)).toContain("<desc");
    }

    expect(questionsBlock.match(/stimulusAssetPath:/g)).toHaveLength(6);
    expect(questionsBlock.match(/stimulusAssetAlt:/g)).toHaveLength(6);
    expect(questionsBlock).not.toContain("depends on the labelled arrows in the original paper figure");
    expect(questionsBlock).not.toContain("must be read from its position in the original figure");
    expect(questionsBlock).not.toContain("depends on the exact family relationships shown in the original paper");
  });

  it("keeps reconstructed artwork provenance explicit instead of presenting it as an exam facsimile", () => {
    expect(questionsBlock.match(/stimulusSourceStatus: "reconstructed-visual"/g)).toHaveLength(6);
    expect(questionsBlock).toContain("original study reconstruction rather than a facsimile");
    expect(questionsBlock).toContain("The original figure could not be independently verified for reusable digital reproduction");
    expect(seed).toContain("original reconstructed study visuals rather than reproducing the examination artwork");
  });

  it("includes the complete ABO family relationships needed to solve question 7", () => {
    expect(questionsBlock).toContain("three sons with blood groups A, B and AB, plus a daughter");
    expect(questionsBlock).toContain("two sons with blood groups AB and O");
    expect(questionsBlock).toContain("IᴬIᴼ (group A) or IᴬIᴮ (group AB)");
    expect(questionsBlock).toContain("Possible blood groups are A, AB and B; O is not possible");
  });

  it("keeps answers and explanations out of the initial paper-detail payload", () => {
    const backend = source("convex/pastPapers.ts");
    const detailQuery = backend.slice(
      backend.indexOf("export const getPastPaperById"),
      backend.indexOf("export const getPastPaperAnswer"),
    );
    const answerQuery = backend.slice(backend.indexOf("export const getPastPaperAnswer"));

    expect(detailQuery).toContain("stimulusAssetPath: question.stimulusAssetPath");
    expect(detailQuery).toContain("stimulusText: question.stimulusText");
    expect(detailQuery).not.toContain("modelAnswer: question.modelAnswer");
    expect(detailQuery).not.toContain("explanation: question.explanation");
    expect(answerQuery).toContain("modelAnswer: question.modelAnswer");
    expect(answerQuery).toContain("explanation: question.explanation");
  });

  it("renders source material before answer reveal and preserves the answer-on-demand query boundary", () => {
    const runner = source("src/components/education/mobile-past-papers.tsx");

    expect(runner).toContain("Source material for question");
    expect(runner).toContain("Reconstructed study visual");
    expect(runner).toContain("current.stimulusAssetPath");
    expect(runner).toContain("current.stimulusAssetAlt");
    expect(runner).toContain("convexApi.pastPapers.getPastPaperAnswer");
    expect(runner).toContain(': "skip"');
    expect(runner.indexOf("current.stimulusAssetPath")).toBeLessThan(runner.indexOf("Reveal answer"));
  });
});
