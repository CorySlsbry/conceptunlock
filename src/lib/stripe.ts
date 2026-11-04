/**
 * Stripe API helper — ConceptUnlock
 *
 * Server-side only. Import this file in API routes and server components.
 * Never import in client components.
 *
 * Exports:
 *   - stripe               — lazy Proxy over the Stripe singleton
 *   - getStripe()          — lazy singleton accessor (server-side only)
 *   - APP_URL              — for Checkout redirect URLs
 *   - ensureReferralCoupon — idempotent 20%-off-forever coupon creator
 */

import Stripe from "stripe";

/** App URL — used for Checkout success/cancel redirects */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://conceptunlock.vercel.app";

/** Raw Stripe client — lazily instantiated so build-time env vars aren't required */
let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set.");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia" as any,
      typescript: true,
    });
  }
  return _stripe;
}

/** Convenience alias — lazily instantiated Stripe client */
export const stripe = new Proxy({} as Stripe, {
  get(_t, prop) {
    return (getStripe() as any)[prop];
  },
});

/**
 * Idempotent: ensures a 20%-off-forever coupon exists in Stripe with the given id.
 * First call on a fresh Stripe account creates it; subsequent calls are no-ops.
 * Used by the referral flow so the discount can be applied at checkout
 * without a manual dashboard step.
 */
const _ensuredCoupons = new Set<string>();
export async function ensureReferralCoupon(
  stripeClient: Stripe,
  couponId: string
): Promise<void> {
  if (_ensuredCoupons.has(couponId)) return;
  try {
    await stripeClient.coupons.retrieve(couponId);
    _ensuredCoupons.add(couponId);
    return;
  } catch (err: any) {
    if (err?.statusCode !== 404 && err?.code !== "resource_missing") {
      throw err;
    }
  }
  await stripeClient.coupons.create({
    id: couponId,
    percent_off: 20,
    duration: "forever",
    name: "Refer 2 Friends — 20% Off Forever",
    metadata: { source: "refer2_flow" },
  });
  _ensuredCoupons.add(couponId);
}
