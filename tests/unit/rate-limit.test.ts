import { describe, expect, it } from "vitest";

import { evaluateFixedWindowRateLimit } from "../../convex/lib/rateLimit";

describe("fixed-window backend rate limits", () => {
  const policy = { limit: 3, windowMs: 1000 } as const;

  it("creates a new window and tracks remaining capacity", () => {
    expect(evaluateFixedWindowRateLimit(null, policy, 1000)).toEqual({
      allowed: true,
      nextState: { windowStartedAt: 1000, count: 1 },
      remaining: 2,
      retryAfterMs: 0,
    });
  });

  it("rejects requests after the limit without mutating the window state", () => {
    const decision = evaluateFixedWindowRateLimit({ windowStartedAt: 1000, count: 3 }, policy, 1500);
    expect(decision.allowed).toBe(false);
    expect(decision.nextState).toEqual({ windowStartedAt: 1000, count: 3 });
    expect(decision.remaining).toBe(0);
    expect(decision.retryAfterMs).toBe(500);
  });

  it("resets after the window expires", () => {
    expect(evaluateFixedWindowRateLimit({ windowStartedAt: 1000, count: 3 }, policy, 2000)).toEqual({
      allowed: true,
      nextState: { windowStartedAt: 2000, count: 1 },
      remaining: 2,
      retryAfterMs: 0,
    });
  });

  it("fails safe by starting a fresh window if the clock moves backwards", () => {
    expect(evaluateFixedWindowRateLimit({ windowStartedAt: 2000, count: 3 }, policy, 1500).allowed).toBe(true);
  });
});
