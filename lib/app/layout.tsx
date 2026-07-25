import "@/styles/globals.css";

export const metadata = {
  title: "The Manifest — Direct-Ship Goods",
  description: "Order today, shipped straight from the warehouse.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container">
            <a href="/" className="brand">
              The Manifest
            </a>
            <span className="brand-tag">No. 001 — Direct-Ship Goods</span>
          </div>
        </header>
        {children}
        <footer>
          <div className="container">
            Every order ships direct from the source. No middle stop.
          </div>
        </footer>
      </body>
    </html>
  );
}
