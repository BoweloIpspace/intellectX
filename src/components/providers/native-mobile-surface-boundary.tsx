"use client";

import { MobileUpdateRequiredScreen } from "@/components/education/mobile-update-required-screen";
import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { isMobileAppRuntime, isRouteWebOnly } from "@/lib/feature-scope";
import { captureMobileShellVersion, isMobileShellVersionSupported } from "@/lib/mobile-runtime-version";
import { hasNativeLaunchAuthorization } from "@/lib/native-launch-auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MOBILE_HOME_ROUTE = "/mobile-study";
const MOBILE_LOGIN_ROUTE = "/login?native=1";
const MOBILE_UPDATE_REQUIRED_ROUTE = "/mobile-update-required";

type NativeRouteState = "checking" | "allowed" | "redirecting";

function isNativeAuthRoute(pathname: string) {
  return (
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/signup" ||
    pathname.startsWith("/signup/") ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/forgot-password/") ||
    pathname === "/logout" ||
    pathname.startsWith("/auth/continue") ||
    pathname === "/onboarding" ||
    pathname.startsWith("/onboarding/")
  );
}

function shouldGateMobileLearnerRoute(pathname: string) {
  if (pathname === MOBILE_UPDATE_REQUIRED_ROUTE) {
    return false;
  }

  return (
    pathname.startsWith("/mobile-") ||
    pathname === "/quiz" ||
    pathname.startsWith("/quiz/")
  );
}

type NativeMobileSurfaceBoundaryProps = {
  children: React.ReactNode;
};

export function NativeMobileSurfaceBoundary({ children }: NativeMobileSurfaceBoundaryProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [updateRequired, setUpdateRequired] = useState(false);
  const [routeState, setRouteState] = useState<NativeRouteState>(() =>
    shouldGateMobileLearnerRoute(pathname) ? "checking" : "allowed",
  );

  useEffect(() => {
    if (!isMobileAppRuntime()) {
      setUpdateRequired(false);
      setRouteState("allowed");
      return;
    }

    const shellVersion = captureMobileShellVersion();
    const shellSupported = isMobileShellVersionSupported(shellVersion);

    if (!shellSupported) {
      setUpdateRequired(true);
      setRouteState("redirecting");
      if (pathname !== MOBILE_UPDATE_REQUIRED_ROUTE) {
        router.replace(MOBILE_UPDATE_REQUIRED_ROUTE);
      }
      return;
    }

    setUpdateRequired(false);
    const launchAuthorized = hasNativeLaunchAuthorization();

    if (pathname === MOBILE_UPDATE_REQUIRED_ROUTE) {
      setRouteState("redirecting");
      router.replace(launchAuthorized ? MOBILE_HOME_ROUTE : MOBILE_LOGIN_ROUTE);
      return;
    }

    if (!launchAuthorized && !isNativeAuthRoute(pathname)) {
      setRouteState("redirecting");
      router.replace(MOBILE_LOGIN_ROUTE);
      return;
    }

    if (isNativeAuthRoute(pathname)) {
      setRouteState("allowed");
      return;
    }

    if (isRouteWebOnly(pathname)) {
      setRouteState("redirecting");
      router.replace(MOBILE_HOME_ROUTE);
      return;
    }

    setRouteState("allowed");
  }, [pathname, router]);

  if (updateRequired && pathname !== MOBILE_UPDATE_REQUIRED_ROUTE) {
    return <MobileUpdateRequiredScreen overlay />;
  }

  if (routeState !== "allowed" && shouldGateMobileLearnerRoute(pathname)) {
    return (
      <main className="grid min-h-dvh place-items-center bg-background px-6">
        <AppLoadingSpinner label="Checking app access" showLabel />
      </main>
    );
  }

  return children;
}
