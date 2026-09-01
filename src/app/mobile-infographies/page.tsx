import { MobileAppShell } from "@/components/education/mobile-app-shell";
import { MobileInfographies } from "@/components/education/mobile-infographies";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infographies - IntellectX",
  description: "Swipe through visual study summaries from your selected courses.",
};

export default function MobileInfographiesPage() {
  return (
    <MobileAppShell>
      <MobileInfographies />
    </MobileAppShell>
  );
}
