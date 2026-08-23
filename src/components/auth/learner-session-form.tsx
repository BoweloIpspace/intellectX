"use client";

import { StudyProfileCard } from "@/components/education/study-profile-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isAcademicProfileComplete, loadAcademicProfile } from "@/lib/academic-profile";
import { getSafeMobileReturnTo, withMobileReturnTo } from "@/lib/auth-return-route";
import { getLearnerHomeRouteForCurrentRuntime, isMobileAppRuntime } from "@/lib/feature-scope";
import { createLearnerSession, getLearnerSession, type LearnerSession } from "@/lib/learner-session";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, MailIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, type InputHTMLAttributes, useEffect, useState } from "react";

type LearnerSessionMode = "login" | "signup" | "forgot-password";

type LearnerSessionFormProps = {
  mode: LearnerSessionMode;
};

const webContentByMode = {
  login: {
    eyebrow: "Learner access",
    title: "Welcome back",
    description: "Use your learner email to continue on this device.",
    submitLabel: "Continue",
  },
  signup: {
    eyebrow: "Learner profile",
    title: "Create your learner session",
    description: "Add your learner details, then complete your study profile before entering IntellectX.",
    submitLabel: "Continue to study profile",
  },
  "forgot-password": {
    eyebrow: "Local learner profile",
    title: "No password recovery is needed",
    description: "The current fallback profile is device-backed and does not verify passwords. Return to learner access to continue.",
    submitLabel: "Return to login",
  },
} satisfies Record<LearnerSessionMode, { eyebrow: string; title: string; description: string; submitLabel: string }>;

const nativeContentByMode = {
  login: {
    eyebrow: "Local learner profile",
    title: "Continue on this device",
    description:
      "Enter your learner email to continue with the profile stored on this device. The mobile local mode does not create an online account or use a password.",
    submitLabel: "Continue",
  },
  signup: {
    eyebrow: "Local learner profile",
    title: "Create a local learner profile",
    description: "Add your learner details, then choose the courses you want to practice.",
    submitLabel: "Choose courses",
  },
  "forgot-password": {
    eyebrow: "Local learner profile",
    title: "No password is required",
    description:
      "The mobile app currently uses a device-local learner profile, so there is no password to recover. Return to learner access to continue.",
    submitLabel: "Return to local profile",
  },
} satisfies Record<LearnerSessionMode, { eyebrow: string; title: string; description: string; submitLabel: string }>;

