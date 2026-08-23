"use client";

import { loadCourseSelection } from "@/lib/course-selection";
import { isMobileAppRuntime, isRouteWebOnly } from "@/lib/feature-scope";
import { getLearnerSession } from "@/lib/learner-session";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const MOBILE_HOME_ROUTE = "/mobile-study";
const MOBILE_COURSE_SETUP_ROUTE = "/mobile-quizzes";

export function NativeMobileSurfaceBoundary() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isMobileAppRuntime() || !isRouteWebOnly(pathname)) {
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

  return null;
}
