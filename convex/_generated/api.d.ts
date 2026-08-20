/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as academicProfiles from "../academicProfiles.js";
import type * as adminCourses from "../adminCourses.js";
import type * as aiTutor from "../aiTutor.js";
import type * as authDiagnostics from "../authDiagnostics.js";
import type * as courseSelections from "../courseSelections.js";
import type * as courses from "../courses.js";
import type * as entitlements from "../entitlements.js";
import type * as learnerMigration from "../learnerMigration.js";
import type * as lessons from "../lessons.js";
import type * as lib_authConfigPolicy from "../lib/authConfigPolicy.js";
import type * as lib_billingLifecycle from "../lib/billingLifecycle.js";
import type * as lib_courseSelectionPolicy from "../lib/courseSelectionPolicy.js";
import type * as lib_courseWorkflow from "../lib/courseWorkflow.js";
import type * as lib_courseWorkflowMutations from "../lib/courseWorkflowMutations.js";
import type * as lib_entitlements from "../lib/entitlements.js";
import type * as lib_identity from "../lib/identity.js";
import type * as lib_instructorCourseWorkspace from "../lib/instructorCourseWorkspace.js";
import type * as lib_lessonProgressPolicy from "../lib/lessonProgressPolicy.js";
import type * as lib_migrateLearnerData from "../lib/migrateLearnerData.js";
import type * as lib_quizIntegrity from "../lib/quizIntegrity.js";
import type * as lib_seedCatalogSafety from "../lib/seedCatalogSafety.js";
import type * as lib_staffMediaPolicy from "../lib/staffMediaPolicy.js";
import type * as lib_staffRbac from "../lib/staffRbac.js";
import type * as lib_studyStats from "../lib/studyStats.js";
import type * as notes from "../notes.js";
import type * as progress from "../progress.js";
import type * as quizzes from "../quizzes.js";
import type * as seed from "../seed.js";
import type * as seedQuizAnswers from "../seedQuizAnswers.js";
import type * as staffMedia from "../staffMedia.js";
import type * as studyStats from "../studyStats.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  academicProfiles: typeof academicProfiles;
  adminCourses: typeof adminCourses;
  aiTutor: typeof aiTutor;
  authDiagnostics: typeof authDiagnostics;
  courseSelections: typeof courseSelections;
  courses: typeof courses;
  entitlements: typeof entitlements;
  learnerMigration: typeof learnerMigration;
  lessons: typeof lessons;
  "lib/authConfigPolicy": typeof lib_authConfigPolicy;
  "lib/billingLifecycle": typeof lib_billingLifecycle;
  "lib/courseSelectionPolicy": typeof lib_courseSelectionPolicy;
  "lib/courseWorkflow": typeof lib_courseWorkflow;
  "lib/courseWorkflowMutations": typeof lib_courseWorkflowMutations;
  "lib/entitlements": typeof lib_entitlements;
  "lib/identity": typeof lib_identity;
  "lib/instructorCourseWorkspace": typeof lib_instructorCourseWorkspace;
  "lib/lessonProgressPolicy": typeof lib_lessonProgressPolicy;
  "lib/migrateLearnerData": typeof lib_migrateLearnerData;
  "lib/quizIntegrity": typeof lib_quizIntegrity;
  "lib/seedCatalogSafety": typeof lib_seedCatalogSafety;
  "lib/staffMediaPolicy": typeof lib_staffMediaPolicy;
  "lib/staffRbac": typeof lib_staffRbac;
  "lib/studyStats": typeof lib_studyStats;
  notes: typeof notes;
  progress: typeof progress;
  quizzes: typeof quizzes;
  seed: typeof seed;
  seedQuizAnswers: typeof seedQuizAnswers;
  staffMedia: typeof staffMedia;
  studyStats: typeof studyStats;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
