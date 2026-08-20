import {
  resolveStaffRouteAccess,
  type StaffRouteAccessDecision,
} from "@/lib/staff-route-runtime-access";
import type { StaffRole } from "@/lib/staff-route-access-policy";

type StaffDemoEnv = Partial<Record<"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" | "NODE_ENV", string>>;

export const STAFF_DEMO_SESSION_COOKIE = "intellectx:staff-demo-session";

export const STAFF_DEMO_IDENTITY_ADMIN = "demo-admin";
export const STAFF_DEMO_IDENTITY_INSTRUCTOR = "demo-instructor";

export type StaffDemoIdentity = typeof STAFF_DEMO_IDENTITY_ADMIN | typeof STAFF_DEMO_IDENTITY_INSTRUCTOR;

const staffDemoRoles: Record<StaffDemoIdentity, StaffRole> = {
  [STAFF_DEMO_IDENTITY_ADMIN]: "admin",
  [STAFF_DEMO_IDENTITY_INSTRUCTOR]: "instructor",
};

/**
 * Staff demo access is a local/demo-only affordance. It is available only when
 * Clerk authentication is NOT configured (local-fallback mode) AND the app is
 * not running a production build. Whenever Clerk keys are present, demo access
 * is disabled so real staff authentication is never bypassed.
 */
export function isStaffDemoModeEnabled(
  env: StaffDemoEnv = {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },
) {
  return !env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && env.NODE_ENV !== "production";
}

export function normalizeStaffDemoIdentity(value: string | null | undefined): StaffDemoIdentity | null {
  if (value === STAFF_DEMO_IDENTITY_ADMIN || value === STAFF_DEMO_IDENTITY_INSTRUCTOR) {
    return value;
  }

  return null;
}

export function resolveStaffDemoRole(identity: string | null | undefined): StaffRole | null {
  const normalized = normalizeStaffDemoIdentity(identity);

  return normalized ? staffDemoRoles[normalized] : null;
}

export function resolveStaffDemoSessionRole(cookieValue: string | null | undefined): StaffRole | null {
  return resolveStaffDemoRole(normalizeStaffDemoIdentity(cookieValue?.trim()));
}

/**
 * Resolves the staff route access decision for a demo session, or null when
 * demo mode is disabled or no demo session exists. The resolved role flows
 * through the exact same `resolveStaffRouteAccess` policy used for real Clerk
 * sessions, so demo identities get no route privileges beyond their role.
 */
export function resolveStaffDemoRouteAccess({
  demoModeEnabled,
  cookieValue,
  pathname,
}: {
  demoModeEnabled: boolean;
  cookieValue: string | null | undefined;
  pathname: string;
}): StaffRouteAccessDecision | null {
  if (!demoModeEnabled) {
    return null;
  }

  const role = resolveStaffDemoSessionRole(cookieValue);

  if (!role) {
    return null;
  }

  return resolveStaffRouteAccess(role, pathname);
}
