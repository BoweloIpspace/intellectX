import { MobileAppShell } from "@/components/education/mobile-app-shell";
import { MobilePastPaperList } from "@/components/education/mobile-past-papers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Past Papers - IntellectX",
  description: "Practice published past papers inside the IntellectX mobile app.",
};

type MobilePastPapersPageProps = {
  searchParams: Promise<{ course?: string }>;
};

export default async function MobilePastPapersPage({ searchParams }: MobilePastPapersPageProps) {
  const { course } = await searchParams;

  return (
    <MobileAppShell>
      <MobilePastPaperList courseId={course ?? ""} />
    </MobileAppShell>
  );
}
