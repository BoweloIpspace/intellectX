import { describe, expect, it } from "vitest";

import { buildAuthenticatedBillingUserKey } from "@/lib/billing-identity";
import { isAllowedScholarPriceId, scholarBillingProduct, scholarPriceIds } from "@/lib/billing-products";

describe("billing checkout policy", () => {
  it("builds the same authenticated learner key shape used by Convex identity", () => {
    expect(
      buildAuthenticatedBillingUserKey({
        userId: " user_123 ",
        issuer: " https://issuer.example ",
      }),
    ).toBe("auth:https://issuer.example|user_123");
  });

  it("fails closed when trusted account claims are missing", () => {
    expect(() => buildAuthenticatedBillingUserKey({ userId: null, issuer: "https://issuer.example" })).toThrow(
      "Authenticated Clerk user and issuer are required",
    );
    expect(() => buildAuthenticatedBillingUserKey({ userId: "user_123", issuer: undefined })).toThrow(
      "Authenticated Clerk user and issuer are required",
    );
  });

  it("allows exactly the Scholar price IDs that the pricing picker exposes", () => {
    for (const priceId of scholarPriceIds) {
      expect(isAllowedScholarPriceId(priceId)).toBe(true);
    }

    expect(scholarBillingProduct.productKey).toBe("intellectx.scholar");
    expect(isAllowedScholarPriceId("pri_attacker_controlled")).toBe(false);
    expect(isAllowedScholarPriceId(undefined)).toBe(false);
  });
});
