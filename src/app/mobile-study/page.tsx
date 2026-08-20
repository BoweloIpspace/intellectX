import { MobileAppShell } from "@/components/education/mobile-app-shell";
import { MobileStudyHome } from "@/components/education/mobile-study-home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile Quiz Home - IntellectX",
  description: "Open the free IntellectX mobile quiz experience.",
};

export default function MobileStudyPage() {
  return (
    <MobileAppShell>
      <MobileStudyHome />
    </MobileAppShell>
  );
}
