import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import {
  isServerRouteGuardEnabled,
  resolveRouteGuardDecision,
} from "@/lib/route-guard-policy";

/**
 * Server-side route enforcement for learner and staff app paths.
 *
 * - Local-fallback mode (no Clerk keys): complete no-op so the app keeps
 *   working without Clerk configuration; the client-side PageShell guard
 *   remains authoritative there.
 * - Clerk-configured mode: signed-out requests on authenticated app paths
 *   redirect to /login, and signed-in users without an allowed staff role are
 *   kept out of staff routes (redirect to /courses). Role claims come from the
 *   verified Clerk session only, never client state.
 *
 * The matcher excludes static assets, _next internals, and API routes; every
 * matched path falls through to the decision policy.
 */
export default function middleware(request: NextRequest, event: NextFetchEvent) {
  if (!isServerRouteGuardEnabled()) {
    return NextResponse.next();
  }

  return clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth();

    const decision = resolveRouteGuardDecision({
      pathname: req.nextUrl.pathname,
      authenticated: Boolean(userId),
      claims: sessionClaims,
    });

    if (decision === "redirect-login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (decision === "redirect-courses") {
      return NextResponse.redirect(new URL("/courses", req.url));
    }

    return NextResponse.next();
  })(request, event);
}

export const config = {
  matcher: ["/((?!.*\\..*|_next|api).*)"],
};
