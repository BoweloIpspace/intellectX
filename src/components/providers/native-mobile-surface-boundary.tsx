"use client";

import { MobileUpdateRequiredScreen } from "@/components/education/mobile-update-required-screen";
import { isMobileAppRuntime, isRouteWebOnly } from "@/lib/feature-scope";
import { captureMobileShellVersion, isMobileShellVersionSupported } from "@/lib/mobile-runtime-version";
import { hasNativeLaunchAuthorization } from "@/lib/native-launch-auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MOBILE_HOME_ROUTE = "/mobile-study";
const MOBILE_LOGIN_ROUTE = "/login?native=1";
const MOBILE_UPDATE_REQUIRED_ROUTE = "/mobile-update-required";

function isNativeAuthRoute(pathname: string) {
  return (
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/signup" ||
    pathname.startsWith("/signup/") ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/forgot-password/") ||
    pathname === "/logout" ||
    pathname.startsWith("/auth/continue")
  );
}

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
    const launchAuthorized = hasNativeLaunchAuthorization();

    if (pathname === MOBILE_UPDATE_REQUIRED_ROUTE) {
      router.replace(launchAuthorized ? MOBILE_HOME_ROUTE : MOBILE_LOGIN_ROUTE);
      return;
    }

    if (!launchAuthorized && !isNativeAuthRoute(pathname)) {
      router.replace(MOBILE_LOGIN_ROUTE);
      return;
    }

    if (isNativeAuthRoute(pathname)) {
      return;
    }

    if (isRouteWebOnly(pathname)) {
      router.replace(MOBILE_HOME_ROUTE);
    }
  }, [pathname, router]);

  return updateRequired && pathname !== MOBILE_UPDATE_REQUIRED_ROUTE ? (
    <MobileUpdateRequiredScreen overlay />
  ) : null;
}
