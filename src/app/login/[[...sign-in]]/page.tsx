import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { StaffDemoEntry } from "@/components/auth/staff-demo-entry";
import { isClerkAuthEnabled } from "@/lib/auth-mode";
import { isStaffDemoModeEnabled } from "@/lib/staff-demo-access";
import { resolvePostLoginRouteFromClaims } from "@/lib/post-login-route";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login - IntellectX",
  description: "Learner login for IntellectX.",
};

type LoginPageProps = {
  searchParams: Promise<{ native?: string; nativeShellVersion?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nativeLaunch = params.native === "1" || Boolean(params.nativeShellVersion);
  const staffDemoEnabled = isStaffDemoModeEnabled();

  if (isClerkAuthEnabled() && !nativeLaunch) {
    let authState: Awaited<ReturnType<typeof auth>> | null = null;

    try {
      authState = await auth();
    } catch {
      // Render the fail-closed Clerk login surface when server auth is unavailable.
    }

    if (authState?.isAuthenticated) {
      redirect(resolvePostLoginRouteFromClaims(authState.sessionClaims));
    }
  }

  return <AuthPageShell mode="login" demoEntry={staffDemoEnabled ? <StaffDemoEntry /> : null} />;
}
