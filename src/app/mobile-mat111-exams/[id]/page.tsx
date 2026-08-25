import { MobileAppShell } from "@/components/education/mobile-app-shell";
import { MobileMat111ExamRunner } from "@/components/education/mobile-mat111-exams";
import type { Metadata } from "next";

type PageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "MAT111 Practice Paper - IntellectX",
  description: "Work through a MAT111 structured practice paper question by question.",
};

export default async function MobileMat111ExamPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <MobileAppShell>
      <MobileMat111ExamRunner paperId={id} />
    </MobileAppShell>
  );
}
