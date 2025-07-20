// app/layout.tsx
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./components/CartContext";
import { ErrorBoundary } from "./components/ErrorBoundary";



export const metadata = {
  title: "United S.T.O.R.M. Basketball",
  description: "Official website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <ErrorBoundary>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

