"use client";

import { CourseSelectionCard } from "@/components/education/course-selection-card";
import { StudyProfileCard } from "@/components/education/study-profile-card";
import { useLearnerAuthRuntime } from "@/components/providers/learner-auth-runtime-provider";
import { Card, CardContent } from "@/components/ui/card";
import {
  ACADEMIC_PROFILE_CHANGE_EVENT,
  isAcademicProfileComplete,
  isAcademicTrackComplete,
  loadAcademicProfile,
} from "@/lib/academic-profile";
import { getSafeMobileReturnTo } from "@/lib/auth-return-route";
import { hasSelectedCourses, loadCourseSelection } from "@/lib/course-selection";
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
  const [profileComplete, setProfileComplete] = useState(false);
  const draftScope = mode === "clerk" ? userId ?? undefined : "local";

  useEffect(() => {
    const native = isMobileAppRuntime();
    setNativeMobile(native);

    function destination() {
      return returnTo ?? getLearnerHomeRouteForCurrentRuntime();
    }

    function continueIfSetupComplete() {
      const storedProfile = loadAcademicProfile();
      const complete = native ? isAcademicTrackComplete(storedProfile) : isAcademicProfileComplete(storedProfile);
      setProfileComplete(complete);

      if (!complete) {
        setProfileCheckComplete(true);
        return false;
      }

      if (native && !hasSelectedCourses(loadCourseSelection())) {
        setProfileCheckComplete(true);
        return false;
      }

      router.replace(destination());
      return true;
    }

    if (!continueIfSetupComplete()) {
      setProfileCheckComplete(true);
    }

    function handleProfileChange() {
      continueIfSetupComplete();
    }

    window.addEventListener(ACADEMIC_PROFILE_CHANGE_EVENT, handleProfileChange);

    return () => {
      window.removeEventListener(ACADEMIC_PROFILE_CHANGE_EVENT, handleProfileChange);
    };
  }, [returnTo, router, userId]);

  function continueAfterProfile() {
    if (nativeMobile) {
      setProfileComplete(true);
      return;
    }

    router.replace(returnTo ?? getLearnerHomeRouteForCurrentRuntime());
  }

  function continueAfterCourses() {
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

  if (nativeMobile && profileComplete) {
    return (
      <div className="space-y-5">
        <Card className="rounded-lg border-dashed">
          <CardContent className="text-muted-foreground py-5 text-sm leading-6">
            Choose the published courses you actually study. Nothing is selected by default, and these choices are the courses that appear on Home.
          </CardContent>
        </Card>
        <CourseSelectionCard showContinue continueLabel="Continue to Home" onContinue={continueAfterCourses} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="rounded-lg border-dashed">
        <CardContent className="text-muted-foreground py-5 text-sm leading-6">
          {nativeMobile
            ? "Set your academic track first. Course selection is the next step of this Profile setup, and only published courses are offered."
            : "Complete your Study Profile first. Your existing web subject preferences remain available here."}
        </CardContent>
      </Card>
      <StudyProfileCard
        showReset={false}
        submitLabel={nativeMobile ? "Continue to choose courses" : "Continue"}
        draftScope={draftScope}
        showSubjectPreferences={!nativeMobile}
        requireSubjectPreferences={!nativeMobile}
        onSaved={continueAfterProfile}
      />
    </div>
  );
}
