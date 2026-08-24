import { beforeEach, describe, expect, it } from "vitest";

import {
  MOBILE_MIN_SUPPORTED_SHELL_VERSION,
  MOBILE_SHELL_VERSION_STORAGE_KEY,
  captureMobileShellVersion,
  compareMobileShellVersions,
  isMobileShellVersionSupported,
  readStoredMobileShellVersion,
} from "@/lib/mobile-runtime-version";

beforeEach(() => {
  localStorage.clear();
});

describe("mobile runtime version contract", () => {
  it("captures the Android shell version announced by Capacitor launch", () => {
    expect(captureMobileShellVersion("?nativeShellVersion=1.2.3")).toBe("1.2.3");
    expect(localStorage.getItem(MOBILE_SHELL_VERSION_STORAGE_KEY)).toBe("1.2.3");
    expect(readStoredMobileShellVersion()).toBe("1.2.3");
  });

  it("reuses the stored shell version after internal navigation removes the launch query", () => {
    captureMobileShellVersion("?nativeShellVersion=1.4.0");
    expect(captureMobileShellVersion("")).toBe("1.4.0");
  });

  it("compares numeric semantic shell versions", () => {
    expect(compareMobileShellVersions("1.0.0", "1.0.0")).toBe(0);
    expect(compareMobileShellVersions("1.1.0", "1.0.9")).toBe(1);
    expect(compareMobileShellVersions("0.9.9", "1.0.0")).toBe(-1);
    expect(compareMobileShellVersions("invalid", "1.0.0")).toBeNull();
  });

  it("allows legacy unknown APKs for migration but rejects known stale or malformed shells", () => {
    expect(isMobileShellVersionSupported(null)).toBe(true);
    expect(isMobileShellVersionSupported(MOBILE_MIN_SUPPORTED_SHELL_VERSION)).toBe(true);
    expect(isMobileShellVersionSupported("0.9.9")).toBe(false);
    expect(isMobileShellVersionSupported("unknown")).toBe(false);
  });
});
