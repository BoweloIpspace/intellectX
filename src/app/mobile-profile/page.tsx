import { ProfileLearnerSession } from "@/components/auth/profile-learner-session";
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
      <section className="mb-6 flex flex-col items-start gap-4">
        <Badge variant="secondary" className="uppercase">
          Profile
        </Badge>
        <h1 className="text-3xl leading-[1.08] font-medium tracking-tight">Quiz learner profile</h1>
        <p className="text-muted-foreground text-base leading-7">
          Keep your learner details current and manage the account used for quiz progress.
        </p>
      </section>

      <div className="grid gap-4">
        <StudyProfileCard />
        <ProfileLearnerSession />
      </div>
    </PageShell>
  );
}
