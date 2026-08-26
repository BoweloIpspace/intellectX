import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { universityModuleOptions } from "@/lib/academic-profile";

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("GIC programming pass 1", () => {
  it("uses the canonical production site configuration in legal pages", () => {
    const terms = source("src/app/(legal)/terms-and-conditions/page.tsx");
    const refunds = source("src/app/(legal)/refund-policy/page.tsx");

    for (const page of [terms, refunds]) {
      expect(page).toContain("INTELLECTX_PUBLIC_SITE_URL");
      expect(page).not.toContain("https://intellect-x-coral.vercel.app");
    }
  });

  it("offers the published UB first-year science subjects as university modules", () => {
    expect(universityModuleOptions).toContain("Biology");
    expect(universityModuleOptions).toContain("Physics");
    expect(universityModuleOptions).toContain("Chemistry");
  });

  it("fails closed instead of publishing an invalid Apple association when iOS identity is absent", () => {
    const appleAssociation = source("src/app/.well-known/apple-app-site-association/route.ts");

    expect(appleAssociation).toContain("if (!appleTeamId || !bundleId)");
    expect(appleAssociation).toContain("status: 404");
    expect(appleAssociation).not.toContain("`${appleTeamId}.${bundleId}`;\n\nexport async function GET");
  });

  it("skips manual catalog collisions instead of overwriting them during seed reconciliation", () => {
    const seed = source("convex/seed.ts");

    expect(seed).toContain("shouldUpdateSeedManagedCatalogRecord(existing)");
    expect(seed).toContain('return "skipped"');
    expect(seed).toContain("skipped: 0");
  });
});
