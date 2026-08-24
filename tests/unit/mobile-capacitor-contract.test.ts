import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(file: string) {
  return readFileSync(path.resolve(process.cwd(), file), "utf8");
}

describe("Capacitor mobile launch contract", () => {
  it("launches the production mobile surface with a versioned Android shell", () => {
    const capacitor = source("capacitor.config.ts");

    expect(capacitor).toContain('url: "https://intellectx-lovat.vercel.app"');
    expect(capacitor).toContain("nativeShellVersion");
    expect(capacitor).toContain('errorPath: "mobile-error.html"');
    expect(capacitor).not.toContain("_vercel_share");
    expect(capacitor).not.toContain("wary-meerkat-937");
  });

  it("packages a network-failure screen that retries the native Home route", () => {
    const errorPage = source("public/mobile-error.html");

    expect(errorPage).toContain("IntellectX is temporarily unavailable");
    expect(errorPage).toContain("https://intellectx-lovat.vercel.app/mobile-study");
    expect(errorPage).toContain("Try again");
  });
});
