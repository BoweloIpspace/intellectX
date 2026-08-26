export async function GET() {
  const appleTeamId = process.env.APPLE_TEAM_ID?.trim();
  const bundleId = process.env.NEXT_PUBLIC_BUNDLE_IDENTIFIER?.trim();

  if (!appleTeamId || !bundleId) {
    return new Response(null, {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  const appID = `${appleTeamId}.${bundleId}`;

  return Response.json(
    {
      applinks: {
        apps: [],
        details: [
          {
            appID,
            paths: ["/checkout_redirect*"],
          },
        ],
      },
      webcredentials: {
        apps: [appID],
      },
      activitycontinuation: {
        apps: [appID],
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    },
  );
}
