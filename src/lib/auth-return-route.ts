const SAFE_MOBILE_RETURN_PREFIXES = [
  "/mobile-study",
  "/mobile-quizzes",
  "/mobile-progress",
  "/mobile-profile",
  "/quiz/",
] as const;

export function getSafeMobileReturnTo(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  let parsed: URL;

  try {
    parsed = new URL(value, "https://intellectx.local");
  } catch {
    return null;
  }

  if (parsed.origin !== "https://intellectx.local") {
    return null;
  }

  const pathname = parsed.pathname;
  const allowed = SAFE_MOBILE_RETURN_PREFIXES.some((prefix) =>
    prefix.endsWith("/") ? pathname.startsWith(prefix) : pathname === prefix,
  );

  if (!allowed) {
    return null;
  }

  return `${pathname}${parsed.search}${parsed.hash}`;
}

export function withMobileReturnTo(pathname: string, returnTo: string | null | undefined) {
  const safeReturnTo = getSafeMobileReturnTo(returnTo);

  if (!safeReturnTo) {
    return pathname;
  }

  const separator = pathname.includes("?") ? "&" : "?";
  return `${pathname}${separator}returnTo=${encodeURIComponent(safeReturnTo)}`;
}
