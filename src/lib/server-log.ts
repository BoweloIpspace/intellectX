type ServerLogLevel = "info" | "warn" | "error";
type ServerLogValue = string | number | boolean | null | undefined;
type ServerLogFields = Record<string, ServerLogValue>;

const sensitiveFieldPattern = /(authorization|cookie|email|password|secret|token|userkey|customer)/i;

export function sanitizeServerLogFields(fields: ServerLogFields = {}) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, sensitiveFieldPattern.test(key) ? "[redacted]" : value]),
  );
}

export function writeServerLog(level: ServerLogLevel, event: string, fields: ServerLogFields = {}) {
  const entry = JSON.stringify({
    level,
    event,
    timestamp: new Date().toISOString(),
    ...sanitizeServerLogFields(fields),
  });

  if (level === "error") {
    console.error(entry);
  } else if (level === "warn") {
    console.warn(entry);
  } else {
    console.info(entry);
  }
}
