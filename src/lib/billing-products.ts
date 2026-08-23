import { premiumAccessProductKey } from "@/lib/entitlements";

export const scholarPriceIds = [
  "pri_01jx2rwhdtm4b5f3aj1ds3b0s4",
  "pri_01jx2rx1t30hxejpb5v0vav4nv",
] as const;

const scholarPriceIdSet = new Set<string>(scholarPriceIds);

export const scholarBillingProduct = {
  productKey: premiumAccessProductKey,
  priceIds: scholarPriceIds,
} as const;

export function isAllowedScholarPriceId(priceId: string | null | undefined) {
  const normalized = priceId?.trim();
  return !!normalized && scholarPriceIdSet.has(normalized);
}
