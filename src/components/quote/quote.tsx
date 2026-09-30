import { MarketingSection } from "@/components/ui/marketing-section";

export function Quote() {
  return (
    <MarketingSection
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="scroll-mt-28 py-12"
      innerClassName="flex max-w-3xl flex-col items-center text-center"
    >
      <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.2em]">How it works</p>
      <h2
        id="how-it-works-title"
        className="mt-4 text-balance text-3xl leading-[1.08] font-semibold tracking-[-0.04em] md:text-5xl"
      >
        Learn. Test. Review. <span className="text-muted-foreground/70">Continue with a clearer next move.</span>
      </h2>
      <p className="text-muted-foreground mt-6 max-w-2xl text-sm leading-7 sm:mt-8 md:text-lg">
        Open a focused lesson, test your understanding with a related quiz, review the explanation, and use real
        learning activity to decide what to continue next.
      </p>
    </MarketingSection>
  );
}
