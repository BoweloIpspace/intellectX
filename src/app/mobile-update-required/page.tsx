import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOBILE_MIN_SUPPORTED_SHELL_VERSION } from "@/lib/mobile-runtime-version";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update IntellectX",
  description: "Update the installed IntellectX mobile app shell to continue.",
};

export default function MobileUpdateRequiredPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-5 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">IntellectX update required</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm leading-6 text-muted-foreground">
          <p>
            This installed mobile shell is no longer compatible with the current IntellectX app. Install a current
            IntellectX build from the same trusted source you used for this app.
          </p>
          <p className="text-xs">Minimum supported mobile shell: {MOBILE_MIN_SUPPORTED_SHELL_VERSION}</p>
        </CardContent>
      </Card>
    </main>
  );
}
