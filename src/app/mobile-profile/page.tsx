import { ProfileLearnerSession } from "@/components/auth/profile-learner-session";
import { MobileBuildInfoCard } from "@/components/education/mobile-build-info-card";
import { MobileProfileStudySummary } from "@/components/education/mobile-profile-study-summary";
import { PageShell } from "@/components/education/page-shell";
import { StudyProfileCard } from "@/components/education/study-profile-card";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learner Profile - IntellectX",
  description: "Manage the learner profile and study data used by the free IntellectX mobile app.",
};

export default function MobileProfilePage() {
  return (
    <PageShell surface="mobile">
      <section className="mb-3 flex flex-col items-start gap-2">
        <Badge variant="secondary" className="uppercase">
          Profile
        </Badge>
        <h1 className="text-2xl leading-[1.08] font-medium tracking-tight">Learner profile</h1>
        <p className="text-muted-foreground text-sm leading-6">
          Review this learner&apos;s session, saved practice, study preferences, and app build information.
        </p>
      </section>

      <div className="grid gap-3">
        <ProfileLearnerSession />
        <MobileProfileStudySummary />
        <StudyProfileCard />
        <MobileBuildInfoCard />
      </div>
    </PageShell>
  );
}
