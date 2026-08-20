"use client";

import { StudyProfileCard } from "@/components/education/study-profile-card";
import { useLearnerAuthRuntime } from "@/components/providers/learner-auth-runtime-provider";
import { Card, CardContent } from "@/components/ui/card";
import {
  ACADEMIC_PROFILE_CHANGE_EVENT,
  isAcademicProfileComplete,
  loadAcademicProfile,
} from "@/lib/academic-profile";
import { getSafeMobileReturnTo } from "@/lib/auth-return-route";
import { getLearnerHomeRouteForCurrentRuntime, isMobileAppRuntime } from "@/lib/feature-scope";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function LearnerOnboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = getSafeMobileReturnTo(searchParams.get("returnTo"));
  const { mode, userId } = useLearnerAuthRuntime();
  const [nativeMobile, setNativeMobile] = useState(false);
  const [profileCheckComplete, setProfileCheckComplete] = useState(false);
  const draftScope = mode === "clerk" ? userId ?? undefined : "local";

  useEffect(() => {
    setNativeMobile(isMobileAppRuntime());
  }, []);

  useEffect(() => {
    function destination() {
      return returnTo ?? getLearnerHomeRouteForCurrentRuntime();
    }

    function continueIfProfileComplete() {
      if (!isAcademicProfileComplete(loadAcademicProfile())) {
        return false;
      }

      router.replace(destination());
      return true;
    }

    if (!continueIfProfileComplete()) {
      setProfileCheckComplete(true);
    }

    function handleProfileChange() {
      continueIfProfileComplete();
    }

    window.addEventListener(ACADEMIC_PROFILE_CHANGE_EVENT, handleProfileChange);

    return () => {
      window.removeEventListener(ACADEMIC_PROFILE_CHANGE_EVENT, handleProfileChange);
    };
  }, [returnTo, router, userId]);

  function continueAfterProfile() {
    router.replace(returnTo ?? getLearnerHomeRouteForCurrentRuntime());
  }

  if (!profileCheckComplete) {
    return (
      <Card className="rounded-lg border-dashed">
        <CardContent className="text-muted-foreground py-5 text-sm" role="status" aria-live="polite">
          Checking your Study Profile…
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="rounded-lg border-dashed">
        <CardContent className="text-muted-foreground py-5 text-sm leading-6">
          {nativeMobile
            ? "Complete your Study Profile first. Then continue directly to the quiz you selected."
            : "Complete your Study Profile first. Next, continue to course selection, where the 5-course limit, 7-day grace period, and selection lock remain authoritative."}
        </CardContent>
      </Card>
      <StudyProfileCard
        showReset={false}
        submitLabel={nativeMobile && returnTo ? "Continue to quiz" : nativeMobile ? "Continue to mobile quizzes" : "Continue to course selection"}
        draftScope={draftScope}
        onSaved={continueAfterProfile}
      />
    </div>
  );
}
