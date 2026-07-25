import { products } from "@/lib/products";

export default function HomePage() {
  return (
    <main className="container">
      <section className="hero">
        <h1>Good gear, shipped direct.</h1>
        <p>
          Every item below ships straight from the warehouse to your door —
          no store to visit, no stock to hold.
        </p>
      </section>

      <div className="grid">
        {products.map((product) => (
          <a key={product.id} href={`/product/${product.id}`} className="ticket">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="ticket-image"
            />
            <div className="ticket-perforation" />
            <div className="ticket-body">
              <span className="stamp-badge">Ships direct</span>
              <h3 className="ticket-name">{product.name}</h3>
              <p className="ticket-desc">{product.description}</p>
              <div className="ticket-footer">
                <span className="price">
                  ${(product.priceCents / 100).toFixed(2)}
                </span>
                <span className="btn">View</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
