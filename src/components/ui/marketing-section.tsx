import { cn } from "@/lib/utils";
import type React from "react";

type MarketingSectionProps = React.ComponentProps<"section"> & {
  innerClassName?: string;
};

export function MarketingSection({ className, innerClassName, children, ...props }: MarketingSectionProps) {
  return (
    <section className={cn("w-full px-4 sm:px-6 lg:px-10", className)} {...props}>
      <div className={cn("mx-auto w-full max-w-6xl", innerClassName)}>{children}</div>
    </section>
  );
}

export function MarketingSurface({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-border/70 bg-card/80 shadow-sm backdrop-blur-xl sm:rounded-[1.75rem]",
        className,
      )}
      {...props}
    />
  );
}
