import { MobileUpdateRequiredScreen } from "@/components/education/mobile-update-required-screen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update IntellectX",
  description: "Update the installed IntellectX mobile app shell to continue.",
};

export default function MobileUpdateRequiredPage() {
  return <MobileUpdateRequiredScreen />;
}
