export type AppSurface = "web" | "mobile";

export type StudyFeature = "quizzes" | "flashcards" | "notes" | "infographies";

// Native learner navigation is intentionally limited to Home, Infographies,
// Quizzes and Exams, with Progress/Profile available from the top shortcuts.
const mobileStudyFeatures = ["quizzes", "infographies"] as const satisfies readonly StudyFeature[];

const mobileCommerceEnabled = false as const;

const mobileAllowedRoutePrefixes = [
  "/mobile-study",
  "/mobile-infographies",
  "/mobile-quizzes",
  "/mobile-past-papers",
  "/mobile-mat111-exams",
  "/mobile-progress",
  "/mobile-profile",
  "/mobile-update-required",
  "/quiz",
  "/login",
  "/signup",
  "/forgot-password",
  "/auth",
  "/onboarding",
  "/privacy-policy",
  "/terms-and-conditions",
  "/refund-policy",
] as const;

export const featureScope = {
  mobileStudyFeatures,
  mobileCommerceEnabled,
  mobileAllowedRoutePrefixes,
};

export function isMobileAppRuntime() {
  if (typeof window === "undefined") {
    return false;
  }

  const maybeWindow = window as Window & {
    Capacitor?: {
      isNativePlatform?: () => boolean;
      getPlatform?: () => string;
    };
  };

  if (maybeWindow.Capacitor?.isNativePlatform?.()) {
    return true;
  }

  const platform = maybeWindow.Capacitor?.getPlatform?.();
  return platform === "ios" || platform === "android";
}

export function getLearnerHomeRouteForCurrentRuntime() {
  return isMobileAppRuntime() ? "/mobile-study" : "/courses";
}

export function isFeatureAllowedOnSurface(feature: StudyFeature, surface: AppSurface) {
  if (surface === "web") {
    return true;
  }

  return (mobileStudyFeatures as readonly StudyFeature[]).includes(feature);
}

export function isFeatureAllowedOnMobile(feature: StudyFeature) {
  return isFeatureAllowedOnSurface(feature, "mobile");
}

export function isCommerceEnabledOnSurface(surface: AppSurface) {
  return surface === "web" ? true : mobileCommerceEnabled;
}

function matchesRoutePrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isRouteWebOnly(pathname: string) {
  const normalizedPathname = pathname === "" ? "/" : pathname;

  if (normalizedPathname === "/") {
    return true;
  }

  return !mobileAllowedRoutePrefixes.some((prefix) => matchesRoutePrefix(normalizedPathname, prefix));
}
