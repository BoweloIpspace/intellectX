import { spawnSync } from "node:child_process";
import process from "node:process";

function run(command, args) {
  const executable = process.platform === "win32" && command === "npx" ? "npx.cmd" : command;
  const result = spawnSync(executable, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (process.env.CONVEX_DEPLOY_KEY?.trim()) {
  console.log("Vercel build mode: build frontend against the production Convex URL, deploy Convex, then reconcile production catalog data.");

  run("npx", [
    "convex",
    "deploy",
    "--cmd-url-env-var-name",
    "NEXT_PUBLIC_CONVEX_URL",
    "--cmd",
    "npm run build",
  ]);

  run("npx", ["convex", "run", "seed:seedEducationCatalog", '{"reset":false}', "--prod"]);
  run("npx", ["convex", "run", "seedBiologyPastPaperRelease:run", '{"reset":false}', "--prod"]);
  run("npx", ["convex", "run", "reconcileAcademicCourseTargets:reconcile", "{}", "--prod"]);
  process.exit(0);
}

console.log("Vercel build mode: frontend-only; CONVEX_DEPLOY_KEY is not configured for this deployment.");
run("npm", ["run", "build"]);
