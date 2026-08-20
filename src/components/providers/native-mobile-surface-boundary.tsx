"use client";

import { isMobileAppRuntime, isRouteWebOnly } from "@/lib/feature-scope";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const MOBILE_HOME_ROUTE = "/mobile-study";
const LEGACY_NATIVE_ROOT_RESTORE_ROUTE = "/mobile-quizzes";

export function NativeMobileSurfaceBoundary() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isMobileAppRuntime() || !isRouteWebOnly(pathname)) {
      return;
    }

    // Preserve the existing signed-in root restoration behavior while all other
    // web-only native navigation returns to the quiz-only mobile Home surface.
    router.replace(pathname === "/" ? LEGACY_NATIVE_ROOT_RESTORE_ROUTE : MOBILE_HOME_ROUTE);
  }, [pathname, router]);

  return null;
}
