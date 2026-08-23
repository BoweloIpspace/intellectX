import type { CheckoutQueryParams } from "@/lib/types";
import { CheckoutOpenLineItem, initializePaddle, type Environments, type Paddle, type Theme } from "@paddle/paddle-js";
import type { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type UsePaddleArgs = {
  checkoutQueryParams: CheckoutQueryParams;
  clientToken: string;
  redirectUrl: string;
  environment: Environments;
};

function buildItems(priceId: string | undefined): CheckoutOpenLineItem[] {
  const allPriceIds = priceId?.split(",");
  return allPriceIds?.map((priceId) => ({ priceId: priceId.trim(), quantity: 1 })) || [];
}

export function usePaddle(args: UsePaddleArgs) {
  const router = useRouter();
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutEventsData | null>(null);
  const [customDataUpdated, setCustomDataUpdated] = useState(false);

  const { checkoutQueryParams, clientToken, environment, redirectUrl } = args;

  const {
    discountCode,
    discountId,
    priceId,
    productKey,
    transactionId,
    userEmail,
    appUserId,
    paddleCustomerId,
    countryCode,
    postalCode,
    theme,
    locale,
  } = checkoutQueryParams;

  const handleCheckoutEvents = (event: CheckoutEventsData) => {
    setCheckoutData(event);
  };

  useEffect(() => {
    if (!paddle?.Initialized && clientToken) {
      initializePaddle({
        token: clientToken,
        environment,
        eventCallback: (event) => {
          if (event.name === "checkout.completed") {
            const currentParams = new URLSearchParams(window.location.search);
            const searchParams = new URLSearchParams({
              ...Object.fromEntries(currentParams),
              redirect_url: redirectUrl,
              transaction_id: event.data?.transaction_id || "",
              customer_email: event.data?.customer?.email || "",
              paddle_customer_id: event.data?.customer?.id || "",
            });
            router.push(`/checkout_redirect/success?${searchParams.toString()}`);
          }

          if (event.data && event.name) {
            handleCheckoutEvents(event.data);
          }
        },
        checkout: {
          settings: {
            theme: theme as Theme,
            variant: "one-page",
            displayMode: "inline",
            frameTarget: "paddle-checkout-frame",
            frameInitialHeight: 450,
            frameStyle: "width: 100%; background-color: transparent; border: none",
            locale: locale ?? "en",
          },
        },
      }).then(async (paddle) => {
        if (paddle && (priceId || transactionId)) {
          setPaddle(paddle);

          paddle.Checkout.open({
            ...(userEmail && {
              customer: {
                email: userEmail,
                ...((countryCode || postalCode) && {
                  address: {
                    ...(countryCode && { countryCode }),
                    ...(postalCode && { postalCode }),
                  },
                }),
              },
            }),
            ...(paddleCustomerId && { customer: { id: paddleCustomerId } }),
            ...(appUserId && productKey && !transactionId && {
              customData: { app_user_id: appUserId, product_key: productKey },
            }),
            ...(transactionId ? { transactionId } : { items: buildItems(priceId) }),
            ...(discountCode ? { discountCode } : discountId ? { discountId } : {}),
          });
        }
      });
    }
  }, [
    appUserId,
    clientToken,
    countryCode,
    paddle?.Initialized,
    paddleCustomerId,
    postalCode,
    priceId,
    productKey,
    redirectUrl,
    router,
    transactionId,
    userEmail,
    locale,
    theme,
    environment,
    discountCode,
    discountId,
  ]);

  useEffect(() => {
    if (
      transactionId &&
      !customDataUpdated &&
      paddle?.Initialized &&
      appUserId &&
      productKey &&
      checkoutData
    ) {
      const { custom_data } = checkoutData;

      paddle.Checkout.updateCheckout({
        customData: {
          ...custom_data,
          app_user_id: appUserId,
          product_key: productKey,
        },
      });
      setCustomDataUpdated(true);
    }
  }, [appUserId, checkoutData, customDataUpdated, paddle, productKey, transactionId]);

  return {
    checkoutData,
    paddle,
  };
}
