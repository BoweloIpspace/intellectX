"use client";

import { enterStaffDemoAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isMobileAppRuntime } from "@/lib/feature-scope";
import { ShieldAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type DemoIdentity = "demo-admin" | "demo-instructor";

export function StaffDemoEntry() {
  const router = useRouter();
  const [busy, setBusy] = useState<DemoIdentity | null>(null);
  const [showOnThisSurface, setShowOnThisSurface] = useState(false);

  useEffect(() => {
    // Staff demo routing is a web-development convenience only. Server-rendered
    // auth pages cannot know that Capacitor is hosting them, so fail closed until
    // the client confirms this is not the native mobile runtime.
    setShowOnThisSurface(!isMobileAppRuntime());
  }, []);

  async function enterDemo(identity: DemoIdentity, destination: string) {
    setBusy(identity);
    const result = await enterStaffDemoAction(identity);

    if (result.ok) {
      router.push(destination);
    }

    setBusy(null);
  }

  if (!showOnThisSurface) {
    return null;
  }

  return (
    <Card className="rounded-lg border-dashed border-amber-500/40 bg-amber-500/5">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldAlertIcon className="size-4" />
          Staff UI demo
        </CardTitle>
        <p className="text-muted-foreground text-sm leading-6">
          Local development only. Enter the admin or instructor workspace without Clerk
          authentication. Disabled whenever Clerk is configured, in production, or inside the native mobile app.
        </p>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={busy !== null}
          onClick={() => void enterDemo("demo-admin", "/admin")}
        >
          {busy === "demo-admin" ? "Entering…" : "Demo as Admin"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={busy !== null}
          onClick={() => void enterDemo("demo-instructor", "/instructor")}
        >
          {busy === "demo-instructor" ? "Entering…" : "Demo as Instructor"}
        </Button>
      </CardContent>
    </Card>
  );
}
