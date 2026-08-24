import { ProfileLearnerSession } from "@/components/auth/profile-learner-session";
import { MobileBuildInfoCard } from "@/components/education/mobile-build-info-card";
import { PageShell } from "@/components/education/page-shell";
import { StudyProfileCard } from "@/components/education/study-profile-card";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz Profile - IntellectX",
  description: "Manage the learner profile used by the free IntellectX quiz app.",
};

export default function MobileProfilePage() {
  return (
    <PageShell surface="mobile">
      <section className="mb-3 flex flex-col items-start gap-2">
        <Badge variant="secondary" className="uppercase">
          Profile
        </Badge>
        <h1 className="text-2xl leading-[1.08] font-medium tracking-tight">Quiz learner profile</h1>
      </section>

      <div className="grid gap-3">
        <ProfileLearnerSession />
        <StudyProfileCard />
        <MobileBuildInfoCard />
      </div>
    </PageShell>
  );
}
