import { ClerkAuthPanel } from "@/components/auth/clerk-auth-panel";
import { LearnerSessionForm } from "@/components/auth/learner-session-form";
import { Footer } from "@/components/footer/footer";
import { Nav } from "@/components/hero/nav";
import { BackgroundBlur } from "@/components/ui/background-blur";
import { isClerkAuthEnabled } from "@/lib/auth-mode";

type AuthPageShellProps = {
  mode: "login" | "signup" | "forgot-password";
  demoEntry?: React.ReactNode;
};

export function AuthPageShell({ mode, demoEntry }: AuthPageShellProps) {
  const clerkAuthEnabled = isClerkAuthEnabled();
  const authPanel =
    clerkAuthEnabled && mode !== "forgot-password" ? (
      <ClerkAuthPanel mode={mode} />
    ) : (
      <LearnerSessionForm mode={mode} />
    );
  const shellCopy = clerkAuthEnabled
    ? {
        title: mode === "login" ? "Secure access for every IntellectX role." : "Learner access for your account.",
        description:
          mode === "login"
            ? "Sign in once. Trusted Clerk claims route learners, instructors, and admins without exposing a client-side role switch."
            : "Sign in to load your IntellectX courses, progress, quizzes, and study profile through your account-backed learner session.",
      }
    : {
        title: "Learner access for this browser.",
        description:
          "These pages create a learner session stored on this device while account-level persistence is being completed. Session details can be cleared from the profile page.",
      };

  return (
    <>
      <div className="relative isolate min-h-dvh overflow-hidden px-4 pt-24 pb-6 sm:px-6 lg:px-10 lg:pt-28 lg:pb-10">
        <BackgroundBlur className="-top-40 md:-top-0" />
        <Nav />
        <main className="mx-auto grid min-h-[calc(100dvh-7.5rem)] w-full max-w-md items-center gap-6 lg:max-w-6xl lg:grid-cols-[1fr_440px] lg:gap-10">
          <section className="hidden max-w-2xl lg:block">
            <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-[0.18em] uppercase">
              IntellectX learner access
            </p>
            <h1 className="text-4xl leading-[1.08] font-medium tracking-tight md:text-6xl">
              {shellCopy.title}
            </h1>
            <p className="text-muted-foreground mt-5 max-w-xl leading-7">
              {shellCopy.description}
            </p>
          </section>
          <div className="flex min-w-0 flex-col gap-4">
            {demoEntry}
            {authPanel}
          </div>
        </main>
      </div>
      <div className="hidden lg:block">
        <Footer />
      </div>
    </>
  );
}
