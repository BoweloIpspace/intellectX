import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PLATFORM_PERMISSIONS = new Set(["android.permission.INTERNET"]);
const ANDROIDX_PRIVATE_RECEIVER_PERMISSION = "com.intellectx.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION";
const ALLOWED_USES_PERMISSIONS = new Set([...PLATFORM_PERMISSIONS, ANDROIDX_PRIVATE_RECEIVER_PERMISSION]);

function fail(message) {
  throw new Error(`Android manifest policy violation: ${message}`);
}

function requireAttribute(tag, name, expected) {
  const expression = new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`);
  const value = tag.match(expression)?.[1];
  if (value !== expected) {
    fail(`${name} must be ${expected}; received ${value ?? "missing"}.`);
  }
}

export function inspectAndroidManifest(xml) {
  const permissions = [
    ...xml.matchAll(/<uses-permission(?:-sdk-\d+)?\b[^>]*\bandroid:name\s*=\s*["']([^"']+)["'][^>]*>/g),
  ].map((match) => match[1]);
  const uniquePermissions = [...new Set(permissions)].sort();

  if (!uniquePermissions.includes("android.permission.INTERNET")) {
    fail("android.permission.INTERNET is required for the production remote WebView.");
  }

  const unexpectedPermissions = uniquePermissions.filter((permission) => !ALLOWED_USES_PERMISSIONS.has(permission));
  if (unexpectedPermissions.length > 0) {
    fail(`unexpected permission(s): ${unexpectedPermissions.join(", ")}.`);
  }

  if (uniquePermissions.includes(ANDROIDX_PRIVATE_RECEIVER_PERMISSION)) {
    const permissionDeclarations = [...xml.matchAll(/<permission\b[^>]*>/g)].map((match) => match[0]);
    const privateReceiverDeclaration = permissionDeclarations.find((tag) =>
      new RegExp(
        `android:name\\s*=\\s*["']${ANDROIDX_PRIVATE_RECEIVER_PERMISSION.replaceAll(".", "\\.")}["']`,
      ).test(tag),
    );
    if (!privateReceiverDeclaration) {
      fail(`${ANDROIDX_PRIVATE_RECEIVER_PERMISSION} must have an explicit permission declaration.`);
    }
    requireAttribute(privateReceiverDeclaration, "android:protectionLevel", "signature");
  }

  const applicationTag = xml.match(/<application\b[^>]*>/)?.[0];
  if (!applicationTag) {
    fail("application element is missing.");
  }
  requireAttribute(applicationTag, "android:allowBackup", "false");
  requireAttribute(applicationTag, "android:usesCleartextTraffic", "false");
  requireAttribute(applicationTag, "android:networkSecurityConfig", "@xml/network_security_config");

  const activityTags = [...xml.matchAll(/<activity\b[^>]*>/g)].map((match) => match[0]);
  const mainActivity = activityTags.find(
    (tag) =>
      /android:name\s*=\s*["'](?:\.MainActivity|com\.intellectx\.app\.MainActivity)["']/.test(tag),
  );
  if (!mainActivity) {
    fail("MainActivity declaration is missing.");
  }
  requireAttribute(mainActivity, "android:exported", "true");

  const providerTags = [...xml.matchAll(/<provider\b[^>]*>/g)].map((match) => match[0]);
  const fileProvider = providerTags.find((tag) =>
    /android:name\s*=\s*["']androidx\.core\.content\.FileProvider["']/.test(tag),
  );
  if (!fileProvider) {
    fail("FileProvider declaration is missing.");
  }
  requireAttribute(fileProvider, "android:exported", "false");

  return { permissions: uniquePermissions };
}

export function checkAndroidManifestFile(manifestPath) {
  const absolutePath = resolve(process.cwd(), manifestPath);
  const result = inspectAndroidManifest(readFileSync(absolutePath, "utf8"));
  return { manifestPath: absolutePath, ...result };
}

if (process.argv[1]?.endsWith("check-android-manifest.mjs")) {
  try {
    const manifestPath = process.argv[2] ?? "android/app/src/main/AndroidManifest.xml";
    const result = checkAndroidManifestFile(manifestPath);
    console.log(`Android manifest policy verified: ${result.manifestPath}`);
    console.log(`Permissions: ${result.permissions.join(", ")}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
