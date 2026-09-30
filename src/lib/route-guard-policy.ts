import { isAuthenticatedAppPath } from "@/lib/learner-routes";
import {
  resolveStaffRouteAccess,
  resolveTrustedStaffRoleFromClaims,
} from "@/lib/staff-route-runtime-access";

type ServerRouteGuardEnv = Partial<
  Record<"CLERK_SECRET_KEY" | "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" | "NODE_ENV", string>
>;

/**
 * Server-side route enforcement is only safe when Clerk can actually verify
 * sessions: both the publishable key and the server secret key must be present.
 * Local fallback is development/test only. Production fails closed when either
 * Clerk key is missing so a deployment cannot silently downgrade to browser-only auth.
 */
export function isServerRouteGuardEnabled(
  env: ServerRouteGuardEnv = {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },
) {
  const clerkConfigured = Boolean(env.CLERK_SECRET_KEY && env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (env.NODE_ENV === "production" && !clerkConfigured) {
    throw new Error("Production authentication is not configured: Clerk server and publishable keys are required.");
  }

  return clerkConfigured;
}

export type RouteGuardDecision = "allow" | "redirect-login" | "redirect-courses";

/**
 * Resolves the server-side access decision for a request. Mirrors the client
 * guard boundary (`isAuthenticatedAppPath`) so middleware and PageShell never
 * drift, and reuses the trusted staff-role claim policy that Convex RBAC and
 * the staff route guards already rely on.
 */
export function resolveRouteGuardDecision({
  pathname,
  authenticated,
  claims,
}: {
  pathname: string;
  authenticated: boolean;
  claims?: unknown;
}): RouteGuardDecision {
  if (!isAuthenticatedAppPath(pathname)) {
    return "allow";
  }

  if (!authenticated) {
    return "redirect-login";
  }

  const staffAccess = resolveStaffRouteAccess(resolveTrustedStaffRoleFromClaims(claims), pathname);

  if (!staffAccess.allowed && staffAccess.reason !== "not_staff_route") {
    return "redirect-courses";
  }

  return "allow";
}
