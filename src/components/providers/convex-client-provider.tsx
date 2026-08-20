"use client";

import {
  ClerkLearnerAuthRuntimeProvider,
  LocalLearnerAuthRuntimeProvider,
} from "@/components/providers/learner-auth-runtime-provider";
import { getAuthEnvironmentStatus } from "@/lib/auth-env";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useMemo } from "react";

type ConvexClientProviderProps = {
  children: React.ReactNode;
};

/**
 * Local-fallback Convex auth adapter. There is no Clerk identity in
 * local-fallback mode, so Convex must never receive an access token. This
 * keeps `useConvexAuth` consumers (staff workspaces) behaving like a signed-out
 * client and failing closed instead of crashing on a missing auth provider.
 */
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
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
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
