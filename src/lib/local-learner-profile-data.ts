"use client";

const PROFILE_DATA_KEYS = [
  "intellectx:course-selection",
  "intellectx:academic-profile",
  "intellectx:quiz-attempt-history",
  "intellectx:lesson-progress-history",
] as const;

const PROFILE_DATA_EVENTS = [
  "intellectx:course-selection-change",
  "intellectx:academic-profile-change",
  "intellectx-quiz-attempt-history-change",
  "intellectx-lesson-progress-history-change",
] as const;

const PROFILE_SNAPSHOT_PREFIX = "intellectx:local-profile-data:";

type LocalLearnerProfileSnapshot = Partial<Record<(typeof PROFILE_DATA_KEYS)[number], string>>;

export function getLocalLearnerProfileSnapshotKey(userKey: string) {
  return `${PROFILE_SNAPSHOT_PREFIX}${encodeURIComponent(userKey)}`;
}

function dispatchProfileDataChanged() {
  if (typeof window === "undefined") return;
  for (const eventName of PROFILE_DATA_EVENTS) {
    window.dispatchEvent(new Event(eventName));
  }
}

export function clearActiveLocalLearnerData(
  storage: Storage = window.localStorage,
  options: { dispatch?: boolean } = {},
) {
  for (const key of PROFILE_DATA_KEYS) {
    storage.removeItem(key);
  }

  if (options.dispatch !== false) {
    dispatchProfileDataChanged();
  }
}

export function saveLocalLearnerProfileData(userKey: string, storage: Storage = window.localStorage) {
  const snapshot: LocalLearnerProfileSnapshot = {};

  for (const key of PROFILE_DATA_KEYS) {
    const value = storage.getItem(key);
    if (value !== null) {
      snapshot[key] = value;
    }
  }

  storage.setItem(getLocalLearnerProfileSnapshotKey(userKey), JSON.stringify(snapshot));
  // Do not emit individual data-change events during a profile transition.
  // The learner-session change is the authoritative transition signal and
  // prevents sync components from observing cleared data under the old user.
  clearActiveLocalLearnerData(storage, { dispatch: false });
}

export function restoreLocalLearnerProfileData(userKey: string, storage: Storage = window.localStorage) {
  clearActiveLocalLearnerData(storage, { dispatch: false });
  const serialized = storage.getItem(getLocalLearnerProfileSnapshotKey(userKey));

  if (!serialized) {
    return;
  }

  try {
    const parsed = JSON.parse(serialized) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Invalid local learner profile snapshot.");
    }

    const snapshot = parsed as Record<string, unknown>;
    for (const key of PROFILE_DATA_KEYS) {
      const value = snapshot[key];
      if (typeof value === "string") {
        storage.setItem(key, value);
      }
    }
  } catch {
    storage.removeItem(getLocalLearnerProfileSnapshotKey(userKey));
  }
}

export function deleteLocalLearnerProfileData(userKey: string, storage: Storage = window.localStorage) {
  clearActiveLocalLearnerData(storage, { dispatch: false });
  storage.removeItem(getLocalLearnerProfileSnapshotKey(userKey));
}
