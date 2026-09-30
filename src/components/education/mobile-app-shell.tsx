"use client";

import { BackgroundBlur } from "@/components/ui/background-blur";
import { cn } from "@/lib/utils";
import {
  BookOpenCheckIcon,
  FileTextIcon,
   HomeIcon,
  SparklesIcon,
  TrophyIcon,
  UserCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nativeTabs = [
  { href: "/mobile-study", label: "Home", icon: HomeIcon },
  { href: "/mobile-quizzes", label: "Quizzes", icon: BookOpenCheckIcon },
  { href: "/mobile-past-papers", label: "Exams", icon: FileTextIcon },
  { href: "/mobile-progress", label: "Progress", icon: TrophyIcon },
];

type MobileAppShellProps = {
  children: React.ReactNode;
};

function isTabActive(pathname: string, href: string) {
  if (href === "/mobile-study") {
    return pathname === href || pathname.startsWith("/mobile-study/");
  }

  if (href === "/mobile-quizzes") {
    return pathname === href || pathname.startsWith("/quiz/");
  }

  if (href === "/mobile-past-papers") {
    return pathname === href || pathname.startsWith("/mobile-past-papers/") || pathname.startsWith("/mobile-mat111-exams");
  }

  if (href === "/mobile-progress") {
    return pathname === href;
  }

  return pathname === href;
}

export function MobileAppShell({ children }: MobileAppShellProps) {
  const pathname = usePathname();
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const syncOnlineState = () => setOnline(navigator.onLine);
    syncOnlineState();
    window.addEventListener("online", syncOnlineState);
    window.addEventListener("offline", syncOnlineState);

    return () => {
      window.removeEventListener("online", syncOnlineState);
      window.removeEventListener("offline", syncOnlineState);
    };
  }, []);


  return (
    <div
      data-mobile-app-shell
      className="intellectx-native-surface relative isolate min-h-dvh overflow-x-hidden px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:px-5"
    >
      <BackgroundBlur className="-top-48" />

      <div className="relative z-20 mx-auto mb-5 flex w-full max-w-lg items-center justify-between gap-3 px-1">
        <Link href="/mobile-study" className="flex min-h-11 touch-manipulation items-center gap-2.5 text-xl font-bold tracking-[-0.045em]">
          <span className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/15">
            <SparklesIcon className="size-4.5" />
          </span>
          intellectX
        </Link>

        <div className="relative flex items-center gap-1" aria-label="Learner shortcuts">
           <Link
            href="/mobile-profile"
            aria-label="Profile"
            className={cn(
              "grid size-11 touch-manipulation place-items-center rounded-2xl border border-white/60 bg-white/55 text-foreground shadow-sm backdrop-blur-xl transition active:scale-95 dark:border-white/10 dark:bg-card/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              pathname === "/mobile-profile" && "bg-secondary",
            )}
          >
            <UserCircleIcon className="size-5.5" />
          </Link>
        </div>
      </div>

      {!online ? (
        <div
          role="status"
          data-testid="mobile-offline-banner"
          className="relative z-20 mx-auto mb-4 w-full max-w-lg rounded-2xl border border-border/70 bg-secondary/90 px-4 py-3 text-center text-sm font-medium shadow-sm backdrop-blur"
        >
          You’re offline. Saved progress stays on this device; online content may be unavailable.
        </div>
      ) : null}

      <main className="relative z-10 mx-auto w-full max-w-lg [&_[data-slot=card]]:gap-4 [&_[data-slot=card]]:py-4 [&_[data-slot=card-content]]:px-4 [&_[data-slot=card-header]]:px-4">
        {children}
      </main>

      <nav
        aria-label="Mobile study navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-white/60 bg-background/80 px-3 pt-2 pb-[calc(0.6rem+env(safe-area-inset-bottom))] shadow-[0_-18px_46px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10"
      >
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-1.5">
          {nativeTabs.map((tab) => {
            const Icon = tab.icon;
            const active = isTabActive(pathname, tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 touch-manipulation flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-semibold text-muted-foreground transition active:scale-95",
                  active && "bg-primary text-primary-foreground shadow-lg shadow-primary/10",
                )}
              >
                <Icon className="size-5" />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
