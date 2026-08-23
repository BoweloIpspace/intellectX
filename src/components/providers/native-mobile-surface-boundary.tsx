"use client";

import { isMobileAppRuntime, isRouteWebOnly } from "@/lib/feature-scope";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const MOBILE_HOME_ROUTE = "/mobile-study";

export function NativeMobileSurfaceBoundary() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isMobileAppRuntime() || !isRouteWebOnly(pathname)) {
      return;
    }

    // Never restore a native WebView onto the public web landing page. The
    // mobile Home route owns the signed-in/signed-out decision and redirects
    // unauthenticated learners straight to Login.
    router.replace(MOBILE_HOME_ROUTE);
  }, [pathname, router]);

  return null;
}
