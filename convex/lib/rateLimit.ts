import type { MutationCtx } from "../_generated/server";

export type FixedWindowRateLimitPolicy = {
  limit: number;
  windowMs: number;
};

export type FixedWindowRateLimitState = {
  windowStartedAt: number;
  count: number;
};

export type FixedWindowRateLimitDecision = {
  allowed: boolean;
  nextState: FixedWindowRateLimitState;
  remaining: number;
  retryAfterMs: number;
};

function validatePolicy(policy: FixedWindowRateLimitPolicy) {
  if (!Number.isInteger(policy.limit) || policy.limit < 1) {
    throw new Error("Rate-limit policy requires a positive integer limit.");
  }
  if (!Number.isFinite(policy.windowMs) || policy.windowMs <= 0) {
    throw new Error("Rate-limit policy requires a positive window duration.");
  }
}

export function evaluateFixedWindowRateLimit(
  state: FixedWindowRateLimitState | null | undefined,
  policy: FixedWindowRateLimitPolicy,
  now = Date.now(),
): FixedWindowRateLimitDecision {
  validatePolicy(policy);

  if (!Number.isFinite(now) || now < 0) {
    throw new Error("Rate-limit evaluation requires a valid timestamp.");
  }

  if (!state || now - state.windowStartedAt >= policy.windowMs || now < state.windowStartedAt) {
    return {
      allowed: true,
      nextState: { windowStartedAt: now, count: 1 },
      remaining: Math.max(0, policy.limit - 1),
      retryAfterMs: 0,
    };
  }

  if (state.count >= policy.limit) {
    return {
      allowed: false,
      nextState: state,
      remaining: 0,
      retryAfterMs: Math.max(1, state.windowStartedAt + policy.windowMs - now),
    };
  }

  const nextCount = state.count + 1;
  return {
    allowed: true,
    nextState: { windowStartedAt: state.windowStartedAt, count: nextCount },
    remaining: Math.max(0, policy.limit - nextCount),
    retryAfterMs: 0,
  };
}

export async function consumeFixedWindowRateLimit(
  ctx: Pick<MutationCtx, "db">,
  {
    key,
    policy,
    now = Date.now(),
  }: {
    key: string;
    policy: FixedWindowRateLimitPolicy;
    now?: number;
  },
) {
  const normalizedKey = key.trim();
  if (!normalizedKey) {
    throw new Error("Rate-limit key is required.");
  }

  const existing = await ctx.db
    .query("rateLimits")
    .withIndex("by_key", (q) => q.eq("key", normalizedKey))
    .first();

  const decision = evaluateFixedWindowRateLimit(
    existing
      ? {
          windowStartedAt: existing.windowStartedAt,
          count: existing.count,
        }
      : null,
    policy,
    now,
  );

  if (!decision.allowed) {
    throw new Error(`Rate limit exceeded. Retry after ${Math.ceil(decision.retryAfterMs / 1000)} seconds.`);
  }

  if (existing) {
    await ctx.db.patch(existing._id, {
      windowStartedAt: decision.nextState.windowStartedAt,
      count: decision.nextState.count,
      updatedAt: now,
    });
  } else {
    await ctx.db.insert("rateLimits", {
      key: normalizedKey,
      windowStartedAt: decision.nextState.windowStartedAt,
      count: decision.nextState.count,
      updatedAt: now,
    });
  }

  return {
    remaining: decision.remaining,
    windowStartedAt: decision.nextState.windowStartedAt,
  };
}
