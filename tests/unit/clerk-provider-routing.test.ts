import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(file: string) {
  return readFileSync(path.resolve(process.cwd(), file), "utf8");
}

describe("Clerk provider routing contract", () => {
  it("declares the dedicated IntellectX auth routes in every Clerk provider branch", () => {
    const provider = source("src/components/providers/convex-client-provider.tsx");

    expect(provider.match(/signInUrl="\/login"/g)?.length).toBe(2);
    expect(provider.match(/signUpUrl="\/signup"/g)?.length).toBe(2);
    expect(provider.match(/signInFallbackRedirectUrl="\/auth\/continue"/g)?.length).toBe(2);
    expect(provider.match(/signUpFallbackRedirectUrl="\/onboarding"/g)?.length).toBe(2);
  });

  it("keeps Clerk auth WebView-safe by using redirect OAuth rather than popup-only behavior", () => {
    const panel = source("src/components/auth/clerk-auth-panel.tsx");

    expect(panel.match(/oauthFlow="redirect"/g)?.length).toBe(2);
    expect(panel).toContain('signInUrl={loginUrl}');
    expect(panel).toContain('signUpUrl={signupUrl}');
  });
});
