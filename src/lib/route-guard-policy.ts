import { isAuthenticatedAppPath } from "@/lib/learner-routes";
import {
  resolveStaffRouteAccess,
  resolveTrustedStaffRoleFromClaims,
} from "@/lib/staff-route-runtime-access";

type ServerRouteGuardEnv = Partial<
  Record<"CLERK_SECRET_KEY" | "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", string>
>;

/**
 * Server-side route enforcement is only safe when Clerk can actually verify
 * sessions: both the publishable key and the server secret key must be present.
 * When they are missing (local-fallback mode), the middleware must stay a
 * complete no-op so the client-side PageShell guard remains authoritative and
 * the app keeps working without a ConvexProvider or Clerk configuration.
 */
export function isServerRouteGuardEnabled(
  env: ServerRouteGuardEnv = {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
) {
  return Boolean(
    env.CLERK_SECRET_KEY?.trim() && env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim(),
  );
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
