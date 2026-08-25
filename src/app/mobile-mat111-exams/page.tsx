import { MobileAppShell } from "@/components/education/mobile-app-shell";
import { MobileMat111ExamList } from "@/components/education/mobile-mat111-exams";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MAT111 Practice Papers - IntellectX",
  description: "Work through source-grounded MAT111 structured practice papers.",
};

export default function MobileMat111ExamsPage() {
  return (
    <MobileAppShell>
      <MobileMat111ExamList />
    </MobileAppShell>
  );
}
