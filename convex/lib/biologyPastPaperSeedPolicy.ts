export const BIOLOGY_COURSE_STABLE_ID = "bgcse-biology";
export const BIOLOGY_2019_PAPER_STABLE_ID = "bgcse-biology-2019-paper-3";
export const BIOLOGY_2019_PAPER_CODE = "0572/03";
export const BIOLOGY_2019_SESSION = "October/November 2019";
export const BIOLOGY_2019_QUESTION_STABLE_IDS = [
  "bgcse-bio-2019-p3-q1",
  "bgcse-bio-2019-p3-q2",
  "bgcse-bio-2019-p3-q3",
  "bgcse-bio-2019-p3-q4",
  "bgcse-bio-2019-p3-q5",
  "bgcse-bio-2019-p3-q6",
  "bgcse-bio-2019-p3-q7",
] as const;

export type BiologyPastPaperSeedRecord = {
  stableId: string;
  courseStableId: string;
  year: number;
  paperCode: string;
  session?: string;
  seedManaged?: boolean;
};

export function isBiology2019Paper3ResetCandidate(paper: BiologyPastPaperSeedRecord) {
  if (paper.stableId === BIOLOGY_2019_PAPER_STABLE_ID || paper.seedManaged !== true) return false;
  if (paper.courseStableId !== BIOLOGY_COURSE_STABLE_ID || paper.year !== 2019) return false;
  if (paper.paperCode.trim() !== BIOLOGY_2019_PAPER_CODE) return false;

  const session = paper.session?.trim();
  return session === BIOLOGY_2019_SESSION || paper.stableId.startsWith(`${BIOLOGY_2019_PAPER_STABLE_ID}-`);
}
