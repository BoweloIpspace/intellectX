import { convexApi } from "@/lib/convex-api";
import { convexEnv } from "@/lib/education-data";
import { ConvexHttpClient } from "convex/browser";

export type LearnerPastPaperSummary = {
  stableId: string;
  courseStableId: string;
  title: string;
  year: number;
  paperCode: string;
  session?: string;
  description?: string;
  estimatedTime?: string;
  order: number;
};

export type LearnerPastPaperQuestion = {
  stableId: string;
  questionNumber: string;
  prompt: string;
  marks?: number;
  modelAnswer: string;
  explanation?: string;
  order: number;
};

export type LearnerPastPaper = LearnerPastPaperSummary & {
  questions: LearnerPastPaperQuestion[];
};

function getConvexClient() {
  return convexEnv.url ? new ConvexHttpClient(convexEnv.url) : null;
}

export async function getLearnerPastPapersByCourse(courseStableId: string): Promise<LearnerPastPaperSummary[]> {
  const client = getConvexClient();

  if (!client) {
    return [];
  }

  try {
    return (await client.query(convexApi.pastPapers.getPastPapersByCourse, {
      courseStableId,
    })) as LearnerPastPaperSummary[];
  } catch {
    // A frontend preview may deploy moments before its matching Convex functions.
    // Treat that rollout window as "no papers yet" instead of failing static generation.
    return [];
  }
}

export async function getLearnerPastPaper(paperId: string): Promise<LearnerPastPaper | null> {
  const client = getConvexClient();

  if (!client) {
    return null;
  }

  try {
    return (await client.query(convexApi.pastPapers.getPastPaperById, { paperId })) as LearnerPastPaper | null;
  } catch {
    return null;
  }
}
