"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isMobileAppRuntime } from "@/lib/feature-scope";
import {
  ArrowRightIcon,
  BookOpenCheckIcon,
  BookOpenTextIcon,
  Layers3Icon,
  TrophyIcon,
  UserCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function MobileStudyHome() {
  const [nativeAppSurface, setNativeAppSurface] = useState(true);

  useEffect(() => {
    setNativeAppSurface(isMobileAppRuntime());
  }, []);

  if (!nativeAppSurface) {
    return <WebMobileStudyPreview />;
  }

  return (
    <>
      <section className="mb-6 flex flex-col items-start gap-4">
        <Badge variant="secondary" className="uppercase">
          Free quizzes
        </Badge>
        <h1 className="text-3xl leading-[1.08] font-medium tracking-tight">Free quiz practice</h1>
        <p className="text-muted-foreground text-base leading-7">
          IntellectX mobile is focused on one thing: helping you practice quizzes, review results, and improve over time.
        </p>
      </section>

      <section className="grid gap-3">
        <article className="animate-widget rounded-lg border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60">
          <span className="bg-primary text-primary-foreground grid size-11 place-items-center rounded-full">
            <BookOpenCheckIcon className="size-5" />
          </span>
          <h2 className="mt-5 text-xl font-semibold tracking-tight">Quiz library</h2>
          <p className="text-muted-foreground mt-3 text-sm leading-6">
            Pick a knowledge check, answer at your pace, and review explanations as you go.
          </p>
          <Button className="mt-6 min-h-12 w-full" asChild>
            <Link href="/mobile-quizzes">
              Browse quizzes
              <ArrowRightIcon />
            </Link>
          </Button>
        </article>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/mobile-progress"
            className="animate-widget rounded-lg border border-white/70 bg-white/60 p-4 shadow-sm backdrop-blur transition hover:bg-white/80 dark:border-white/10 dark:bg-card/60"
          >
            <TrophyIcon className="size-5" />
            <h2 className="mt-4 font-semibold">Progress</h2>
            <p className="text-muted-foreground mt-2 text-xs leading-5">See scores and recent attempts.</p>
          </Link>
          <Link
            href="/mobile-profile"
            className="animate-widget rounded-lg border border-white/70 bg-white/60 p-4 shadow-sm backdrop-blur transition hover:bg-white/80 dark:border-white/10 dark:bg-card/60"
          >
            <UserCircleIcon className="size-5" />
            <h2 className="mt-4 font-semibold">Profile</h2>
            <p className="text-muted-foreground mt-2 text-xs leading-5">Manage your learner profile.</p>
          </Link>
        </div>
      </section>
    </>
  );
}

function WebMobileStudyPreview() {
  const studyItems = [
    {
      title: "Quizzes",
      description: "Test recall with focused knowledge checks and clear explanations after each answer.",
      href: "/mobile-quizzes",
      cta: "Open quizzes",
      icon: BookOpenTextIcon,
    },
    {
      title: "Flashcards",
      description: "Review key lesson concepts with quick tap-to-reveal cards built for focused repetition.",
      href: "/mobile-flashcards",
      cta: "Open flashcards",
      icon: Layers3Icon,
    },
  ];

  return (
    <>
      <section className="mb-6 flex flex-col items-start gap-4">
        <Badge variant="secondary" className="uppercase">
          Mobile study
        </Badge>
        <h1 className="text-3xl leading-[1.08] font-medium tracking-tight">Free mobile study tools</h1>
        <p className="text-muted-foreground text-base leading-7">
          Browser preview tools for quizzes and flashcards. The native IntellectX app itself is quiz-only.
        </p>
      </section>

      <section className="grid gap-3">
        {studyItems.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.href}
              className="animate-widget flex min-h-56 flex-col rounded-lg border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/60"
            >
              <span className="bg-primary text-primary-foreground grid size-11 place-items-center rounded-full">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-5 text-xl font-semibold tracking-tight">{item.title}</h2>
              <p className="text-muted-foreground mt-3 flex-1 text-sm leading-6">{item.description}</p>
              <Button className="mt-6 min-h-12 w-full" asChild>
                <Link href={item.href}>{item.cta}</Link>
              </Button>
            </article>
          );
        })}
      </section>
    </>
  );
}
