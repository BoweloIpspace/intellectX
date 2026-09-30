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
      "min-h-12 rounded-xl border border-input/80 bg-background/90 text-sm shadow-none hover:bg-secondary/70 active:scale-[0.99]",
    dividerLine: "bg-border",
    dividerText: "text-muted-foreground text-xs",
    formFieldLabel: "text-sm font-medium text-foreground",
    formFieldInput:
      "min-h-12 rounded-xl border border-input/80 bg-background/90 px-4 text-base shadow-none outline-none focus:border-accent/60 focus:ring-accent/20 focus:ring-[3px]",
    formButtonPrimary:
      "mt-2 min-h-12 w-full rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/10 hover:bg-primary/90 active:scale-[0.99]",
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
    <Card className="overflow-hidden rounded-[1.75rem] border-white/70 bg-white/88 shadow-3xl backdrop-blur-xl dark:border-white/10 dark:bg-card/88">
      <CardHeader className="gap-4 px-5 pt-6 sm:px-7 sm:pt-7">
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
      <CardContent className="px-5 pb-6 sm:px-7 sm:pb-7">
        {!isLoaded || isSignedIn ? (
          <div className="flex min-h-56 items-center justify-center">
            <AppLoadingSpinner label="Checking your IntellectX session" showLabel />
          </div>
        ) : mode === "signup" ? (
          <SignUp
            appearance={clerkAppearance}
            oauthFlow="redirect"
            forceRedirectUrl={signupRedirectUrl}
            fallbackRedirectUrl={signupRedirectUrl}
            signInUrl={loginUrl}
          />
        ) : (
          <SignIn
            appearance={clerkAppearance}
            oauthFlow="redirect"
            forceRedirectUrl={loginRedirectUrl}
            fallbackRedirectUrl={loginRedirectUrl}
            signUpUrl={signupUrl}
          />
        )}
      </CardContent>
    </Card>
  );
}
