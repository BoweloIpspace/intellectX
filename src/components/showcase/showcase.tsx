import { Wreath } from "@/components/showcase/wreath";
import { MarketingSection } from "@/components/ui/marketing-section";

export function Showcase() {
  return (
    <MarketingSection className="py-8 md:py-20" innerClassName="grid grid-cols-3 items-start gap-1.5 sm:gap-4 md:gap-12">
      <Wreath>
        <p className="text-[0.625rem] md:text-base">Learning loop</p>
        <p className="mt-1.5 text-center text-xs font-bold md:text-2xl">
          Learn
          <br />
          Test
          <br />
          Improve
        </p>
      </Wreath>
      <Wreath>
        <p className="text-[0.625rem] md:text-base">Study workspace</p>
        <p className="mt-1.5 text-center text-xs font-bold md:text-2xl">
          Courses
          <br />+
          <br />
          Quizzes
        </p>
      </Wreath>
      <Wreath>
        <p className="text-[0.625rem] md:text-base">AI support</p>
        <p className="mt-1.5 text-center text-xs font-bold text-balance md:text-2xl">
          Hint-first
          <br />
          by design
        </p>
      </Wreath>
    </MarketingSection>
  );
}
