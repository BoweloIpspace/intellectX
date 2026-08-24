import { getPublicReleaseHealth } from "@/lib/release-health";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET() {
  return NextResponse.json(getPublicReleaseHealth(), {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
