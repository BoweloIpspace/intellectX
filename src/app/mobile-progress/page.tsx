import { MobileProgressContent } from "@/components/education/mobile-progress-content";
import { PageShell } from "@/components/education/page-shell";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Progress - IntellectX",
  description: "Review IntellectX mobile quiz and past-paper practice.",
};

export default function MobileProgressPage() {
  return (
    <PageShell surface="mobile">
      <section className="mb-6 flex flex-col items-start gap-4">
        <Badge variant="secondary" className="uppercase">
          Progress
        </Badge>
        <h1 className="text-3xl leading-[1.08] font-medium tracking-tight">Quiz progress</h1>
        <p className="text-muted-foreground text-base leading-7">
          Track quiz scores, past-paper completion, and the practice saved for this learner profile.
        </p>
      </section>

      <MobileProgressContent />
    </PageShell>
  );
}
