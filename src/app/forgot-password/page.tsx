import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { isClerkAuthEnabled } from "@/lib/auth-env";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Forgot password - IntellectX",
  description: "Learner password reset for IntellectX.",
};

export default function ForgotPasswordPage() {
  if (isClerkAuthEnabled()) {
    redirect("/login");
  }

  return <AuthPageShell mode="forgot-password" />;
}
