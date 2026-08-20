"use client";

import { exitStaffDemoAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import type { StaffDemoIdentity } from "@/lib/staff-demo-access";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function StaffDemoControls({ identity }: { identity: StaffDemoIdentity }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function exitDemo() {
    setBusy(true);
    await exitStaffDemoAction();
    router.push("/login");
  }

  return (
    <div className="border-amber-500/40 bg-amber-500/10 fixed right-4 bottom-4 z-50 flex flex-wrap items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm backdrop-blur">
      <span className="font-medium">Demo mode: {identity}</span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={busy}
        onClick={() => router.push("/login")}
      >
        Switch role
      </Button>
      <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => void exitDemo()}>
        Exit demo
      </Button>
    </div>
  );
}
