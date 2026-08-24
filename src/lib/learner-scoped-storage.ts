"use client";

import { getCurrentLearnerIdentity } from "@/lib/learner-session";

const LEARNER_SCOPE_SEGMENT = "profile";

export function getLearnerScopedStorageKey(baseKey: string, userKey: string) {
  return `${baseKey}:${LEARNER_SCOPE_SEGMENT}:${encodeURIComponent(userKey)}`;
}

function getCurrentScopedKey(baseKey: string) {
  const identity = getCurrentLearnerIdentity();
  return identity ? getLearnerScopedStorageKey(baseKey, identity.userKey) : null;
}

/**
 * Resolve the storage key for the active local learner. Existing unscoped
 * values are migrated lazily into the first active learner that reads them so
 * an app update does not erase a learner's on-device progress.
 *
 * When no local learner is active we retain the legacy base key. This keeps
 * pre-session setup and pure storage tests backward compatible. Scoped values
 * are never copied back to the unscoped key.
 */
export function resolveLearnerStorageKey(baseKey: string, storage: Storage = window.localStorage) {
  const scopedKey = getCurrentScopedKey(baseKey);

  if (!scopedKey) {
    return baseKey;
  }

  if (storage.getItem(scopedKey) === null) {
    const legacyValue = storage.getItem(baseKey);
    if (legacyValue !== null) {
      storage.setItem(scopedKey, legacyValue);
      storage.removeItem(baseKey);
    }
  }

  return scopedKey;
}

export function readLearnerScopedItem(baseKey: string, storage: Storage = window.localStorage) {
  return storage.getItem(resolveLearnerStorageKey(baseKey, storage));
}

export function writeLearnerScopedItem(
  baseKey: string,
  value: string,
  storage: Storage = window.localStorage,
) {
  const key = resolveLearnerStorageKey(baseKey, storage);
  storage.setItem(key, value);
  return key;
}

export function removeLearnerScopedItem(baseKey: string, storage: Storage = window.localStorage) {
  const scopedKey = getCurrentScopedKey(baseKey);

  if (!scopedKey) {
    storage.removeItem(baseKey);
    return;
  }

  storage.removeItem(scopedKey);
  // A legacy value, if present, predates profile scoping and belongs to the
  // current profile during migration. Remove it too on an explicit clear.
  storage.removeItem(baseKey);
}
