import { describe, expect, it } from "vitest";

import {
  getConvexAuthProviders,
  requireClerkJwtIssuerDomain,
} from "../../convex/lib/authConfigPolicy";

describe("Convex auth config policy", () => {
  it("uses no auth provider when mobile production intentionally has no Clerk issuer", () => {
    expect(getConvexAuthProviders({})).toEqual([]);
  });

  it("configures Clerk when a valid issuer is provided", () => {
    expect(
      getConvexAuthProviders({
        CLERK_JWT_ISSUER_DOMAIN: "https://example.clerk.accounts.dev",
      }),
    ).toEqual([
      {
        domain: "https://example.clerk.accounts.dev",
        applicationID: "convex",
      },
    ]);
  });

  it("rejects malformed or non-https Clerk issuers", () => {
    expect(() => getConvexAuthProviders({ CLERK_JWT_ISSUER_DOMAIN: "not-a-url" })).toThrow();
    expect(() => getConvexAuthProviders({ CLERK_JWT_ISSUER_DOMAIN: "http://example.com" })).toThrow();
  });

  it("keeps the strict helper strict for code paths that require Clerk", () => {
    expect(() => requireClerkJwtIssuerDomain({})).toThrow(
      "CLERK_JWT_ISSUER_DOMAIN is required for Convex Clerk authentication.",
    );
  });
});
