"use client";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "../../app/ui";
import SectionHeading from "./section-heading";
import Carousel from "../motion/carousel";
const rates = [
  { country: "China", flag: "🇨🇳", slug: "china", price: 1213 },
  { country: "India", flag: "🇮🇳", slug: "india", price: 2613 },
  { country: "Netherlands", flag: "🇳🇱", slug: "netherlands", price: 2350 },
  { country: "United States", flag: "🇺🇸", slug: "united-states", price: 2050 },
];
const trending = [
  { country: "Germany", flag: "🇩🇪", to: "Hamburg, Germany", price: 1800 },
  { country: "Italy", flag: "🇮🇹", to: "Genoa, Italy", price: 1913 },
];
export default function FreightSection() {
  const [mode, setMode] = useState("import");
  return (
    <section className="clone-section">
      <SectionHeading
        title="Instant Freight Quotes"
        description="Find the best shipping quotes with our freight calculator."
        href="/freight-calculator"
        action="Browse more freight"
      />
      <div className="clone-freight-layout">
        <div className="clone-freight-panel">
          <div className="clone-freight-panel-heading">
            <h3>Shipping rates for you</h3>
            <div className="clone-rate-toggle">
              <button
                className={mode === "import" ? "active" : ""}
                aria-pressed={mode === "import"}
                onClick={() => setMode("import")}
              >
                Import to 🇺🇸
              </button>
              <button
                className={mode === "export" ? "active" : ""}
                aria-pressed={mode === "export"}
                onClick={() => setMode("export")}
              >
                Export from 🇺🇸
              </button>
            </div>
          </div>
          <div className="clone-rate-grid">
            {rates
              .filter((r) => r.slug !== "united-states")
              .map((r) => (
                <Link
                  href={`/freight-calculator?from=${mode === "import" ? r.slug : "united-states"}&to=${mode === "import" ? "united-states" : r.slug}`}
                  key={r.slug}
                >
                  <span className="rate-country">
                    <span>{r.flag}</span>
                    {r.country}
                    <Icon name="arrow" size={16} />
                  </span>
                  <strong>${r.price.toLocaleString()}.00</strong>
                  <small>Sample starting estimate</small>
                  <span className="rate-equipment">FCL · 20ST</span>
                </Link>
              ))}
          </div>
        </div>
        <div className="clone-trending">
          <h3>Latest trending offers</h3>
          <Carousel
            label="Trending freight offers"
            className="freight-carousel"
            desktop={1}
            tablet={1}
            autoplay
          >
            {trending.map((r) => (
              <Link
                href={`/freight-calculator?from=india&to=${encodeURIComponent(r.to)}`}
                key={r.country}
              >
                <div className="trending-route">
                  <span>
                    <span className="route-flag">🇮🇳</span>
                    <small>From</small>
                    <b>India</b>
                  </span>
                  <Icon name="arrow" size={17} />
                  <span>
                    <span className="route-flag">{r.flag}</span>
                    <small>To</small>
                    <b>{r.country}</b>
                  </span>
                </div>
                <div className="trending-price">
                  <strong>${r.price.toLocaleString()}.00</strong>
                  <span>Starting from</span>
                </div>
                <span className="trending-equipment">
                  <Icon name="ship" size={15} /> FCL · 20ST
                </span>
              </Link>
            ))}
          </Carousel>
        </div>
      </div>
      <p className="clone-disclaimer">
        Illustrative rates for this local build. Carrier quotes, availability
        and final charges require confirmation.
      </p>
    </section>
  );
}
