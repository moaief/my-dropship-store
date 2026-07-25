// lib/cj.ts
// Thin client for the CJ Dropshipping API (v2).
// Docs: https://developers.cjdropshipping.cn/en/api/api2/
//
// Two calls matter for this store:
//  1. getAccessToken  -> exchanges your CJ API key for a short-lived access token
//  2. createOrder     -> places the order with CJ right after Stripe payment succeeds
//
// NOTE: CJ's API can change field names/requirements over time. If an order
// ever fails, check the "message" field CJ returns (logged to the Vercel
// function logs) against the latest docs above before assuming the code is broken.

const CJ_BASE = "https://developers.cjdropshipping.com/api2.0/v1";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: process.env.CJ_API_KEY }),
  });

  const data = await res.json();

  if (!data?.data?.accessToken) {
    throw new Error(`CJ auth failed: ${data?.message || "unknown error"}`);
  }

  cachedToken = {
    token: data.data.accessToken,
    // CJ returns an ISO expiry date; fall back to 1 hour if parsing fails
    expiresAt: data.data.accessTokenExpiryDate
      ? new Date(data.data.accessTokenExpiryDate).getTime()
      : Date.now() + 60 * 60 * 1000,
  };

  return cachedToken.token;
}

export type ShippingInfo = {
  name: string;
  countryCode: string; // ISO 2-letter, e.g. "US"
  province: string;
  city: string;
  address1: string;
  address2?: string;
  zip: string;
  phone: string;
  email?: string;
};

export type OrderLineItem = {
  cjVariantId: string; // the "vid" CJ gives each product variant
  quantity: number;
};

// Places a fulfilment order with CJ. Called from the Stripe webhook once
// payment is confirmed - this is the "send the order to the supplier" step.
export async function createCjOrder(params: {
  orderNumber: string; // use the Stripe session/payment id so it's traceable
  shipping: ShippingInfo;
  items: OrderLineItem[];
}) {
  const token = await getAccessToken();

  const body = {
    orderNumber: params.orderNumber,
    shippingCustomerName: params.shipping.name,
    shippingCountryCode: params.shipping.countryCode,
    shippingCountry: params.shipping.countryCode,
    shippingProvince: params.shipping.province,
    shippingCity: params.shipping.city,
    shippingAddress: params.shipping.address1,
    shippingAddress2: params.shipping.address2 || "",
    shippingZip: params.shipping.zip,
    shippingPhone: params.shipping.phone,
    email: params.shipping.email || "",
    fromCountryCode: "CN",
    orderFlow: 1,
    products: params.items.map((item) => ({
      vid: item.cjVariantId,
      quantity: item.quantity,
      storeLineItemId: `${params.orderNumber}-${item.cjVariantId}`,
    })),
  };

  const res = await fetch(`${CJ_BASE}/shopping/order/createOrderV2`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CJ-Access-Token": token,
    },
    body: JSON.stringify(
