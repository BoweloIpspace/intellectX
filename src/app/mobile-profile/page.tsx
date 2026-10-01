import { ProfileLearnerSession } from "@/components/auth/profile-learner-session";
import { CourseSelectionCard } from "@/components/education/course-selection-card";
import { MobileBuildInfoCard } from "@/components/education/mobile-build-info-card";
import { MobileProfileStudySummary } from "@/components/education/mobile-profile-study-summary";
import { PageShell } from "@/components/education/page-shell";
import { StudyProfileCard } from "@/components/education/study-profile-card";
import { MobilePageHeader, MobilePageStack } from "@/components/ui/mobile-app-primitives";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learner Profile - IntellectX",
  description: "Manage the learner profile and study data used by the free IntellectX mobile app.",
};

export default function MobileProfilePage() {
  return (
    <PageShell surface="mobile">
      <MobilePageStack>
        <MobilePageHeader
          eyebrow="Profile"
          title="Learner profile"
          description="Set your academic track and choose the published courses that belong on your Home screen."
        />
        <div className="grid gap-3">
          <ProfileLearnerSession />
          <StudyProfileCard showSubjectPreferences={false} requireSubjectPreferences={false} />
          <CourseSelectionCard />
          <MobileProfileStudySummary />
          <MobileBuildInfoCard />
        </div>
      </MobilePageStack>
    </PageShell>
  );
}
