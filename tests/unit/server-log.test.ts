import { describe, expect, it } from "vitest";

import { sanitizeServerLogFields } from "@/lib/server-log";

describe("server log sanitization", () => {
  it("redacts sensitive identity and credential fields", () => {
    expect(
      sanitizeServerLogFields({
        eventId: "evt_123",
        email: "learner@example.com",
        authToken: "secret-token",
        customerId: "ctm_123",
        count: 3,
      }),
    ).toEqual({
      eventId: "evt_123",
      email: "[redacted]",
      authToken: "[redacted]",
      customerId: "[redacted]",
      count: 3,
    });
  });
});
