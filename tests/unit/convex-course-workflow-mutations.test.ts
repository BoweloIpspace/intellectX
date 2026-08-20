import { describe, expect, it } from "vitest";

import {
  APPROVED,
  ARCHIVED,
  CHANGES_REQUESTED,
  DRAFT,
  PUBLISHED,
  SUBMITTED_FOR_REVIEW,
  UNPUBLISHED,
  assertCanApproveCourse,
  assertCanPublishCourse,
  assertCanRequestCourseChanges,
  assertCanSubmitCourseForReview,
  assertCanUnarchiveCourse,
  assertCanUnpublishCourse,
  buildCourseWorkflowAuditLog,
  resolveCourseRestoreState,
} from "../../convex/lib/courseWorkflowMutations";
import { filterLearnerVisibleCourseRecords, isLearnerVisibleCourseRecord } from "../../convex/lib/courseWorkflow";

describe("Convex course workflow transitions", () => {
  it("allows valid instructor draft to submit transitions", () => {
    expect(() => assertCanSubmitCourseForReview({ reviewStatus: DRAFT })).not.toThrow();
    expect(() => assertCanSubmitCourseForReview({ reviewStatus: CHANGES_REQUESTED })).not.toThrow();
    expect(() => assertCanSubmitCourseForReview({ reviewStatus: SUBMITTED_FOR_REVIEW })).toThrow(
      "draft or changes_requested",
    );
  });

  it("allows admin change requests and approvals only from submitted courses", () => {
    expect(() => assertCanRequestCourseChanges({ reviewStatus: SUBMITTED_FOR_REVIEW })).not.toThrow();
    expect(() => assertCanApproveCourse({ reviewStatus: SUBMITTED_FOR_REVIEW })).not.toThrow();
    expect(() => assertCanRequestCourseChanges({ reviewStatus: DRAFT })).toThrow("submitted course");
    expect(() => assertCanApproveCourse({ reviewStatus: APPROVED })).toThrow("submitted_for_review");
  });

  it("allows publishing only approved courses and unpublishing only published courses", () => {
    expect(() => assertCanPublishCourse({ reviewStatus: APPROVED })).not.toThrow();
    expect(() => assertCanPublishCourse({ reviewStatus: SUBMITTED_FOR_REVIEW })).toThrow("after approval");
    expect(() => assertCanUnpublishCourse({ publicationStatus: PUBLISHED })).not.toThrow();
    expect(() => assertCanUnpublishCourse({ publicationStatus: UNPUBLISHED })).toThrow("published courses");
  });

  it("keeps hidden workflow states out of learner visibility", () => {
    const courses = [
      { stableId: "draft", reviewStatus: DRAFT, publicationStatus: UNPUBLISHED },
      { stableId: "submitted", reviewStatus: SUBMITTED_FOR_REVIEW, publicationStatus: UNPUBLISHED },
      { stableId: "changes", reviewStatus: CHANGES_REQUESTED, publicationStatus: UNPUBLISHED },
      { stableId: "approved-hidden", reviewStatus: APPROVED, publicationStatus: UNPUBLISHED },
      { stableId: "archived", reviewStatus: ARCHIVED, publicationStatus: ARCHIVED },
      { stableId: "visible", reviewStatus: APPROVED, publicationStatus: PUBLISHED },
    ];

    expect(filterLearnerVisibleCourseRecords(courses).map((course) => course.stableId)).toEqual(["visible"]);
    expect(isLearnerVisibleCourseRecord({ stableId: "hidden", reviewStatus: APPROVED })).toBe(false);
  });
});

