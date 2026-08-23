import process from "node:process";
import { pathToFileURL } from "node:url";

export const checks = [
  "NEXT_PUBLIC_CONVEX_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "CLERK_JWT_ISSUER_DOMAIN",
  "ALLOW_LOCAL_USERKEY_FALLBACK",
  "NEXT_PUBLIC_PAYMENTS_ENABLED",
];

export const criticalChecks = [
  "NEXT_PUBLIC_CONVEX_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "CLERK_JWT_ISSUER_DOMAIN",
];

function hasValue(env, name) {
  const value = env[name];
  return typeof value === "string" && value.trim().length > 0;
}

function isExplicitTrue(value) {
  return typeof value === "string" && value.trim().toLowerCase() === "true";
}

function isHttpsUrl(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function sharedSafetyErrors(env) {
  const warnings = [];
  const errors = [];

  if (isExplicitTrue(env.ALLOW_LOCAL_USERKEY_FALLBACK)) {
    warnings.push("ALLOW_LOCAL_USERKEY_FALLBACK is enabled");
    errors.push("ALLOW_LOCAL_USERKEY_FALLBACK must be unset or false for production");
  }

  if (isExplicitTrue(env.NEXT_PUBLIC_PAYMENTS_ENABLED)) {
    warnings.push("NEXT_PUBLIC_PAYMENTS_ENABLED is enabled");
    errors.push("NEXT_PUBLIC_PAYMENTS_ENABLED must remain false for the free mobile product");
  }

  if (hasValue(env, "CLERK_JWT_ISSUER_DOMAIN") && !isHttpsUrl(env.CLERK_JWT_ISSUER_DOMAIN)) {
    errors.push("CLERK_JWT_ISSUER_DOMAIN must be an https URL");
  }

  return { warnings, errors };
}

function reportFor(env, errors, warnings, mode) {
  return {
    mode,
    results: checks.map((name) => ({ name, present: hasValue(env, name) })),
    warnings,
    errors,
  };
}

export function evaluateProductionEnv(env = process.env) {
  const safety = sharedSafetyErrors(env);
  const missingCritical = criticalChecks.filter((name) => !hasValue(env, name));
  const errors = [...missingCritical.map((name) => `missing ${name}`), ...safety.errors];

  return reportFor(env, errors, safety.warnings, "full-cloud");
}

export function evaluateMobileLocalProductionEnv(env = process.env) {
  const safety = sharedSafetyErrors(env);
  const configuredCritical = criticalChecks.filter((name) => hasValue(env, name));
  const errors = [...safety.errors];

  if (configuredCritical.length > 0 && configuredCritical.length < criticalChecks.length) {
    const missing = criticalChecks.filter((name) => !hasValue(env, name));
    errors.push(
      `production auth/backend configuration must be fully configured or fully absent for local-only mobile mode; missing ${missing.join(", ")}`,
    );
  }

  return reportFor(env, errors, safety.warnings, configuredCritical.length === 0 ? "mobile-local" : "full-cloud");
}

export function printProductionEnvReport(report) {
  console.log(`Production environment mode: ${report.mode}`);

  for (const result of report.results) {
    console.log(`${result.name}: ${result.present ? "present" : "missing"}`);
  }

  if (report.mode === "full-cloud") {
    console.log("Clerk Convex JWT template: verify manually in Clerk Dashboard; expected template name is convex.");
    console.log("Trusted staff role claim paths: staff.role, metadata.role, publicMetadata.role, appMetadata.role.");
  } else {
    console.log("Local-only mobile mode: quiz grading uses the server fallback and learner state remains device-local.");
  }

  for (const warning of report.warnings) {
    console.warn(`Warning: ${warning}`);
  }
}

function main() {
  const args = new Set(process.argv.slice(2));
  const strict = args.has("--strict");
  const mobileLocal = args.has("--mobile-local");
  const report = mobileLocal ? evaluateMobileLocalProductionEnv(process.env) : evaluateProductionEnv(process.env);

  printProductionEnvReport(report);

  if (strict && report.errors.length > 0) {
    console.error(`Strict check failed: ${report.errors.join(", ")}`);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
