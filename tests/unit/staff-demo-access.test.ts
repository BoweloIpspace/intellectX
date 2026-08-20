import { describe, expect, it } from "vitest";

import {
  STAFF_DEMO_IDENTITY_ADMIN,
  STAFF_DEMO_IDENTITY_INSTRUCTOR,
  isStaffDemoModeEnabled,
  normalizeStaffDemoIdentity,
  resolveStaffDemoRouteAccess,
  resolveStaffDemoRole,
  resolveStaffDemoSessionRole,
} from "@/lib/staff-demo-access";

describe("staff demo mode detection", () => {
  it("is enabled only when Clerk auth is unavailable outside production", () => {
    expect(isStaffDemoModeEnabled({ NODE_ENV: "development" })).toBe(true);
    expect(isStaffDemoModeEnabled({ NODE_ENV: "test" })).toBe(true);
    expect(isStaffDemoModeEnabled({ NODE_ENV: "production" })).toBe(false);
  });

  it("is disabled whenever a Clerk publishable key is configured", () => {
    expect(
      isStaffDemoModeEnabled({ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_1", NODE_ENV: "development" }),
    ).toBe(false);
    expect(
      isStaffDemoModeEnabled({ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_1", NODE_ENV: "production" }),
    ).toBe(false);
    expect(
      isStaffDemoModeEnabled({ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_1", NODE_ENV: "test" }),
    ).toBe(false);
  });
});

describe("staff demo identity resolution", () => {
  it("normalizes only the supported demo identities", () => {
    expect(normalizeStaffDemoIdentity(STAFF_DEMO_IDENTITY_ADMIN)).toBe(STAFF_DEMO_IDENTITY_ADMIN);
    expect(normalizeStaffDemoIdentity(STAFF_DEMO_IDENTITY_INSTRUCTOR)).toBe(STAFF_DEMO_IDENTITY_INSTRUCTOR);
    expect(normalizeStaffDemoIdentity("admin")).toBeNull();
    expect(normalizeStaffDemoIdentity("instructor")).toBeNull();
    expect(normalizeStaffDemoIdentity("")).toBeNull();
    expect(normalizeStaffDemoIdentity(null)).toBeNull();
    expect(normalizeStaffDemoIdentity(undefined)).toBeNull();
  });

  it("maps demo identities onto the existing staff roles", () => {
    expect(resolveStaffDemoRole(STAFF_DEMO_IDENTITY_ADMIN)).toBe("admin");
    expect(resolveStaffDemoRole(STAFF_DEMO_IDENTITY_INSTRUCTOR)).toBe("instructor");
    expect(resolveStaffDemoRole("owner")).toBeNull();
    expect(resolveStaffDemoSessionRole(` ${STAFF_DEMO_IDENTITY_ADMIN} `)).toBe("admin");
  });
});

describe("staff demo route access", () => {
  it("grants demo admin the admin and instructor routes", () => {
    expect(
      resolveStaffDemoRouteAccess({
        demoModeEnabled: true,
        cookieValue: STAFF_DEMO_IDENTITY_ADMIN,
        pathname: "/admin",
      })?.allowed,
    ).toBe(true);
    expect(
      resolveStaffDemoRouteAccess({
        demoModeEnabled: true,
        cookieValue: STAFF_DEMO_IDENTITY_ADMIN,
        pathname: "/instructor",
      })?.allowed,
    ).toBe(true);
  });

  it("grants demo instructor only instructor routes", () => {
    expect(
      resolveStaffDemoRouteAccess({
        demoModeEnabled: true,
        cookieValue: STAFF_DEMO_IDENTITY_INSTRUCTOR,
        pathname: "/instructor",
      })?.allowed,
    ).toBe(true);
    expect(
      resolveStaffDemoRouteAccess({
        demoModeEnabled: true,
        cookieValue: STAFF_DEMO_IDENTITY_INSTRUCTOR,
        pathname: "/admin",
      })?.allowed,
    ).toBe(false);
  });

  it("is fully disabled when demo mode is off or no demo session exists", () => {
    expect(
      resolveStaffDemoRouteAccess({
        demoModeEnabled: false,
        cookieValue: STAFF_DEMO_IDENTITY_ADMIN,
        pathname: "/admin",
      }),
    ).toBeNull();
    expect(
      resolveStaffDemoRouteAccess({
        demoModeEnabled: true,
        cookieValue: undefined,
        pathname: "/admin",
      }),
    ).toBeNull();
    expect(
      resolveStaffDemoRouteAccess({
        demoModeEnabled: true,
        cookieValue: "admin",
        pathname: "/admin",
      }),
    ).toBeNull();
  });
});
