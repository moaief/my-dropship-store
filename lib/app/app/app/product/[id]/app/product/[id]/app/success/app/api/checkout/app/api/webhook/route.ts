import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createCjOrder } from "@/lib/cj";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["customer_details"],
      });

      const shipping = fullSession.collected_information?.shipping_details;
      const details = fullSession.customer_details;

      if (!shipping?.address) {
        throw new Error("No shipping address on session " + session.id);
      }

      await createCjOrder({
        orderNumber: session.id,
        shipping: {
          name: shipping.name || details?.name || "Customer",
          countryCode: shipping.address.country || "US",
          province: shipping.address.state || "",
          city: shipping.address.city || "",
          address1: shipping.address.line1 || "",
          address2: shipping.address.line2 || "",
          zip: shipping.address.postal_code || "",
          phone: details?.phone || "",
          email: details?.email || "",
        },
        items: [
          {
            cjVariantId: session.metadata?.cjVariantId || "",
            quantity: 1,
          },
        ],
      });

      console.log(`Order ${session.id} sent to CJ Dropshipping successfully.`);
    } catch (err: any) {
      console.error(
        `PAID BUT CJ ORDER FAILED for session ${session.id}: ${err.message}`
      );
    }
  }

  return NextResponse.json({ received: true });
}
