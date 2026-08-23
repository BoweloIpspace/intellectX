import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/health/route";

describe("health endpoint", () => {
  it("returns a cache-disabled, non-secret service status", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");

    const body = (await response.json()) as Record<string, unknown>;
    expect(body.status).toBe("ok");
    expect(body.service).toBe("intellectx-web");
    expect(typeof body.timestamp).toBe("string");
    expect(body).not.toHaveProperty("environment");
    expect(body).not.toHaveProperty("secrets");
  });
});
