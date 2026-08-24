"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MOBILE_MIN_SUPPORTED_SHELL_VERSION,
  mobileFrontendBuildInfo,
  readStoredMobileShellVersion,
} from "@/lib/mobile-runtime-version";
import { SmartphoneIcon } from "lucide-react";
import { useEffect, useState } from "react";

function shortBuildSha(value: string) {
  return value === "local" ? value : value.slice(0, 10);
}

export function MobileBuildInfoCard() {
  const [shellVersion, setShellVersion] = useState<string | null>(null);

  useEffect(() => {
    setShellVersion(readStoredMobileShellVersion());
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SmartphoneIcon className="size-5" />
          App build
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground">
        <div className="flex items-center justify-between gap-4">
          <span>Frontend</span>
          <span className="text-foreground font-medium">{mobileFrontendBuildInfo.version}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Frontend build</span>
          <span className="text-foreground font-mono text-xs">{shortBuildSha(mobileFrontendBuildInfo.buildSha)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Environment</span>
          <span className="text-foreground font-medium capitalize">{mobileFrontendBuildInfo.environment}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Mobile shell</span>
          <span className="text-foreground font-medium">{shellVersion ?? "Legacy / unknown"}</span>
        </div>
        <p className="pt-1 text-xs leading-5">
          Minimum supported shell: {MOBILE_MIN_SUPPORTED_SHELL_VERSION}. IntellectX currently uses a versioned Android
          shell that loads the production mobile frontend.
        </p>
      </CardContent>
    </Card>
  );
}
