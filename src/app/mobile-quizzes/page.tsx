import { MobileAppShell } from "@/components/education/mobile-app-shell";
import { MobileQuizzesSection } from "@/components/education/mobile-quizzes-section";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile Courses & Practice - IntellectX",
  description: "Choose your IntellectX courses, then practice available quizzes and published past papers.",
};

export default function MobileQuizzesPage() {
  return (
    <MobileAppShell>
      <section className="mb-3 flex flex-col items-start gap-2">
        <Badge variant="secondary" className="uppercase">
          Courses & practice
        </Badge>
        <h1 className="text-2xl leading-[1.08] font-medium tracking-tight">Practice quizzes and past papers</h1>
      </section>

      <div className="mobile-quizzes-flow">
        <MobileQuizzesSection />
      </div>
    </MobileAppShell>
  );
}
