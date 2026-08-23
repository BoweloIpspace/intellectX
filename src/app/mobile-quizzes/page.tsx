import { MobileAppShell } from "@/components/education/mobile-app-shell";
import { MobileQuizzesSection } from "@/components/education/mobile-quizzes-section";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile Courses & Quizzes - IntellectX",
  description: "Choose your IntellectX courses, then practice the quizzes inside each course.",
};

export default function MobileQuizzesPage() {
  return (
    <MobileAppShell>
      <section className="mb-6 flex flex-col items-start gap-4">
        <Badge variant="secondary" className="uppercase">
          Mobile quizzes
        </Badge>
        <h1 className="text-3xl leading-[1.08] font-medium tracking-tight">Practice with focused quizzes</h1>
        <p className="text-muted-foreground text-base leading-7">
          Choose a course, open its quizzes, and review explanations as you practice.
        </p>
      </section>

      <MobileQuizzesSection />
    </MobileAppShell>
  );
}
