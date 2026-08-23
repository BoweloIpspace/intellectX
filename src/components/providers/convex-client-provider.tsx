"use client";

import {
  ClerkLearnerAuthRuntimeProvider,
  LocalLearnerAuthRuntimeProvider,
} from "@/components/providers/learner-auth-runtime-provider";
import { getAuthEnvironmentStatus } from "@/lib/auth-env";
import { convexEnv } from "@/lib/education-data";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useMemo } from "react";

type ConvexClientProviderProps = {
  children: React.ReactNode;
};

function useLocalConvexAuth() {
  return useMemo(
    () => ({
      isLoading: false,
      isAuthenticated: false,
      fetchAccessToken: async () => null,
    }),
    [],
  );
}

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  const convexUrl = convexEnv.url;
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const authEnvironment = getAuthEnvironmentStatus();
  const client = useMemo(() => (convexUrl ? new ConvexReactClient(convexUrl) : null), [convexUrl]);

  if (!client) {
    if (!authEnvironment.clerkPublishableKeyPresent || !clerkPublishableKey) {
      return <LocalLearnerAuthRuntimeProvider>{children}</LocalLearnerAuthRuntimeProvider>;
    }

    return (
      <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/">
        <ClerkLearnerAuthRuntimeProvider>{children}</ClerkLearnerAuthRuntimeProvider>
      </ClerkProvider>
    );
  }

  if (!authEnvironment.clerkPublishableKeyPresent || !clerkPublishableKey) {
    return (
      <ConvexProviderWithAuth client={client} useAuth={useLocalConvexAuth}>
        <LocalLearnerAuthRuntimeProvider>{children}</LocalLearnerAuthRuntimeProvider>
      </ConvexProviderWithAuth>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/">
      <ClerkLearnerAuthRuntimeProvider>
        <ConvexProviderWithClerk client={client} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ClerkLearnerAuthRuntimeProvider>
    </ClerkProvider>
  );
}
