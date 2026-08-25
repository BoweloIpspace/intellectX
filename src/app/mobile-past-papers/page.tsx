import { MobileAppShell } from "@/components/education/mobile-app-shell";
import { MobileExamsHome } from "@/components/education/mobile-exams-home";
import { MobilePastPaperList } from "@/components/education/mobile-past-papers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exams - IntellectX",
  description: "Practice published long-form exams inside the IntellectX mobile app.",
};

type MobilePastPapersPageProps = {
  searchParams: Promise<{ course?: string }>;
};

export default async function MobilePastPapersPage({ searchParams }: MobilePastPapersPageProps) {
  const { course } = await searchParams;

  return (
    <MobileAppShell>{course ? <MobilePastPaperList courseId={course} /> : <MobileExamsHome />}</MobileAppShell>
  );
}
