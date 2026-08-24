"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserButton, useUser } from "@clerk/nextjs";
import { getClerkDisplayName } from "@/lib/auth-identity";
import { isClerkAuthEnabled } from "@/lib/auth-mode";
import { isMobileAppRuntime } from "@/lib/feature-scope";
import {
  clearLearnerSession,
  getLearnerSession,
  LEARNER_SESSION_CHANGE_EVENT,
  type LearnerSession,
} from "@/lib/learner-session";
import { LogOutIcon, MonitorCheckIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type ProfileLearnerSessionProps = {
  className?: string;
};

export function ProfileLearnerSession({ className }: ProfileLearnerSessionProps) {
  if (isClerkAuthEnabled()) {
    return <ClerkProfileLearnerSession className={className} />;
  }

  return <LocalProfileLearnerSession className={className} />;
}

function ClerkProfileLearnerSession({ className }: ProfileLearnerSessionProps) {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MonitorCheckIcon className="size-5" />
          Learner session
        </CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground grid gap-4 text-sm leading-6">
        {!isLoaded ? (
          <p role="status">Checking your learner session...</p>
        ) : isSignedIn && user ? (
          <>
            <div>
              <p className="text-foreground font-medium">{getClerkDisplayName(user)}</p>
              {user.primaryEmailAddress?.emailAddress ? <p>{user.primaryEmailAddress.emailAddress}</p> : null}
              <p>Account-backed session</p>
            </div>
            <div className="w-fit">
              <UserButton />
            </div>
          </>
        ) : (
          <>
            <p>No account-backed learner session is active. Login or signup will create one for this browser.</p>
            <Button asChild className="w-fit">
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function LocalProfileLearnerSession({ className }: ProfileLearnerSessionProps) {
  const [session, setSession] = useState<LearnerSession | null | undefined>(undefined);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    function syncSession() {
      setSession(getLearnerSession());
    }

    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener(LEARNER_SESSION_CHANGE_EVENT, syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(LEARNER_SESSION_CHANGE_EVENT, syncSession);
    };
  }, []);

  function goToLogin() {
    window.location.replace(isMobileAppRuntime() ? "/login" : "/");
  }

  function handleLogout() {
    // Logging out snapshots this learner's local course/profile/progress state.
    // Entering the same normalized email later restores that profile without
    // exposing it to a different local learner on the same device.
    clearLearnerSession();
    goToLogin();
  }

  function handleDeleteProfile() {
    clearLearnerSession({ deleteLocalData: true });
    goToLogin();
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MonitorCheckIcon className="size-5" />
          Learner session
        </CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground grid gap-4 text-sm leading-6">
        {session === undefined ? (
          <p role="status">Checking your learner session...</p>
        ) : session ? (
          <>
            <div>
              <p className="text-foreground font-medium">{session.name}</p>
              <p>{session.email}</p>
              <p className="capitalize">Role: {session.role}</p>
              <p className="mt-2 text-xs leading-5">
                This is a device-local profile. Logging out keeps this profile&apos;s study data isolated on this device;
                entering the same email later resumes it.
              </p>
            </div>
            <div className="grid gap-3">
              <Button type="button" variant="outline" className="w-fit" onClick={handleLogout}>
                <LogOutIcon className="size-4" />
                Logout
              </Button>

              {confirmingDelete ? (
                <div className="border-destructive/30 bg-destructive/5 grid gap-3 rounded-lg border p-4">
                  <p className="text-destructive font-medium">Delete this local profile and its study data?</p>
                  <p>
                    This removes this profile&apos;s course selection, study profile, quiz history, and lesson progress from
                    this device. Other local learner profiles are not deleted.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="destructive" onClick={handleDeleteProfile}>
                      <Trash2Icon className="size-4" />
                      Delete profile
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setConfirmingDelete(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:text-destructive w-fit"
                  onClick={() => setConfirmingDelete(true)}
                >
                  <Trash2Icon className="size-4" />
                  Delete local profile & data
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <p>No local learner session is active. Login or signup will create one on this device.</p>
            <Button asChild className="w-fit">
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
