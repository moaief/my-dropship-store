"use client";

import { useState } from "react";

export default function BuyButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong starting checkout.");
        setLoading(false);
      }
    } catch {
      alert("Something went wrong starting checkout.");
      setLoading(false);
    }
  }

  return (
    <button className="btn" onClick={handleBuy} disabled={loading}>
      {loading ? "Redirecting…" : "Buy now"}
    </button>
  );
}
