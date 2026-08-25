"use client";

import { isMobileAppRuntime } from "@/lib/feature-scope";

export const NATIVE_LAUNCH_AUTH_KEY = "intellectx:native-launch-authenticated";

export function hasNativeLaunchAuthorization(storage: Storage = window.sessionStorage) {
  if (!isMobileAppRuntime()) {
    return true;
  }

  return storage.getItem(NATIVE_LAUNCH_AUTH_KEY) === "1";
}

export function authorizeNativeLaunch(storage: Storage = window.sessionStorage) {
  storage.setItem(NATIVE_LAUNCH_AUTH_KEY, "1");
}

export function clearNativeLaunchAuthorization(storage: Storage = window.sessionStorage) {
  storage.removeItem(NATIVE_LAUNCH_AUTH_KEY);
}
