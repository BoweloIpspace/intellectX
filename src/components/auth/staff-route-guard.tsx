import { StaffDemoControls } from "@/components/auth/staff-demo-controls";
import { PageShell } from "@/components/education/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  STAFF_DEMO_SESSION_COOKIE,
  type StaffDemoIdentity,
  isStaffDemoModeEnabled,
  normalizeStaffDemoIdentity,
  resolveStaffDemoRouteAccess,
} from "@/lib/staff-demo-access";
import { resolveStaffRouteAccess, resolveTrustedStaffRoleFromClaims } from "@/lib/staff-route-runtime-access";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import Link from "next/link";

type StaffRouteGuardProps = {
  pathname: string;
  children: React.ReactNode;
};

type StaffRouteAccessResult = {
  access: ReturnType<typeof resolveStaffRouteAccess>;
  demoIdentity: StaffDemoIdentity | null;
};

async function resolveStaffDemoSessionAccess(pathname: string): Promise<StaffRouteAccessResult | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(STAFF_DEMO_SESSION_COOKIE)?.value;
  const access = resolveStaffDemoRouteAccess({
    // Demo mode (Clerk not configured and not a production build) is re-checked
    // inside resolveStaffDemoRouteAccess, so this can never unlock staff routes
    // when real Clerk authentication is available.
    demoModeEnabled: isStaffDemoModeEnabled(),
    cookieValue,
    pathname,
  });

  if (!access) {
    return null;
  }

  return {
    access,
    demoIdentity: normalizeStaffDemoIdentity(cookieValue),
  };
}

async function getTrustedStaffRouteAccess(pathname: string): Promise<StaffRouteAccessResult> {
  // Local-only demo identities are resolved before the Clerk path, but only
  // when demo mode is enabled — which itself requires Clerk to be unconfigured
  // and the app to not be a production build. The real Clerk path below never
  // consults the demo session.
  if (isStaffDemoModeEnabled()) {
    const demoAccess = await resolveStaffDemoSessionAccess(pathname);

    if (demoAccess) {
      return demoAccess;
    }
  }

  try {
    const authState = await auth();
    const role = authState.isAuthenticated
      ? resolveTrustedStaffRoleFromClaims(authState.sessionClaims)
      : null;

    return {
      access: resolveStaffRouteAccess(role, pathname),
      demoIdentity: null,
    };
  } catch {
    // Fail closed when Clerk server auth is unavailable or trusted role claims
    // are not available. Do not replace this with local or client-editable state.
    return {
      access: resolveStaffRouteAccess(null, pathname),
      demoIdentity: null,
    };
  }
}

function StaffAccessDenied() {
  return (
    <PageShell>
      <section className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <Badge variant="secondary" className="uppercase">
          Access denied
        </Badge>
        <h1 className="text-4xl leading-[1.1] font-medium tracking-tight md:text-6xl">Staff access is locked</h1>
        <p className="text-muted-foreground max-w-xl leading-6 md:text-lg">
          A trusted authenticated instructor or admin role is required for this workspace. Missing, malformed, or insufficient role claims fail closed.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/">Return home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/courses">Browse learner courses</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}

export async function StaffRouteGuard({ pathname, children }: StaffRouteGuardProps) {
  const { access, demoIdentity } = await getTrustedStaffRouteAccess(pathname);

  if (!access.allowed) {
    return <StaffAccessDenied />;
  }

  return (
    <>
      {demoIdentity ? <StaffDemoControls identity={demoIdentity} /> : null}
      {children}
    </>
  );
}
