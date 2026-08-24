export const MOBILE_SHELL_VERSION_STORAGE_KEY = "intellectx:native-shell-version";
export const MOBILE_MIN_SUPPORTED_SHELL_VERSION = "1.0.0";

export const mobileFrontendBuildInfo = {
  version: process.env.NEXT_PUBLIC_INTELLECTX_APP_VERSION ?? "0.1.0",
  buildSha: process.env.NEXT_PUBLIC_INTELLECTX_BUILD_SHA ?? "local",
  environment: process.env.NEXT_PUBLIC_INTELLECTX_ENV ?? "development",
} as const;

function parseNumericVersion(value: string) {
  const match = value.trim().match(/^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/);
  return match ? match.slice(1, 4).map(Number) : null;
}

export function compareMobileShellVersions(left: string, right: string) {
  const leftParts = parseNumericVersion(left);
  const rightParts = parseNumericVersion(right);

  if (!leftParts || !rightParts) {
    return null;
  }

  for (let index = 0; index < 3; index += 1) {
    if (leftParts[index] !== rightParts[index]) {
      return leftParts[index] < rightParts[index] ? -1 : 1;
    }
  }

  return 0;
}

export function isMobileShellVersionSupported(version: string | null) {
  if (!version) {
    // APKs published before shell-version handshaking are treated as legacy
    // compatible for now. New builds are versioned and can be retired safely.
    return true;
  }

  const comparison = compareMobileShellVersions(version, MOBILE_MIN_SUPPORTED_SHELL_VERSION);
  return comparison === null ? false : comparison >= 0;
}

export function readStoredMobileShellVersion(storage: Storage = window.localStorage) {
  const value = storage.getItem(MOBILE_SHELL_VERSION_STORAGE_KEY)?.trim();
  return value || null;
}

export function captureMobileShellVersion(
  search: string = window.location.search,
  storage: Storage = window.localStorage,
) {
  const announcedVersion = new URLSearchParams(search).get("nativeShellVersion")?.trim() || null;

  if (announcedVersion) {
    storage.setItem(MOBILE_SHELL_VERSION_STORAGE_KEY, announcedVersion);
    return announcedVersion;
  }

  return readStoredMobileShellVersion(storage);
}
