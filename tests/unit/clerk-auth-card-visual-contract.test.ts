import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const authPanelSource = readFileSync(
  path.join(process.cwd(), "src/components/auth/clerk-auth-panel.tsx"),
  "utf8",
);

describe("Clerk auth card visual restoration contract", () => {
  it("keeps the IntellectX auth card branded, responsive, and free of security-noise callouts", () => {
    expect(authPanelSource).not.toContain("ShieldCheckIcon");
    expect(authPanelSource).not.toContain("Clerk securely verifies the account");
    expect(authPanelSource).not.toContain('borderRadius: "0.5rem"');
    expect(authPanelSource).toContain("rounded-[1.75rem]");
    expect(authPanelSource).toContain("min-h-12");
    expect(authPanelSource).toContain("backdrop-blur-xl");
    expect(authPanelSource).toContain('<CardContent className="px-5 pb-6 sm:px-7 sm:pb-7">');
  });

  it("preserves current Clerk authentication and trusted post-login routing behavior", () => {
    expect(authPanelSource).toContain("SignIn, SignUp, useAuth");
    expect(authPanelSource).toContain("resolvePostLoginRouteFromClaims(sessionClaims)");
    expect(authPanelSource).toContain("CLERK_LOGIN_REDIRECT_URL");
    expect(authPanelSource).toContain("CLERK_SIGNUP_REDIRECT_URL");
    expect(authPanelSource).toContain('label="Checking your IntellectX session"');
    expect(authPanelSource).toContain('oauthFlow="redirect"');
  });
});
