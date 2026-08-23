export function buildAuthenticatedBillingUserKey({
  userId,
  issuer,
}: {
  userId: string | null | undefined;
  issuer: unknown;
}) {
  const normalizedUserId = userId?.trim();
  const normalizedIssuer = typeof issuer === "string" ? issuer.trim() : "";

  if (!normalizedUserId || !normalizedIssuer) {
    throw new Error("Authenticated Clerk user and issuer are required for billing identity.");
  }

  return `auth:${normalizedIssuer}|${normalizedUserId}`;
}
