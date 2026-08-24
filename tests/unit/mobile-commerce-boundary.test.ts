import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const nativeProductFiles = [
  "src/components/education/mobile-app-shell.tsx",
  "src/components/education/mobile-study-home.tsx",
  "src/components/education/mobile-quizzes-section.tsx",
  "src/components/education/mobile-past-papers.tsx",
  "src/components/education/quiz-page-content.tsx",
  "src/components/education/secure-quiz-player.tsx",
];

const forbiddenImports = [
  "@paddle/paddle-js",
  "components/checkout",
  "components/pricing",
  "lib/entitlements",
  "NEXT_PUBLIC_PAYMENTS_ENABLED",
];

const forbiddenPurchaseCopy = /\b(?:premium|upgrade|subscribe|subscription|checkout|restore purchase|restore purchases)\b/i;

describe("native mobile commerce boundary", () => {
  it("does not import payment, pricing, or entitlement code into native product entry points", () => {
    for (const relativePath of nativeProductFiles) {
      const source = readFileSync(resolve(process.cwd(), relativePath), "utf8");

      for (const forbiddenImport of forbiddenImports) {
        expect(source, `${relativePath} must not import or reference ${forbiddenImport}`).not.toContain(forbiddenImport);
      }
    }
  });

  it("does not expose purchase or premium affordances in native product entry points", () => {
    for (const relativePath of nativeProductFiles) {
      const source = readFileSync(resolve(process.cwd(), relativePath), "utf8");
      expect(source, `${relativePath} contains mobile purchase/premium copy`).not.toMatch(forbiddenPurchaseCopy);
    }
  });
});
