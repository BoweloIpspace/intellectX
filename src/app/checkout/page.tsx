import { Checkout } from "@/components/checkout/checkout";
import { buildAuthenticatedBillingUserKey } from "@/lib/billing-identity";
import { isAllowedScholarPriceId, scholarBillingProduct } from "@/lib/billing-products";
import type { CheckoutQueryParams, SnakeCaseCheckoutQueryParams } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import type { Environments } from "@paddle/paddle-js";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - IntellectX",
  description: "IntellectX premium checkout availability.",
};

type Props = {
  searchParams: Promise<SnakeCaseCheckoutQueryParams>;
};

function CheckoutUnavailable({ message }: { message: string }) {
  return (
    <main className="grid min-h-[70vh] place-items-center px-6 py-16">
      <section className="mx-auto max-w-xl rounded-3xl border border-border bg-background/95 p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Checkout unavailable</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">{message}</p>
        <Link
          href="/pricing"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-semibold text-foreground transition hover:bg-muted"
        >
          Back to pricing
        </Link>
      </section>
    </main>
  );
}

export default async function CheckoutPage({ searchParams }: Props) {
  const paymentsEnabled = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";

  if (!paymentsEnabled) {
    return (
      <main className="grid min-h-[70vh] place-items-center px-6 py-16">
        <section className="mx-auto max-w-xl rounded-3xl border border-border bg-background/95 p-8 text-center shadow-sm">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">Coming soon</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Premium checkout is not live yet</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Start learning for free while premium account access is being finalized.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/courses"
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-background transition hover:opacity-90"
            >
              Start free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              View pricing
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const redirectUrl = process.env.NEXT_PUBLIC_APP_REDIRECT_URL;
  const environment = process.env.NEXT_PUBLIC_PADDLE_ENV as Environments | undefined;

  if (!clientToken || !redirectUrl || !environment) {
    return <CheckoutUnavailable message="Required payment configuration is missing." />;
  }

  const params = await searchParams;
  const {
    country_code: countryCode,
    discount_code: discountCode,
    discount_id: discountId,
    locale,
    postal_code: postalCode,
    price_id: urlPriceId,
    theme,
    transaction_id: transactionId,
  } = params;

  if (transactionId) {
    return <CheckoutUnavailable message="Pre-created transaction checkout is disabled until it has a server-side ownership check." />;
  }

  if (!isAllowedScholarPriceId(urlPriceId)) {
    return <CheckoutUnavailable message="This price is not an approved IntellectX Scholar price." />;
  }

  let authState;
  try {
    authState = await auth();
  } catch {
    return <CheckoutUnavailable message="Authentication is not configured for checkout." />;
  }

  if (!authState.isAuthenticated || !authState.userId) {
    return (
      <main className="grid min-h-[70vh] place-items-center px-6 py-16">
        <section className="mx-auto max-w-xl rounded-3xl border border-border bg-background/95 p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sign in before checkout</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Paid access must be linked to a verified IntellectX account.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-background"
          >
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  let billingUserKey: string;
  try {
    const claims = authState.sessionClaims as { iss?: unknown } | null | undefined;
    billingUserKey = buildAuthenticatedBillingUserKey({
      userId: authState.userId,
      issuer: claims?.iss,
    });
  } catch {
    return <CheckoutUnavailable message="The authenticated account is missing trusted billing identity claims." />;
  }

  const checkoutQueryParams: CheckoutQueryParams = {
    appUserId: billingUserKey,
    productKey: scholarBillingProduct.productKey,
    countryCode,
    discountCode,
    discountId,
    locale,
    postalCode,
    priceId: urlPriceId,
    theme,
  };

  return (
    <Checkout
      checkoutQueryParams={checkoutQueryParams}
      environment={environment}
      clientToken={clientToken}
      redirectUrl={redirectUrl}
    />
  );
}
