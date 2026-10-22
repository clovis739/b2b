import type { Metadata } from "next";
import localFont from "next/font/local";
import "./marketplace.css";
import "./site.css";
import "./clone.css";
import "./page-types.css";
import "./motion.css";
import "./carousel.css";
import "./trade.css";
import "./typography.css";
import "./home-refinements.css";
import "./events-footer.css";
import "./about.css";
import "./blog.css";
import "./status.css";
import "./landed-cost.css";
import "./dropdowns.css";
import "./load-calculator.css";
import SiteShell from "./site-shell";

const manrope = localFont({
  src: "./fonts/Manrope-Variable.ttf",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Globy | Global Sourcing & Logistics",
  description: "Explore a connected global marketplace, discover suppliers, and plan your next shipment.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><SiteShell>{children}</SiteShell></body>
    </html>
  );
}

