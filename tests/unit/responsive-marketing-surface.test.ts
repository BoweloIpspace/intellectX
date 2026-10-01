import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(file: string) {
  return readFileSync(path.resolve(process.cwd(), file), "utf8");
}

describe("responsive marketing surface contract", () => {
  it("uses shared responsive section and surface primitives across primary landing sections", () => {
    const features = source("src/components/features/features.tsx");
    const testimonials = source("src/components/testimonials/testimonials.tsx");
    const faqs = source("src/components/faqs/faqs.tsx");
    const quote = source("src/components/quote/quote.tsx");

    for (const file of [features, testimonials, faqs, quote]) {
      expect(file).toContain("MarketingSection");
    }

    expect(testimonials).toContain("MarketingSurface");
  });

  it("does not use the old fixed-width mobile feature carousel contract", () => {
    const carousel = source("src/components/features/features-carousel.tsx");
    const card = source("src/components/features/feature-card.tsx");

    expect(carousel).not.toContain("w-[calc(100%+3rem)]");
    expect(carousel).not.toContain("--carousel-item-width:240px");
    expect(carousel).toContain("basis-[88%]");
    expect(card).not.toContain("w-[var(--carousel-item-width)]");
    expect(card).toContain("w-full min-w-0");
  });

  it("keeps narrow mobile content fluid instead of forcing desktop widths", () => {
    const showcase = source("src/components/showcase/showcase.tsx");
    const wreath = source("src/components/showcase/wreath.tsx");
    const testimonial = source("src/components/testimonials/testimonial-card.tsx");

    expect(showcase).toContain("gap-1.5");
    expect(wreath).toContain("min-w-0");
    expect(testimonial).toContain("calc(100vw-2rem)");
  });
});
