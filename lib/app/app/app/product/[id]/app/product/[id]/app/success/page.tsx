export default function SuccessPage() {
  return (
    <main className="success-wrap">
      <div className="success-card">
        <h1>Order placed.</h1>
        <p>
          Payment received and your order has been sent to the warehouse for
          shipping. A tracking number will be emailed once it ships.
        </p>
        <br />
        <a href="/" className="back-link">
          ← Back to catalog
        </a>
      </div>
    </main>
  );
}
