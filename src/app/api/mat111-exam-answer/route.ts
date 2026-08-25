import { getMat111ExamPaper } from "@/data/mat111-exams";
import { getMat111ExamAnswer } from "@/server/mat111-exam-answers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8 * 1024;

function response(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) {
    return response({ error: "MAT111 answer requests must use application/json." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return response({ error: "MAT111 answer request is too large." }, 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return response({ error: "MAT111 answer request must contain valid JSON." }, 400);
  }

  if (!body || typeof body !== "object") {
    return response({ error: "MAT111 answer request is invalid." }, 400);
  }

  const { paperId, questionId } = body as Record<string, unknown>;
  if (typeof paperId !== "string" || typeof questionId !== "string") {
    return response({ error: "Paper ID and question ID are required." }, 400);
  }

  const paper = getMat111ExamPaper(paperId);
  if (!paper || !paper.questions.some((question) => question.stableId === questionId)) {
    return response({ error: "MAT111 practice question does not exist." }, 404);
  }

  const answer = getMat111ExamAnswer(paperId, questionId);
  if (!answer) {
    return response({ error: "A model answer has not been published for this question." }, 404);
  }

  return response(answer);
}
