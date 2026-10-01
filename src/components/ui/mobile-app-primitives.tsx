import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";

export function MobilePageStack({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid min-w-0 gap-5", className)} {...props} />;
}

type MobilePageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function MobilePageHeader({ eyebrow, title, description, action, className }: MobilePageHeaderProps) {
  return (
    <header className={cn("min-w-0", className)}>
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow ? <Badge variant="secondary">{eyebrow}</Badge> : null}
          <h1 className={cn("text-balance text-[1.85rem] leading-[1.05] font-semibold tracking-[-0.045em]", eyebrow && "mt-3")}>
            {title}
          </h1>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {description ? (
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">{description}</p>
      ) : null}
    </header>
  );
}

export function MobileSurface({ className, ...props }: React.ComponentProps<"section">) {
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

type MobileListRowProps = React.ComponentProps<typeof Link> & {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  meta?: string;
  trailing?: React.ReactNode;
};

export function MobileListRow({
  icon: Icon,
  title,
  subtitle,
  meta,
  trailing,
  className,
  ...props
}: MobileListRowProps) {
  return (
    <Link
      className={cn(
        "flex min-h-24 min-w-0 touch-manipulation items-center gap-3 rounded-2xl border border-border/70 bg-background/72 p-4 transition active:scale-[0.99] hover:bg-secondary/45",
        className,
      )}
      {...props}
    >
      {Icon ? (
        <span className="bg-primary text-primary-foreground grid size-11 shrink-0 place-items-center rounded-2xl shadow-sm">
          <Icon className="size-5" />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-pretty font-semibold leading-5">{title}</span>
        {subtitle ? <span className="text-muted-foreground mt-1 block text-sm leading-5">{subtitle}</span> : null}
        {meta ? <span className="text-muted-foreground mt-2 block text-xs leading-5">{meta}</span> : null}
      </span>
      {trailing ? <span className="shrink-0">{trailing}</span> : null}
    </Link>
  );
}

type MobileEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function MobileEmptyState({ icon: Icon, title, description, action, className }: MobileEmptyStateProps) {
  return (
    <MobileSurface className={cn("px-5 py-7 text-center", className)}>
      <span className="bg-secondary text-foreground mx-auto grid size-12 place-items-center rounded-2xl">
        <Icon className="size-5" />
      </span>
      <h2 className="mt-4 text-xl font-semibold tracking-tight">{title}</h2>
      {description ? (
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">{description}</p>
      ) : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </MobileSurface>
  );
}

type MobileMetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  helper?: string;
};

export function MobileMetricCard({ icon: Icon, label, value, helper }: MobileMetricCardProps) {
  return (
    <MobileSurface className="p-4">
      <Icon className="size-5" />
      <p className="text-muted-foreground mt-3 text-[11px] font-semibold uppercase tracking-[0.12em]">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      {helper ? <p className="text-muted-foreground mt-1 text-xs leading-5">{helper}</p> : null}
    </MobileSurface>
  );
}
