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

  process.exit(result.status ?? 1);
}

if (process.env.CONVEX_DEPLOY_KEY?.trim()) {
  console.log("Vercel build mode: deploy Convex production backend, then build frontend with its URL.");
  run("npx", [
    "convex",
    "deploy",
    "--cmd-url-env-var-name",
    "NEXT_PUBLIC_CONVEX_URL",
    "--cmd",
    "npm run build",
  ]);
}

console.log("Vercel build mode: frontend-only; CONVEX_DEPLOY_KEY is not configured for this deployment.");
run("npm", ["run", "build"]);
