/**
 * POST /api/checkout — ConceptUnlock
 *
 * Creates a Stripe Checkout Session and returns the redirect URL.
 * Called from the landing page and /pricing page CTAs (via ReferralModal).
 *
 * Body:
 *   { priceId: string, mode?: 'subscription' | 'payment',
 *     refCode?: string, customerEmail?: string, applyReferralDiscount?: boolean }
 *
 * Referral handling:
 *   - refCode in body (from referrer modal submit) → applies 20% coupon
 *   - ref_code cookie (from /?r=CODE landing) → applies 20% coupon
 *   - applyReferralDiscount: true → applies 20% coupon
 *
 * NOTE — Play Store Families Policy:
 *   This endpoint serves the PARENT-FACING WEB CHECKOUT only.
 *   The Android/Capacitor app does NOT use in-app billing — it loads the
 *   web app via a remote URL, so all payment flows go through Stripe web
 *   checkout, which is compliant with the Play Store Families Policy.
 */

import { NextRequest, NextResponse } from "next/server";
import { stripe, APP_URL, ensureReferralCoupon, getStripe } from "@/lib/stripe";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const REFERRAL_COUPON_ID = process.env.STRIPE_REFERRAL_COUPON_ID || "REFER2_20OFF";

/**
 * Dynamic allowlist — accepts any price id the vertical has wired via a
 * STRIPE_PRICE_* env var. This keeps the generated route agnostic of the
 * vertical's specific tier naming (MONTHLY/ANNUAL/LIFETIME,
 * BASIC/PRO/BUSINESS, STARTER/PRO/FAMILY, etc.).
 */
const VALID_PRICE_IDS = new Set(
  Object.entries(process.env)
    .filter(([k, v]) => k.startsWith("STRIPE_PRICE_") && typeof v === "string" && v.length > 0)
    .map(([, v]) => v as string)
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      priceId,
      mode: modeFromBody,
      refCode: refCodeFromBody,
      customerEmail,
      applyReferralDiscount,
    } = body as {
      priceId?: string;
      mode?: string;
      refCode?: string;
      customerEmail?: string;
      applyReferralDiscount?: boolean;
    };

    if (!priceId) {
      return NextResponse.json({ error: "priceId is required" }, { status: 400 });
    }
    if (VALID_PRICE_IDS.size > 0 && !VALID_PRICE_IDS.has(priceId)) {
      return NextResponse.json({ error: "Invalid priceId" }, { status: 400 });
    }

    // Auto-select mode: if the caller did not specify one, subscription is
    // the default unless the price id matches STRIPE_PRICE_LIFETIME.
    const isLifetime = priceId === process.env.STRIPE_PRICE_LIFETIME;
    const mode =
      (modeFromBody as "subscription" | "payment") ||
      (isLifetime ? "payment" : "subscription");
    if (mode !== "subscription" && mode !== "payment") {
      return NextResponse.json({ error: "invalid mode" }, { status: 400 });
    }

    const cookieRefCode = req.cookies.get("ref_code")?.value;
    const refCode = refCodeFromBody || cookieRefCode || undefined;
    // Any refCode (body OR cookie) triggers the 20% coupon — covers both
    // the referrer's modal submit and the friend's invite-link arrival.
    const shouldDiscount = Boolean(refCode) || Boolean(applyReferralDiscount);

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/pricing`,
      billing_address_collection: "auto",
      metadata: {
        source: "web_checkout",
        payment_origin: "parent_web",
        priceId,
        refCode: refCode || "",
        referralIntent: applyReferralDiscount
          ? "referrer"
          : refCode
            ? "friend"
            : "none",
        schema: process.env.NEXT_PUBLIC_APP_SCHEMA || "conceptunlock",
      },
    };

    if (customerEmail) {
      sessionParams.customer_email = customerEmail.trim();
    }

    if (shouldDiscount) {
      try {
        await ensureReferralCoupon(getStripe(), REFERRAL_COUPON_ID);
      } catch (couponErr) {
        console.warn(
          "[checkout] ensureReferralCoupon failed — continuing without discount",
          couponErr
        );
      }
      sessionParams.discounts = [{ coupon: REFERRAL_COUPON_ID }];
    } else {
      sessionParams.allow_promotion_codes = true;
    }

    if (mode === "subscription") {
      sessionParams.subscription_data = {
        trial_period_days: 14,
        metadata: { source: "web_checkout", payment_origin: "parent_web" },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[checkout] Error:", err?.message);
    return NextResponse.json(
      { error: err?.message ?? "Internal error" },
      { status: 500 }
    );
  }
}
