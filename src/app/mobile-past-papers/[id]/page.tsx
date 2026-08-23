import { MobileAppShell } from "@/components/education/mobile-app-shell";
import { MobilePastPaperRunner } from "@/components/education/mobile-past-papers";
import type { Metadata } from "next";

type MobilePastPaperPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Past Paper - IntellectX",
  description: "Work through a past paper question by question in the IntellectX mobile app.",
};

export default async function MobilePastPaperPage({ params }: MobilePastPaperPageProps) {
  const { id } = await params;

  return (
    <MobileAppShell>
      <MobilePastPaperRunner paperId={id} />
    </MobileAppShell>
  );
}
