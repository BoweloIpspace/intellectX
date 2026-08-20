import { LocalQuizAverageStat } from "@/components/education/local-quiz-average-stat";
import { LocalQuizPerformance } from "@/components/education/local-quiz-performance";
import { PageShell } from "@/components/education/page-shell";
import { RecentQuizAttempts } from "@/components/education/recent-quiz-attempts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz Progress - IntellectX",
  description: "Review IntellectX mobile quiz scores and recent attempts.",
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
          Track your quiz scores and see how your recent practice is going.
        </p>
      </section>

      <div className="grid gap-4">
        <Card className="rounded-lg border-white/70 bg-white/60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
          <CardContent className="pt-6">
            <LocalQuizAverageStat />
          </CardContent>
        </Card>
        <RecentQuizAttempts />
        <LocalQuizPerformance />
      </div>
    </PageShell>
  );
}
