import { ConvexCoursesSection } from "@/components/education/convex-courses-section";
import { PageShell } from "@/components/education/page-shell";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses - IntellectX",
  description: "Browse IntellectX course tracks with lessons, progress, and quizzes.",
};

export default function CoursesPage() {
  return (
    <PageShell>
      <section className="mb-10 flex flex-col items-center gap-5 text-center">
        <Badge variant="secondary" className="uppercase">
          Courses
        </Badge>
        <h1 className="max-w-3xl text-4xl leading-[1.1] font-medium tracking-tight md:text-6xl">
          Choose your next intelligent learning path
        </h1>
        <p className="text-muted-foreground max-w-2xl leading-6 md:text-lg">
          Published course tracks with lesson flows, progress indicators, and quizzes built for focused study.
        </p>
      </section>
      <ConvexCoursesSection />
    </PageShell>
  );
}
