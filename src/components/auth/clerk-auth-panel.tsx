"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { CLERK_LOGIN_REDIRECT_URL, CLERK_SIGNUP_REDIRECT_URL } from "@/lib/auth-redirects";
import { getSafeMobileReturnTo, withMobileReturnTo } from "@/lib/auth-return-route";
import { resolvePostLoginRouteFromClaims } from "@/lib/post-login-route";
import { SignIn, SignUp, useAuth } from "@clerk/nextjs";
import { SparklesIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type ClerkAuthPanelProps = {
  mode: "login" | "signup";
};

const contentByMode = {
  login: {
    eyebrow: "Account access",
    title: "Welcome back",
    description:
      "Use your IntellectX account to continue. Trusted learner, instructor, and admin roles are routed to the correct workspace after login.",
  },
  signup: {
    eyebrow: "Learner account",
    title: "Create your learner account",
    description: "Sign up, complete your study profile, then continue to your IntellectX learning experience.",
  },
} satisfies Record<ClerkAuthPanelProps["mode"], { eyebrow: string; title: string; description: string }>;

const clerkAppearance = {
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "w-full gap-0 border-0 bg-transparent p-0 shadow-none",
    header: "hidden",
    socialButtonsBlockButton:
      "h-11 rounded-lg border border-input bg-background/80 text-sm shadow-none hover:bg-secondary/70",
    dividerLine: "bg-border",
    dividerText: "text-muted-foreground text-xs",
    formFieldLabel: "text-sm font-medium text-foreground",
    formFieldInput:
      "h-11 rounded-lg border border-input bg-background/80 px-4 text-sm shadow-none outline-none focus:border-primary/50 focus:ring-ring/40 focus:ring-[3px]",
    formButtonPrimary:
      "mt-2 h-11 w-full rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-none hover:bg-primary/90",
    footerAction: "text-muted-foreground text-sm",
    footerActionLink: "text-foreground font-medium underline underline-offset-4",
    identityPreview: "rounded-lg border border-border bg-background/80",
  },
} as const;

export function ClerkAuthPanel({ mode }: ClerkAuthPanelProps) {
  const content = contentByMode[mode];
  const searchParams = useSearchParams();
  const returnTo = getSafeMobileReturnTo(searchParams.get("returnTo"));
  const loginRedirectUrl = withMobileReturnTo(CLERK_LOGIN_REDIRECT_URL, returnTo);
  const signupRedirectUrl = withMobileReturnTo(CLERK_SIGNUP_REDIRECT_URL, returnTo);
  const loginUrl = withMobileReturnTo("/login", returnTo);
  const signupUrl = withMobileReturnTo("/signup", returnTo);
  const { isLoaded, isSignedIn, sessionClaims } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    if (mode === "signup") {
      window.location.replace(signupRedirectUrl);
      return;
    }

    window.location.replace(returnTo ?? resolvePostLoginRouteFromClaims(sessionClaims));
  }, [isLoaded, isSignedIn, mode, returnTo, sessionClaims, signupRedirectUrl]);

  return (
    <Card className="border-white/70 bg-white/85 shadow-3xl backdrop-blur dark:border-white/10 dark:bg-card/85">
      <CardHeader className="gap-4">
        <div className="bg-primary/10 text-primary grid size-11 place-items-center rounded-full">
          <SparklesIcon className="size-5" />
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
        {!isLoaded || isSignedIn ? (
          <div className="flex min-h-56 items-center justify-center">
            <AppLoadingSpinner label="Checking your IntellectX session" showLabel />
          </div>
        ) : mode === "signup" ? (
          <SignUp
            appearance={clerkAppearance}
            forceRedirectUrl={signupRedirectUrl}
            fallbackRedirectUrl={signupRedirectUrl}
            signInUrl={loginUrl}
          />
        ) : (
          <SignIn
            appearance={clerkAppearance}
            forceRedirectUrl={loginRedirectUrl}
            fallbackRedirectUrl={loginRedirectUrl}
            signUpUrl={signupUrl}
          />
        )}
      </CardContent>
    </Card>
  );
}
