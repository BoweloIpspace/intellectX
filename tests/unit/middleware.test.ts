import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, type NextFetchEvent, type NextResponse } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import middleware, { config } from "@/middleware";

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
        async (request: NextRequest) => handler(async () => state.authResult, request),
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

async function runMiddleware(pathname: string): Promise<NextResponse | Response> {
  const request = new NextRequest(`https://intellectx.test${pathname}`);
  const response = await middleware(request, {} as NextFetchEvent);

  if (!response) {
    throw new Error(`Middleware returned no response for ${pathname}`);
  }

  return response;
}

function expectRedirectTo(response: NextResponse | Response, location: string) {
  expect(response.status).toBe(307);
  expect(response.headers.get("location")).toBe(`https://intellectx.test${location}`);
}

describe("server route guard middleware wiring", () => {
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

      const response = await runMiddleware("/dashboard");

      expect(response.status).toBe(200);
      expect(clerkMiddleware).not.toHaveBeenCalled();
    });
  });

  describe("guard enabled with Clerk keys", () => {
    it("redirects signed-out users on protected learner routes to /login", async () => {
      enableGuard();

      const response = await runMiddleware("/dashboard");

      expectRedirectTo(response, "/login");
      expect(clerkMiddleware).toHaveBeenCalledTimes(1);
    });

    it("redirects signed-out users on staff routes to /login", async () => {
      enableGuard();

      expectRedirectTo(await runMiddleware("/admin"), "/login");
      expectRedirectTo(await runMiddleware("/admin/course-review"), "/login");
      expectRedirectTo(await runMiddleware("/instructor"), "/login");
      expectRedirectTo(await runMiddleware("/instructor/courses/new"), "/login");
    });

    it("allows signed-out users through public routes", async () => {
      enableGuard();

      expect((await runMiddleware("/")).status).toBe(200);
      expect((await runMiddleware("/pricing")).status).toBe(200);
      expect((await runMiddleware("/login")).status).toBe(200);
    });

    it("redirects authenticated users without a trusted staff role away from staff routes to /courses", async () => {
      enableGuard();
      clerkMock.state.authResult = {
        userId: "user_test_1",
        sessionClaims: { metadata: { role: "learner" } },
      };

      expectRedirectTo(await runMiddleware("/admin"), "/courses");
      expectRedirectTo(await runMiddleware("/admin/instructors"), "/courses");
      expectRedirectTo(await runMiddleware("/instructor"), "/courses");
    });

    it("redirects staff whose role is out of scope for the route to /courses", async () => {
      enableGuard();
      clerkMock.state.authResult = {
        userId: "user_test_1",
        sessionClaims: { publicMetadata: { role: "instructor" } },
      };

      expectRedirectTo(await runMiddleware("/admin"), "/courses");
    });

    it("allows admin claims through authorized admin routes", async () => {
      enableGuard();
      clerkMock.state.authResult = {
        userId: "user_test_1",
        sessionClaims: { staff: { role: "admin" } },
      };

      expect((await runMiddleware("/admin")).status).toBe(200);
      expect((await runMiddleware("/admin/course-review")).status).toBe(200);
      expect((await runMiddleware("/admin/instructors")).status).toBe(200);
    });

    it("allows instructor claims through authorized instructor routes", async () => {
      enableGuard();
      clerkMock.state.authResult = {
        userId: "user_test_1",
        sessionClaims: { metadata: { role: "instructor" } },
      };

      expect((await runMiddleware("/instructor")).status).toBe(200);
      expect((await runMiddleware("/instructor/courses")).status).toBe(200);
      expect((await runMiddleware("/instructor/courses/new")).status).toBe(200);
    });

    it("allows authenticated learners through learner routes regardless of claims", async () => {
      enableGuard();
      clerkMock.state.authResult = {
        userId: "user_test_1",
        sessionClaims: { metadata: { role: "learner" } },
      };

      expect((await runMiddleware("/courses")).status).toBe(200);
      expect((await runMiddleware("/progress")).status).toBe(200);
      expect((await runMiddleware("/quiz/ai-study-systems-check")).status).toBe(200);
    });
  });

  describe("matcher behavior", () => {
    it("matches app routes so the guard runs on them", () => {
      const matcher = new RegExp(config.matcher[0]);

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
      ]) {
        expect(matcher.test(pathname), pathname).toBe(true);
      }
    });

    it("excludes static assets, Next internals, and API routes from the guard", () => {
      const matcher = new RegExp(config.matcher[0]);

      for (const pathname of [
        "/favicon.ico",
        "/robots.txt",
        "/sitemap.xml",
        "/_next/static/chunks/app/page-abc.js",
        "/_next/image?url=/hero.png",
        "/api/trpc/catalog.search",
      ]) {
        expect(matcher.test(pathname), pathname).toBe(false);
      }
    });
  });
});
