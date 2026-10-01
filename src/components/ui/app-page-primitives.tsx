import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";

export function AppPageStack({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid min-w-0 gap-6", className)} {...props} />;
}

type AppPageHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  action?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function AppPageHeader({
  eyebrow,
  title,
  description,
  meta,
  action,
  align = "left",
  className,
}: AppPageHeaderProps) {
  const centered = align === "center";

  return (
    <header
      className={cn(
        "min-w-0",
        centered ? "mx-auto flex max-w-4xl flex-col items-center text-center" : "max-w-5xl",
        className,
      )}
    >
      <div
        className={cn(
          "flex min-w-0 gap-4",
          centered ? "flex-col items-center" : "flex-col lg:flex-row lg:items-end lg:justify-between",
        )}
      >
        <div className={cn("min-w-0", centered && "flex flex-col items-center")}>
          {eyebrow ? (
            <Badge variant="secondary" className="w-fit uppercase">
              {eyebrow}
            </Badge>
          ) : null}
          <h1
            className={cn(
              "text-balance text-3xl leading-[1.04] font-semibold tracking-[-0.045em] sm:text-4xl md:text-5xl lg:text-6xl",
              eyebrow && "mt-4",
            )}
          >
            {title}
          </h1>
          {description ? (
            <div className="text-muted-foreground mt-4 max-w-2xl text-sm leading-6 sm:text-base md:text-lg md:leading-7">
              {description}
            </div>
          ) : null}
          {meta ? <div className="mt-4">{meta}</div> : null}
        </div>
        {action ? <div className={cn("shrink-0", centered && "mt-2")}>{action}</div> : null}
      </div>
    </header>
  );
}

export function AppSurface({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded-2xl border border-white/65 bg-white/64 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-card/64",
        className,
      )}
      {...props}
    />
  );
}

type AppListRowProps = React.ComponentProps<typeof Link> & {
  icon?: LucideIcon;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
};

export function AppListRow({ icon: Icon, title, subtitle, trailing, className, ...props }: AppListRowProps) {
  return (
    <Link
      className={cn(
        "flex min-h-16 min-w-0 touch-manipulation items-center gap-3 rounded-xl border border-border/70 bg-background/65 p-4 transition hover:bg-secondary/50 active:scale-[0.995]",
        className,
      )}
      {...props}
    >
      {Icon ? (
        <span className="bg-secondary grid size-10 shrink-0 place-items-center rounded-xl">
          <Icon className="size-5" />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block font-medium leading-5">{title}</span>
        {subtitle ? <span className="text-muted-foreground mt-1 block text-sm leading-5">{subtitle}</span> : null}
      </span>
      {trailing ? <span className="shrink-0">{trailing}</span> : null}
    </Link>
  );
}

type AppMetricCardProps = {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  helper?: React.ReactNode;
};

export function AppMetricCard({ label, value, icon: Icon, helper }: AppMetricCardProps) {
  return (
    <AppSurface className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{value}</p>
          {helper ? <div className="text-muted-foreground mt-2 text-xs leading-5">{helper}</div> : null}
        </div>
        {Icon ? (
          <span className="bg-secondary/70 grid size-11 shrink-0 place-items-center rounded-xl">
            <Icon className="size-5" />
          </span>
        ) : null}
      </div>
    </AppSurface>
  );
}
