import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function read(relativePath: string) {
  return readFileSync(path.resolve(process.cwd(), relativePath), "utf8");
}

describe("staff demo entry wiring", () => {
  it("renders demo entry buttons on the login page only when demo mode is enabled", () => {
    const loginSource = read("src/app/login/[[...sign-in]]/page.tsx");

    expect(loginSource).toContain("isStaffDemoModeEnabled");
    expect(loginSource).toContain("staffDemoEnabled");
    expect(loginSource).toContain("StaffDemoEntry");
    expect(loginSource).toContain("staffDemoEnabled ? <StaffDemoEntry /> : null");
  });

  it("exposes demo buttons through the auth shell as an opt-in slot", () => {
    const shellSource = read("src/components/auth/auth-page-shell.tsx");
    const entrySource = read("src/components/auth/staff-demo-entry.tsx");

    expect(shellSource).toContain("demoEntry");
    expect(entrySource).toContain("Demo as Admin");
    expect(entrySource).toContain("Demo as Instructor");
    expect(entrySource).toContain("enterStaffDemoAction");
  });

  it("gates the demo server actions behind demo mode", () => {
    const actionsSource = read("src/app/login/actions.ts");
    const accessSource = read("src/lib/staff-demo-access.ts");

    expect(actionsSource).toContain("isStaffDemoModeEnabled()");
    expect(actionsSource).toContain("normalizeStaffDemoIdentity");
    expect(actionsSource).toContain("STAFF_DEMO_SESSION_COOKIE");
    expect(accessSource).toContain("intellectx:staff-demo-session");
    expect(actionsSource).toContain("httpOnly: true");
  });

  it("keeps the demo fallback inside the fail-closed path of the staff route guard only", () => {
    const guardSource = read("src/components/auth/staff-route-guard.tsx");

    expect(guardSource).toContain("isStaffDemoModeEnabled");
    expect(guardSource).toContain("resolveStaffDemoRouteAccess");
    expect(guardSource).toContain("catch");
    expect(guardSource).toContain("StaffDemoControls");
    expect(guardSource).toContain("resolveStaffRouteAccess(null, pathname)");
  });
});
