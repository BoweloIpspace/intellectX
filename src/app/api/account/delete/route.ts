import { convexApi } from "@/lib/convex-api";
import { writeServerLog } from "@/lib/server-log";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";

export const dynamic = "force-dynamic";

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

function isDeletionResult(value: unknown): value is { receiptId: string; deletedAt: number } {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return typeof record.receiptId === "string" && typeof record.deletedAt === "number";
}

export async function DELETE() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  if (!convexUrl) {
    return json(503, { ok: false, error: "Account deletion is unavailable until the production data service is configured." });
  }

  let authState;
  try {
    authState = await auth();
  } catch (error) {
    writeServerLog("error", "account_deletion_auth_unavailable", {
      message: error instanceof Error ? error.message : "Unknown auth error",
    });
    return json(503, { ok: false, error: "Account authentication is not configured." });
  }

  if (!authState.isAuthenticated || !authState.userId) {
    return json(401, { ok: false, error: "Authentication is required." });
  }

  let convexToken: string | null;
  try {
    convexToken = await authState.getToken({ template: "convex" });
  } catch (error) {
    writeServerLog("error", "account_deletion_convex_token_failed", {
      message: error instanceof Error ? error.message : "Unknown token error",
    });
    return json(503, { ok: false, error: "Account data authentication is not configured." });
  }

  if (!convexToken) {
    return json(503, { ok: false, error: "Account data authentication is not configured." });
  }

  const convex = new ConvexHttpClient(convexUrl, { auth: convexToken, logger: false });
  let deletionResult: unknown;

  try {
    deletionResult = await convex.mutation(convexApi.accountLifecycle.deleteMyLearnerData, {});
  } catch (error) {
    writeServerLog("error", "account_deletion_data_cleanup_failed", {
      message: error instanceof Error ? error.message : "Unknown data cleanup error",
    });
    return json(502, { ok: false, error: "Account data could not be deleted safely." });
  }

  if (!isDeletionResult(deletionResult)) {
    writeServerLog("error", "account_deletion_invalid_cleanup_response");
    return json(502, { ok: false, error: "Account data deletion returned an invalid result." });
  }

  try {
    const client = await clerkClient();
    await client.users.deleteUser(authState.userId);
  } catch (error) {
    writeServerLog("error", "account_deletion_identity_cleanup_failed", {
      deletionReceiptId: deletionResult.receiptId,
      message: error instanceof Error ? error.message : "Unknown identity cleanup error",
    });
    return json(502, {
      ok: false,
      error: "Learner data was deleted, but account identity deletion must be retried.",
      deletionReceiptId: deletionResult.receiptId,
    });
  }

  writeServerLog("info", "account_deletion_completed", {
    deletionReceiptId: deletionResult.receiptId,
  });

  return json(200, {
    ok: true,
    deletionReceiptId: deletionResult.receiptId,
    deletedAt: deletionResult.deletedAt,
  });
}
