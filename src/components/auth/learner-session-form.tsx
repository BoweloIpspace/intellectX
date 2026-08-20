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
    description:
      "Add your learner details, then complete your study profile. This profile and quiz progress stay on this device unless cloud services are configured later.",
    submitLabel: "Continue to study profile",
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
  const isProfileSetup = isSignup && pendingSession;
  const destination = returnTo ?? getLearnerHomeRouteForCurrentRuntime();

  useEffect(() => {
    setNativeMobile(isMobileAppRuntime());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!isSignup) return;

    const existingSession = getLearnerSession();
    if (existingSession && !isAcademicProfileComplete(loadAcademicProfile())) {
      setPendingSession(existingSession);
    }
  }, [isSignup]);

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
      setPendingSession(nextSession);
      return;
    }

    createLearnerSession(nextSession);
    window.location.replace(destination);
  }

  function completeSignup() {
    if (!pendingSession) return;

    createLearnerSession(pendingSession);
    window.location.replace(destination);
  }

  return (
    <Card className="border-white/70 bg-white/85 shadow-3xl backdrop-blur dark:border-white/10 dark:bg-card/85">
      <CardHeader className="gap-4">
        <div className="bg-primary/10 text-primary grid size-11 place-items-center rounded-full">
          {isForgotPassword ? <MailIcon className="size-5" /> : <SparklesIcon className="size-5" />}
        </div>
        <div>
          <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-[0.18em] uppercase">
            {content.eyebrow}
          </p>
          <CardTitle className="text-3xl font-medium tracking-tight">{content.title}</CardTitle>
          <CardDescription className="mt-3 leading-6">{content.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isProfileSetup ? (
          <div className="grid gap-5">
            <div className="border-primary/25 bg-primary/5 text-muted-foreground rounded-lg border border-dashed px-4 py-3 text-sm leading-6">
              Complete your study profile to continue to your quiz.
            </div>
            <StudyProfileCard
              loadSavedProfile={false}
              showReset={false}
              submitLabel={nativeMobile ? "Complete profile" : "Complete signup"}
              onSaved={completeSignup}
            />
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={handleSubmit}>
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
            <div className="border-primary/25 bg-primary/5 text-muted-foreground rounded-lg border border-dashed px-4 py-3 text-sm leading-6">
              {nativeMobile
                ? "Local-only profile: no password is collected. Learner details and quiz history remain in this app's local storage until you log out, clear local data, or uninstall the app."
                : "Device-backed fallback session: learner details stay on this device. The compatibility password field is not verified or stored; production cloud authentication requires Clerk configuration."}
            </div>
            <Button type="submit" size="lg" className="mt-2 w-full" disabled={!hydrated}>
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
        <p className="text-muted-foreground mt-6 text-center text-sm">
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
      <div className="text-muted-foreground mt-6 grid gap-2 text-center text-sm">
        <p>{nativeMobile ? "After creating the local profile, complete your study profile to continue." : "After signup, complete your study profile to continue."}</p>
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
    <p className="text-muted-foreground mt-6 text-center text-sm">
      <Link href={withMobileReturnTo("/login", returnTo)} className="text-foreground font-medium underline underline-offset-4">
        {nativeMobile ? "Back to local learner profile" : "Back to login"}
      </Link>
    </p>
  );
}
