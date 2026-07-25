
// lib/products.ts
//
// THIS IS THE ONLY FILE YOU NEED TO EDIT TO ADD/REMOVE PRODUCTS.
//
// For each product, get "cjVariantId" (called "vid" on CJ) from the CJ
// Dropshipping product page -> select the variant you want to sell -> the
// vid is shown there / available via CJ's product-search API.
//
// costCents  = what CJ charges you (find it on the CJ product page)
// priceCents = what you charge the customer
// Your profit per sale = priceCents - costCents (minus Stripe's ~3% fee)

export type Product = {
  id: string; // used in the store's own URLs, pick anything unique
  name: string;
  description: string;
  image: string; // full https:// image URL (CJ product image works fine)
  priceCents: number; // what the customer pays, in cents
  costCents: number; // what CJ charges you, in cents - for your own reference
  cjVariantId: string; // CJ's "vid" for this exact variant
};

export const products: Product[] = [
  {
    id: "sample-product-1",
    name: "Wireless Earbuds Pro",
    description:
      "Bluetooth 5.3 earbuds with active noise cancellation and a 30-hour charging case.",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
    priceCents: 3999,
    costCents: 1450,
    cjVariantId: "REPLACE-WITH-REAL-CJ-VID-1",
  },
  {
    id: "sample-product-2",
    name: "Minimalist Desk Lamp",
    description:
      "Touch-dimmable LED desk lamp with USB charging port, three color temperatures.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
    priceCents: 2499,
    costCents: 890,
    cjVariantId: "REPLACE-WITH-REAL-CJ-VID-2",
  },
  {
    id: "sample-product-3",
    name: "Insulated Steel Bottle",
    description:
      "500ml double-wall stainless steel bottle, keeps drinks cold 24h / hot 12h.",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
    priceCents: 1899,
    costCents: 620,
    cjVariantId: "REPLACE-WITH-REAL-CJ-VID-3",
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
