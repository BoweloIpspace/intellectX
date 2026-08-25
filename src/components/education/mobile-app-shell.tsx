"use client";

import { BackgroundBlur } from "@/components/ui/background-blur";
import { isMobileAppRuntime } from "@/lib/feature-scope";
import { cn } from "@/lib/utils";
import {
  BellIcon,
  BookOpenCheckIcon,
  FileTextIcon,
  GalleryVerticalEndIcon,
  HomeIcon,
  TrophyIcon,
  UserCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nativeTabs = [
  { href: "/mobile-study", label: "Home", icon: HomeIcon },
  { href: "/mobile-infographies", label: "Infographies", icon: GalleryVerticalEndIcon },
  { href: "/mobile-quizzes", label: "Quizzes", icon: BookOpenCheckIcon },
  { href: "/mobile-past-papers", label: "Exams", icon: FileTextIcon },
];

const webPreviewTabs = nativeTabs;

type MobileAppShellProps = {
  children: React.ReactNode;
};

function isTabActive(pathname: string, href: string) {
  if (href === "/mobile-quizzes") {
    return pathname === href || pathname.startsWith("/quiz/");
  }

  if (href === "/mobile-past-papers") {
    return pathname === href || pathname.startsWith("/mobile-past-papers/");
  }

  return pathname === href;
}

export function MobileAppShell({ children }: MobileAppShellProps) {
  const pathname = usePathname();
  const [nativeAppSurface, setNativeAppSurface] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    setNativeAppSurface(isMobileAppRuntime());
  }, []);

  const tabs = nativeAppSurface ? nativeTabs : webPreviewTabs;

  return (
    <div
      data-mobile-app-shell
      className="relative isolate min-h-dvh overflow-x-hidden bg-background px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-[calc(6.25rem+env(safe-area-inset-bottom))]"
    >
      <BackgroundBlur className="-top-48" />

      <div className="relative z-20 mx-auto mb-5 flex w-full max-w-md items-center justify-between gap-3 px-1">
        <Link href="/mobile-study" className="min-h-10 content-center text-xl font-semibold tracking-[-0.04em]">
          intellectX
        </Link>

        <div className="relative flex items-center gap-1" aria-label="Learner shortcuts">
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() => setNotificationsOpen((open) => !open)}
            className="grid size-10 place-items-center rounded-full text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BellIcon className="size-5" />
          </button>
          <Link
            href="/mobile-progress"
            aria-label="Progress"
            className={cn(
              "grid size-10 place-items-center rounded-full text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              pathname === "/mobile-progress" && "bg-secondary",
            )}
          >
            <TrophyIcon className="size-5" />
          </Link>
          <Link
            href="/mobile-profile"
            aria-label="Profile"
            className={cn(
              "grid size-10 place-items-center rounded-full text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              pathname === "/mobile-profile" && "bg-secondary",
            )}
          >
            <UserCircleIcon className="size-5" />
          </Link>

          {notificationsOpen ? (
            <div className="absolute right-0 top-12 z-40 w-64 rounded-2xl border border-border/70 bg-background/95 p-4 shadow-xl backdrop-blur">
              <p className="text-sm font-semibold">Notifications</p>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">No new notifications.</p>
            </div>
          ) : null}
        </div>
      </div>

      <main className="relative z-10 mx-auto w-full max-w-md [&_[data-slot=card]]:gap-4 [&_[data-slot=card]]:py-4 [&_[data-slot=card-content]]:px-4 [&_[data-slot=card-header]]:px-4">
        {children}
      </main>

      <nav
        aria-label="Mobile study navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-white/70 bg-background/92 px-3 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-18px_40px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isTabActive(pathname, tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 touch-manipulation flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium text-muted-foreground transition sm:text-[11px]",
                  active && "bg-primary text-primary-foreground",
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