describe("Convex course restore (unarchive) transitions", () => {
  it("allows restoring only courses whose workflow state is fully archived", () => {
    expect(() =>
      assertCanUnarchiveCourse({ reviewStatus: ARCHIVED, publicationStatus: ARCHIVED }),
    ).not.toThrow();
    expect(() => assertCanUnarchiveCourse({ reviewStatus: DRAFT })).toThrow(
      "Only archived courses can be restored.",
    );
    expect(() => assertCanUnarchiveCourse({ reviewStatus: APPROVED })).toThrow(
      "Only archived courses can be restored.",
    );
    expect(() => assertCanUnarchiveCourse({ reviewStatus: ARCHIVED })).toThrow(
      "Only archived courses can be restored.",
    );
    expect(() => assertCanUnarchiveCourse({ reviewStatus: ARCHIVED, publicationStatus: PUBLISHED })).toThrow(
      "Only archived courses can be restored.",
    );
  });

  it("restores the exact pre-archive review and publication state from the archived audit event", () => {
    expect(
      resolveCourseRestoreState({
        before: { reviewStatus: DRAFT, publicationStatus: UNPUBLISHED },
      }),
    ).toEqual({
      reviewStatus: DRAFT,
      publicationStatus: UNPUBLISHED,
    });

    expect(
      resolveCourseRestoreState({
        before: {
          reviewStatus: CHANGES_REQUESTED,
          publicationStatus: UNPUBLISHED,
          reviewReason: "Needs citations",
        },
      }),
    ).toEqual({
      reviewStatus: CHANGES_REQUESTED,
      publicationStatus: UNPUBLISHED,
      reviewReason: "Needs citations",
    });

    expect(
      resolveCourseRestoreState({
        before: { reviewStatus: APPROVED, publicationStatus: PUBLISHED },
      }),
    ).toEqual({
      reviewStatus: APPROVED,
      publicationStatus: PUBLISHED,
    });
  });

  it("rejects restore targets that are not valid pre-archive workflow states", () => {
    expect(resolveCourseRestoreState({})).toBeNull();
    expect(resolveCourseRestoreState({ before: null })).toBeNull();
    expect(resolveCourseRestoreState({ before: {} })).toBeNull();
    expect(resolveCourseRestoreState({ before: { reviewStatus: ARCHIVED } })).toBeNull();
    expect(resolveCourseRestoreState({ before: { reviewStatus: "owner" } as never })).toBeNull();
    expect(resolveCourseRestoreState({ before: { reviewStatus: PUBLISHED } })).toBeNull();
  });

  it("defaults a missing publication status to unpublished", () => {
    expect(resolveCourseRestoreState({ before: { reviewStatus: APPROVED } })).toEqual({
      reviewStatus: APPROVED,
      publicationStatus: UNPUBLISHED,
    });
  });
});

describe("Convex course restore audit logs", () => {
  it("builds an append-only course.unarchived audit payload with before and after state", () => {
    expect(
      buildCourseWorkflowAuditLog({
        eventType: "course.unarchived",
        actorUserId: "auth:admin_1",
        actorRole: "admin",
        targetId: "course-1",
        createdAt: 999,
        before: { stableId: "course-1", reviewStatus: ARCHIVED, publicationStatus: ARCHIVED },
        after: { stableId: "course-1", reviewStatus: DRAFT, publicationStatus: UNPUBLISHED },
      }),
    ).toEqual({
      eventType: "course.unarchived",
      actorUserId: "auth:admin_1",
      actorRole: "admin",
      targetType: "course",
      targetId: "course-1",
      createdAt: 999,
      before: { stableId: "course-1", reviewStatus: ARCHIVED, publicationStatus: ARCHIVED },
      after: { stableId: "course-1", reviewStatus: DRAFT, publicationStatus: UNPUBLISHED },
    });
  });
});

describe("Convex course workflow audit logs", () => {
  it("builds workflow audit payloads with server-resolved actor fields", () => {
    expect(
      buildCourseWorkflowAuditLog({
        eventType: "course.approved",
        actorUserId: "auth:user_123",
        actorRole: "admin",
        targetId: "course-1",
        createdAt: 123,
        before: { stableId: "course-1", reviewStatus: SUBMITTED_FOR_REVIEW },
        after: { stableId: "course-1", reviewStatus: APPROVED, publicationStatus: UNPUBLISHED },
      }),
    ).toEqual({
      eventType: "course.approved",
      actorUserId: "auth:user_123",
      actorRole: "admin",
      targetType: "course",
      targetId: "course-1",
      createdAt: 123,
      before: { stableId: "course-1", reviewStatus: SUBMITTED_FOR_REVIEW },
      after: { stableId: "course-1", reviewStatus: APPROVED, publicationStatus: UNPUBLISHED },
    });
  });

  it("captures reason when present and has no client actor override input", () => {
    const auditLog = buildCourseWorkflowAuditLog({
      eventType: "course.changes_requested",
      actorUserId: "auth:admin",
      actorRole: "admin",
      targetId: "course-1",
      createdAt: 456,
      reason: "Needs citations",
    });

    expect(auditLog).toMatchObject({
      eventType: "course.changes_requested",
      actorUserId: "auth:admin",
      actorRole: "admin",
      targetType: "course",
      targetId: "course-1",
      reason: "Needs citations",
    });
    expect(auditLog).not.toHaveProperty("clientActorRole");
  });
});
