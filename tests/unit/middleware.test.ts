import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, type NextFetchEvent, type NextResponse } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import proxy, { config } from "@/proxy";

type ClerkAuthResult = {
  userId: string | null;
  sessionClaims: unknown;
};

const clerkMock = vi.hoisted(() => {
  const state: { authResult: ClerkAuthResult } = {
    authResult: { userId: null, sessionClaims: {} },
  };

  return {
    state,
    clerkMiddleware: vi.fn(
      (handler: (auth: () => Promise<ClerkAuthResult>, request: NextRequest) => Promise<unknown>) =>
        async (request: NextRequest, _event: NextFetchEvent) =>
          handler(async () => state.authResult, request),
    ),
  };
});

vi.mock("@clerk/nextjs/server", () => ({
  clerkMiddleware: clerkMock.clerkMiddleware,
}));

const CLERK_SECRET_KEY = "sk_test_middleware-audit";
const CLERK_PUBLISHABLE_KEY = "pk_test_middleware-audit";

function enableGuard() {
  vi.stubEnv("CLERK_SECRET_KEY", CLERK_SECRET_KEY);
  vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", CLERK_PUBLISHABLE_KEY);
}

async function runProxy(pathname: string): Promise<NextResponse | Response> {
  const request = new NextRequest(`https://intellectx.test${pathname}`);
  const response = await proxy(request, {} as NextFetchEvent);

  if (!response) {
    throw new Error(`Proxy returned no response for ${pathname}`);
  }

  return response;
}

function expectRedirectTo(response: NextResponse | Response, location: string) {
  expect(response.status).toBe(307);
  expect(response.headers.get("location")).toBe(`https://intellectx.test${location}`);
}

describe("server route guard proxy wiring", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clerkMock.state.authResult = { userId: null, sessionClaims: {} };
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("guard disabled (local-fallback mode)", () => {
    it("short-circuits to NextResponse.next() without invoking Clerk", async () => {
      vi.stubEnv("CLERK_SECRET_KEY", "");
      vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");

      const response = await runProxy("/dashboard");

      expect(response.status).toBe(200);
      expect(clerkMiddleware).not.toHaveBeenCalled();
    });

    it("treats whitespace-only Clerk keys as missing", async () => {
      vi.stubEnv("CLERK_SECRET_KEY", "   ");
      vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "\t");

      const response = await runProxy("/dashboard");

      expect(response.status).toBe(200);
      expect(clerkMiddleware).not.toHaveBeenCalled();
    });
  });

  describe("guard enabled with Clerk keys", () => {
    it("redirects signed-out users on protected learner routes to /login", async () => {
      enableGuard();

      const response = await runProxy("/dashboard");

      expectRedirectTo(response, "/login");
      expect(clerkMiddleware).toHaveBeenCalledTimes(1);
    });

    it("redirects signed-out users on staff routes to /login", async () => {
      enableGuard();

      expectRedirectTo(await runProxy("/admin"), "/login");
      expectRedirectTo(await runProxy("/admin/course-review"), "/login");
      expectRedirectTo(await runProxy("/instructor"), "/login");
      expectRedirectTo(await runProxy("/instructor/courses/new"), "/login");
    });

    it("allows signed-out users through public routes", async () => {
      enableGuard();

      expect((await runProxy("/")).status).toBe(200);
      expect((await runProxy("/pricing")).status).toBe(200);
      expect((await runProxy("/login")).status).toBe(200);
      expect((await runProxy("/api/quiz-grading")).status).toBe(200);
    });

    it("redirects authenticated users without a trusted staff role away from staff routes to /courses", async () => {
      enableGuard();
      clerkMock.state.authResult = {
        userId: "user_test_1",
        sessionClaims: { metadata: { role: "learner" } },
      };

      expectRedirectTo(await runProxy("/admin"), "/courses");
      expectRedirectTo(await runProxy("/admin/instructors"), "/courses");
      expectRedirectTo(await runProxy("/instructor"), "/courses");
    });

    it("redirects staff whose role is out of scope for the route to /courses", async () => {
      enableGuard();
      clerkMock.state.authResult = {
        userId: "user_test_1",
        sessionClaims: { publicMetadata: { role: "instructor" } },
      };

      expectRedirectTo(await runProxy("/admin"), "/courses");
    });

    it("allows admin claims through authorized admin routes", async () => {
      enableGuard();
      clerkMock.state.authResult = {
        userId: "user_test_1",
        sessionClaims: { staff: { role: "admin" } },
      };

      expect((await runProxy("/admin")).status).toBe(200);
      expect((await runProxy("/admin/course-review")).status).toBe(200);
      expect((await runProxy("/admin/instructors")).status).toBe(200);
    });

    it("allows instructor claims through authorized instructor routes", async () => {
      enableGuard();
      clerkMock.state.authResult = {
        userId: "user_test_1",
        sessionClaims: { metadata: { role: "instructor" } },
      };

      expect((await runProxy("/instructor")).status).toBe(200);
      expect((await runProxy("/instructor/courses")).status).toBe(200);
      expect((await runProxy("/instructor/courses/new")).status).toBe(200);
    });

    it("allows authenticated learners through learner routes regardless of claims", async () => {
      enableGuard();
      clerkMock.state.authResult = {
        userId: "user_test_1",
        sessionClaims: { metadata: { role: "learner" } },
      };

      expect((await runProxy("/courses")).status).toBe(200);
      expect((await runProxy("/progress")).status).toBe(200);
      expect((await runProxy("/quiz/ai-study-systems-check")).status).toBe(200);
    });
  });

  describe("matcher behavior", () => {
    const matchesProxy = (pathname: string) =>
      config.matcher.some((pattern) => new RegExp(pattern).test(pathname));

    it("matches app and API routes so Clerk can expose verified session state", () => {
      for (const pathname of [
        "/",
        "/login",
        "/dashboard",
        "/courses",
        "/courses/ai-study-systems",
        "/quizzes",
        "/learn/prompting-for-learning",
        "/admin",
        "/admin/course-review",
        "/instructor/courses/new",
        "/mobile-quizzes",
        "/checkout",
        "/api/trpc/catalog.search",
        "/api/quiz-grading",
      ]) {
        expect(matchesProxy(pathname), pathname).toBe(true);
      }
    });

    it("excludes static assets and Next internals", () => {
      for (const pathname of [
        "/favicon.ico",
        "/robots.txt",
        "/sitemap.xml",
        "/_next/static/chunks/app/page-abc.js",
        "/_next/image?url=/hero.png",
      ]) {
        expect(matchesProxy(pathname), pathname).toBe(false);
      }
    });
  });
});
