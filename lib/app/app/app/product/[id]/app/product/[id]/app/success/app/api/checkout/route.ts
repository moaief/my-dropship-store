import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getProduct } from "@/lib/products";

export async function POST(req: NextRequest) {
  const { productId } = await req.json();
  const product = getProduct(productId);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const origin = req.headers.get("origin") || process.env.SITE_URL;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
            images: [product.image],
          },
          unit_amount: product.priceCents,
        },
        quantity: 1,
      },
    ],
    shipping_address_collection: {
      allowed_countries: [
        "US", "CA", "GB", "AU", "DE", "FR", "ES", "IT", "NL", "SA", "AE",
      ],
    },
    phone_number_collection: { enabled: true },
    metadata: {
      productId: product.id,
      cjVariantId: product.cjVariantId,
    },
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/product/${product.id}`,
  });

  return NextResponse.json({ url: session.url });
}
