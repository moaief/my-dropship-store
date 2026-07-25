import { getProduct } from "@/lib/products";
import { notFound } from "next/navigation";
import BuyButton from "./buy-button";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  if (!product) return notFound();

  return (
    <main className="container">
      <div className="product-detail">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} />
        </div>
        <div>
          <a href="/" className="back-link">
            ← Back to catalog
          </a>
          <span className="stamp-badge" style={{ marginTop: 16 }}>
            Ships direct
          </span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <span className="price">
            ${(product.priceCents / 100).toFixed(2)}
          </span>
          <BuyButton productId={product.id} />
        </div>
      </div>
    </main>
  );
}
