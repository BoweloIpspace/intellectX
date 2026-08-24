import { getAuthEnvironmentStatus, type AuthEnvironmentMode } from "@/lib/auth-env";

export type QuizGradingMode = "server-fallback" | "convex-authenticated";

export function getQuizGradingMode(authMode: AuthEnvironmentMode = getAuthEnvironmentStatus().mode): QuizGradingMode {
  // Convex learner mutations require a verifiable Convex auth identity in production.
  // A configured public Convex URL alone is not proof of learner authentication.
  return authMode === "clerk-convex-ready" ? "convex-authenticated" : "server-fallback";
}

export function usesAuthenticatedConvexQuizGrading(authMode?: AuthEnvironmentMode) {
  return getQuizGradingMode(authMode) === "convex-authenticated";
}
