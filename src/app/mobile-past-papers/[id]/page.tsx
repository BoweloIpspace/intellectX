import { MobileAppShell } from "@/components/education/mobile-app-shell";
import { MobilePastPaperRunner } from "@/components/education/mobile-past-papers";
import type { Metadata } from "next";
import styles from "./exam-diagrams.module.css";

type MobilePastPaperPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Exam - IntellectX",
  description: "Work through a long-form exam question by question in the IntellectX mobile app.",
};

export default async function MobilePastPaperPage({ params }: MobilePastPaperPageProps) {
  const { id } = await params;

  return (
    <MobileAppShell>
      <div className={styles.examSurface}>
        <MobilePastPaperRunner paperId={id} />
      </div>
    </MobileAppShell>
  );
}
