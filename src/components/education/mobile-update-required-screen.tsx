import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOBILE_MIN_SUPPORTED_SHELL_VERSION } from "@/lib/mobile-runtime-version";
import { cn } from "@/lib/utils";

type MobileUpdateRequiredScreenProps = {
  overlay?: boolean;
};

export function MobileUpdateRequiredScreen({ overlay = false }: MobileUpdateRequiredScreenProps) {
  return (
    <main
      className={cn(
        "grid place-items-center bg-background px-5 py-8",
        overlay ? "fixed inset-0 z-[100] min-h-dvh" : "min-h-dvh",
      )}
      role={overlay ? "alertdialog" : undefined}
      aria-modal={overlay ? true : undefined}
      aria-labelledby="mobile-update-required-title"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle id="mobile-update-required-title" className="text-2xl tracking-tight">
            IntellectX update required
          </CardTitle>
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
