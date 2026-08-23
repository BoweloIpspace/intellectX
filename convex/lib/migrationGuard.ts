export type MigrationLedgerEntry = {
  migrationKey: string;
  checksum: string;
};

export type MigrationRegistrationDecision = "apply" | "already_applied" | "checksum_mismatch";

function requireIdentifier(value: string, fieldName: string) {
  const normalized = value.trim();
  if (!normalized || normalized.length > 160 || !/^[a-zA-Z0-9._:-]+$/.test(normalized)) {
    throw new Error(`${fieldName} must be a non-empty stable identifier.`);
  }
  return normalized;
}

export function normalizeMigrationKey(value: string) {
  return requireIdentifier(value, "migrationKey");
}

export function normalizeMigrationChecksum(value: string) {
  return requireIdentifier(value, "checksum");
}

export function normalizeMigrationRegistration(migrationKey: string, checksum: string): MigrationLedgerEntry {
  return {
    migrationKey: normalizeMigrationKey(migrationKey),
    checksum: normalizeMigrationChecksum(checksum),
  };
}

export function decideMigrationRegistration(
  existing: MigrationLedgerEntry | null | undefined,
  incoming: MigrationLedgerEntry,
): MigrationRegistrationDecision {
  if (!existing) return "apply";
  if (existing.checksum === incoming.checksum) return "already_applied";
  return "checksum_mismatch";
}
