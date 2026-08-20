"use server";

import {
  STAFF_DEMO_SESSION_COOKIE,
  isStaffDemoModeEnabled,
  normalizeStaffDemoIdentity,
} from "@/lib/staff-demo-access";
import { cookies } from "next/headers";

export type StaffDemoActionResult = {
  ok: boolean;
  error?: string;
};

export async function enterStaffDemoAction(identity: string): Promise<StaffDemoActionResult> {
  if (!isStaffDemoModeEnabled()) {
    return {
      ok: false,
      error: "Staff demo access is only available when Clerk authentication is not configured.",
    };
  }

  const normalizedIdentity = normalizeStaffDemoIdentity(identity);

  if (!normalizedIdentity) {
    return { ok: false, error: "Unknown staff demo identity." };
  }

  const cookieStore = await cookies();
  cookieStore.set(STAFF_DEMO_SESSION_COOKIE, normalizedIdentity, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return { ok: true };
}

export async function exitStaffDemoAction(): Promise<StaffDemoActionResult> {
  const cookieStore = await cookies();
  cookieStore.delete(STAFF_DEMO_SESSION_COOKIE);

  return { ok: true };
}
