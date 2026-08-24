type AuthConfigEnv = Partial<Record<"CLERK_JWT_ISSUER_DOMAIN", string>>;

function parseOptionalClerkJwtIssuerDomain(env: AuthConfigEnv = process.env as AuthConfigEnv) {
  const issuer = env.CLERK_JWT_ISSUER_DOMAIN?.trim();

  if (!issuer) {
    return null;
  }

  let parsed: URL;

  try {
    parsed = new URL(issuer);
  } catch {
    throw new Error("CLERK_JWT_ISSUER_DOMAIN must be a valid https URL.");
  }

  if (parsed.protocol !== "https:") {
    throw new Error("CLERK_JWT_ISSUER_DOMAIN must be a valid https URL.");
  }

  return issuer;
}

export function requireClerkJwtIssuerDomain(env: AuthConfigEnv = process.env as AuthConfigEnv) {
  const issuer = parseOptionalClerkJwtIssuerDomain(env);

  if (!issuer) {
    throw new Error("CLERK_JWT_ISSUER_DOMAIN is required for Convex Clerk authentication.");
  }

  return issuer;
}

export function getConvexAuthProviders(env: AuthConfigEnv = process.env as AuthConfigEnv) {
  const issuer = parseOptionalClerkJwtIssuerDomain(env);

  if (!issuer) {
    return [];
  }

  return [
    {
      domain: issuer,
      applicationID: "convex",
    },
  ];
}