export function LearnerSessionForm({ mode }: LearnerSessionFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = getSafeMobileReturnTo(searchParams.get("returnTo"));
  const [hydrated, setHydrated] = useState(false);
  const [nativeMobile, setNativeMobile] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingSession, setPendingSession] = useState<LearnerSession | null>(null);
  const content = nativeMobile ? nativeContentByMode[mode] : webContentByMode[mode];
  const isSignup = mode === "signup";
  const isForgotPassword = mode === "forgot-password";
  const isProfileSetup = isSignup && !nativeMobile && pendingSession;
  const destination = returnTo ?? getLearnerHomeRouteForCurrentRuntime();

  useEffect(() => {
    const native = isMobileAppRuntime();
    setNativeMobile(native);

    const existingSession = getLearnerSession();
    if (!isForgotPassword && existingSession) {
      window.location.replace(returnTo ?? (native ? "/mobile-study" : getLearnerHomeRouteForCurrentRuntime()));
      return;
    }

    setHydrated(true);
  }, [isForgotPassword, returnTo]);

  useEffect(() => {
    if (!isSignup || !hydrated || nativeMobile) return;

    const existingSession = getLearnerSession();
    if (existingSession && !isAcademicProfileComplete(loadAcademicProfile())) {
      setPendingSession(existingSession);
    }
  }, [hydrated, isSignup, nativeMobile]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isForgotPassword) {
      router.replace(withMobileReturnTo("/login", returnTo));
      return;
    }

    const formData = new FormData(event.currentTarget);
    const submittedEmail = String(formData.get("email") ?? email);
    const submittedName = String(formData.get("name") ?? name);
    const normalizedEmail = submittedEmail.trim().toLowerCase();
    if (!normalizedEmail) return;

    const nextSession: LearnerSession = {
      name: isSignup ? submittedName.trim() || "Learner" : normalizedEmail.split("@")[0] || "Learner",
      email: normalizedEmail,
      role: "student",
    };

    if (isSignup) {
      if (nativeMobile) {
        createLearnerSession(nextSession);
        window.location.replace("/mobile-quizzes?setup=1");
        return;
      }

      setPendingSession(nextSession);
      return;
    }

    createLearnerSession(nextSession);
    window.location.replace(destination);
  }

  function completeWebSignup() {
    if (!pendingSession) return;

    createLearnerSession(pendingSession);
    window.location.replace(destination);
  }

  if (!hydrated) {
    return (
      <Card className="border-white/70 bg-white/85 shadow-3xl backdrop-blur dark:border-white/10 dark:bg-card/85">
        <CardContent className="flex min-h-48 items-center justify-center py-6">
          <p className="text-muted-foreground text-sm" role="status">Checking your learner session...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-4 border-white/70 bg-white/85 py-5 shadow-3xl backdrop-blur dark:border-white/10 dark:bg-card/85 sm:gap-6 sm:py-6">
      <CardHeader className="gap-3 px-5 sm:gap-4 sm:px-6">
        <div className="bg-primary/10 text-primary grid size-10 place-items-center rounded-full sm:size-11">
          {isForgotPassword ? <MailIcon className="size-5" /> : <SparklesIcon className="size-5" />}
        </div>
        <div>
          <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-[0.18em] uppercase sm:mb-3">
            {content.eyebrow}
          </p>
          <CardTitle className="text-2xl font-medium tracking-tight sm:text-3xl">{content.title}</CardTitle>
          <CardDescription className="mt-2 leading-5 sm:mt-3 sm:leading-6">{content.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-5 sm:px-6">
        {isProfileSetup ? (
          <div className="grid gap-5">
            <div className="border-primary/25 bg-primary/5 text-muted-foreground rounded-lg border border-dashed px-4 py-3 text-sm leading-6">
              Complete your study profile to continue to your quiz.
            </div>
            <StudyProfileCard
              loadSavedProfile={false}
              showReset={false}
              submitLabel="Complete signup"
              onSaved={completeWebSignup}
            />
          </div>
        ) : (
          <form className="grid gap-3 sm:gap-4" onSubmit={handleSubmit}>
            {isSignup ? (
              <AuthField label="Name" name="name" placeholder="Your name" autoComplete="name" value={name} onChange={setName} />
            ) : null}
            {!isForgotPassword ? (
              <AuthField
                label="Email"
                name="email"
                type="email"
                placeholder={nativeMobile ? "learner@example.com" : "learner@intellectx.local"}
                autoComplete="email"
                required
                value={email}
                onChange={setEmail}
              />
            ) : null}
            {!isForgotPassword && !nativeMobile ? (
              <AuthField
                label="Password"
                name="password"
                type="password"
                placeholder="Local fallback does not verify this value"
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={password}
                onChange={setPassword}
              />
            ) : null}
            <div className="border-primary/25 bg-primary/5 text-muted-foreground rounded-lg border border-dashed px-3 py-2.5 text-xs leading-5 sm:px-4 sm:py-3 sm:text-sm sm:leading-6">
              {nativeMobile
                ? "Local-only profile: no password is collected. Learner details and quiz history remain in this app's local storage until you log out, clear local data, or uninstall the app."
                : "Device-backed fallback session: learner details stay on this device. The compatibility password field is not verified or stored; production cloud authentication requires Clerk configuration."}
            </div>
            <Button type="submit" size="lg" className="mt-1 min-h-12 w-full sm:mt-2">
              {content.submitLabel}
              <ArrowRightIcon className="size-4" />
            </Button>
          </form>
        )}
        {!isProfileSetup ? <AuthFooter mode={mode} returnTo={returnTo} nativeMobile={nativeMobile} /> : null}
      </CardContent>
    </Card>
  );
}

type AuthFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "name" | "value" | "onChange">;

function AuthField({ label, name, value, onChange, ...props }: AuthFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium" htmlFor={name}>
      {label}
      <input
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "border-input bg-background/80 h-11 rounded-lg border px-4 text-sm outline-none transition-all",
          "placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-ring/40 focus:ring-[3px]",
        )}
        {...props}
      />
    </label>
  );
}

function AuthFooter({
  mode,
  returnTo,
  nativeMobile,
}: {
  mode: LearnerSessionMode;
  returnTo: string | null;
  nativeMobile: boolean;
}) {
  if (mode === "login") {
    if (nativeMobile) {
      return (
        <p className="text-muted-foreground mt-4 text-center text-sm sm:mt-6">
          Need a new local profile?{" "}
          <Link href={withMobileReturnTo("/signup", returnTo)} className="text-foreground font-medium underline underline-offset-4">
            Create one
          </Link>
        </p>
      );
    }

    return (
      <div className="text-muted-foreground mt-6 flex flex-col gap-2 text-center text-sm sm:flex-row sm:justify-between">
        <Link href={withMobileReturnTo("/forgot-password", returnTo)} className="underline underline-offset-4">
          Forgot password?
        </Link>
        <span>
          New here?{" "}
          <Link href={withMobileReturnTo("/signup", returnTo)} className="text-foreground font-medium underline underline-offset-4">
            Sign up
          </Link>
        </span>
      </div>
    );
  }

  if (mode === "signup") {
    return (
      <div className="text-muted-foreground mt-4 grid gap-2 text-center text-sm sm:mt-6">
        <p>{nativeMobile ? "After creating the local profile, choose your courses and start practicing." : "After signup, complete your study profile to continue."}</p>
        <p>
          {nativeMobile ? "Already have a local learner profile?" : "Already have a learner session?"}{" "}
          <Link href={withMobileReturnTo("/login", returnTo)} className="text-foreground font-medium underline underline-offset-4">
            {nativeMobile ? "Continue" : "Log in"}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <p className="text-muted-foreground mt-4 text-center text-sm sm:mt-6">
      <Link href={withMobileReturnTo("/login", returnTo)} className="text-foreground font-medium underline underline-offset-4">
        {nativeMobile ? "Back to local learner profile" : "Back to login"}
      </Link>
    </p>
  );
}
