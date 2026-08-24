const expectedSha = process.env.EXPECTED_DEPLOYMENT_SHA?.trim().toLowerCase();
const productionUrl = process.env.INTELLECTX_PRODUCTION_URL?.trim() || "https://intellectx-lovat.vercel.app";
const timeoutMs = Number(process.env.INTELLECTX_PRODUCTION_WAIT_MS || 600_000);
const pollMs = 15_000;

if (!expectedSha || !/^[0-9a-f]{40}$/.test(expectedSha)) {
  throw new Error("EXPECTED_DEPLOYMENT_SHA must be a 40-character Git commit SHA.");
}

const origin = new URL(productionUrl).origin;
if (origin !== "https://intellectx-lovat.vercel.app") {
  throw new Error(`Refusing to verify an unexpected production origin: ${origin}`);
}

const deadline = Date.now() + timeoutMs;
let lastObservedSha = null;
let lastStatus = null;

while (Date.now() < deadline) {
  try {
    const response = await fetch(`${origin}/api/release-health?verify=${Date.now()}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      redirect: "follow",
    });
    lastStatus = response.status;

    if (response.ok) {
      const body = await response.json();
      lastObservedSha = typeof body.commitSha === "string" ? body.commitSha.toLowerCase() : null;
      if (lastObservedSha === expectedSha) {
        console.log(`Production is READY on expected commit ${expectedSha}.`);
        process.exit(0);
      }
    }
  } catch (error) {
    console.log(`Production release-health probe is not ready yet: ${error instanceof Error ? error.message : error}`);
  }

  console.log(
    `Waiting for production SHA ${expectedSha}; last status=${lastStatus ?? "unavailable"}, last sha=${lastObservedSha ?? "unavailable"}.`,
  );
  await new Promise((resolve) => setTimeout(resolve, pollMs));
}

throw new Error(
  `Production did not reach expected SHA ${expectedSha} within ${timeoutMs}ms (last status=${lastStatus ?? "unavailable"}, last sha=${lastObservedSha ?? "unavailable"}).`,
);
