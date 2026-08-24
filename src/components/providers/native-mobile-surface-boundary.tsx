"use client";

import { MobileUpdateRequiredScreen } from "@/components/education/mobile-update-required-screen";
import { loadCourseSelection } from "@/lib/course-selection";
import { isMobileAppRuntime, isRouteWebOnly } from "@/lib/feature-scope";
import { getLearnerSession } from "@/lib/learner-session";
import { captureMobileShellVersion, isMobileShellVersionSupported } from "@/lib/mobile-runtime-version";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MOBILE_HOME_ROUTE = "/mobile-study";
const MOBILE_COURSE_SETUP_ROUTE = "/mobile-quizzes";
const MOBILE_UPDATE_REQUIRED_ROUTE = "/mobile-update-required";

export function NativeMobileSurfaceBoundary() {
  const pathname = usePathname();
  const router = useRouter();
  const [updateRequired, setUpdateRequired] = useState(false);

  useEffect(() => {
    if (!isMobileAppRuntime()) {
      setUpdateRequired(false);
      return;
    }

    const shellVersion = captureMobileShellVersion();
    const shellSupported = isMobileShellVersionSupported(shellVersion);

    if (!shellSupported) {
      setUpdateRequired(true);
      if (pathname !== MOBILE_UPDATE_REQUIRED_ROUTE) {
        router.replace(MOBILE_UPDATE_REQUIRED_ROUTE);
      }
      return;
    }

    setUpdateRequired(false);

    if (pathname === MOBILE_UPDATE_REQUIRED_ROUTE) {
      router.replace(MOBILE_HOME_ROUTE);
      return;
    }

    if (!isRouteWebOnly(pathname)) {
      return;
    }

    // Never leave the native WebView on the public web landing surface. If a
    // local learner exists but has not chosen courses yet, recover directly to
    // course setup; otherwise let mobile Home own the signed-in/out decision.
    const needsCourseSetup =
      pathname === "/" &&
      Boolean(getLearnerSession()) &&
      loadCourseSelection().selectedCourseIds.length === 0;

    router.replace(needsCourseSetup ? MOBILE_COURSE_SETUP_ROUTE : MOBILE_HOME_ROUTE);
  }, [pathname, router]);

  return updateRequired ? <MobileUpdateRequiredScreen overlay /> : null;
}
