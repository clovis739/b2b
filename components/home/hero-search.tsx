"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/motion";
import { Icon } from "../../app/ui";

export default function HeroSearch({
  marketplace = false,
}: {
  marketplace?: boolean;
}) {
  const [mode, setMode] = useState("products");
  const [word, setWord] = useState(0);
  const wordRef = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    if (!wordRef.current) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ repeat: -1 })
        .to(wordRef.current, { opacity: 0, y: -10, duration: 0.22, delay: 3.4 })
        .call(() => setWord((old) => (old + 1) % 3))
        .fromTo(
          wordRef.current,
          { y: 10 },
          { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
        );
    });
    return () => media.revert();
  }, []);
  return (
    <section className="clone-hero" aria-labelledby="home-title">
      <div className="clone-globe-grid" aria-hidden="true" />
      <h1 id="home-title">
        {marketplace ? (
          <>
            Find products and suppliers
            <br className="mobile-break" /> around the world
          </>
        ) : (
          <>
            Global B2B platform that streamlines{" "}
            <span ref={wordRef} className="clone-hero-word">
              {["Sourcing", "Logistics", "Export"][word]}
            </span>
          </>
        )}
      </h1>
      <div className="clone-search-tabs" role="group" aria-label="Search type">
        <button
          className={mode === "products" ? "active" : ""}
          aria-pressed={mode === "products"}
          onClick={() => setMode("products")}
        >
          <Icon name="box" size={20} />
          Products
        </button>
        <button
          className={mode === "freight" ? "active" : ""}
          aria-pressed={mode === "freight"}
          onClick={() => setMode("freight")}
        >
          <Icon name="ship" size={20} />
          Freight
        </button>
      </div>
      {mode === "products" ? (
        <form className="clone-main-search" action="/b2bmarket/search">
          <input
            name="q"
            aria-label="Search products and suppliers"
            placeholder="What are you looking for?"
            required
          />
          <button className="primary" type="submit">
            <Icon name="search" size={24} />
            Search
          </button>
        </form>
      ) : (
        <form
          className="clone-main-search clone-freight-search"
          action="/freight-calculator"
        >
          <label>
            <span>Origin</span>
            <select
              name="from"
              aria-label="Freight origin"
              defaultValue="china"
            >
              <option value="china">China</option>
              <option value="india">India</option>
              <option value="netherlands">Netherlands</option>
            </select>
          </label>
          <Icon name="arrow" size={20} />
          <label>
            <span>Destination</span>
            <select
              name="to"
              aria-label="Freight destination"
              defaultValue="united-states"
            >
              <option value="united-states">United States</option>
              <option value="nigeria">Nigeria</option>
              <option value="united-arab-emirates">United Arab Emirates</option>
            </select>
          </label>
          <button className="primary">
            <Icon name="search" size={24} />
            Search
          </button>
        </form>
      )}
      <div className="clone-popular-searches">
        <span>Frequently searched :</span>
        {[
          "White rice",
          "Organic honey",
          "Printing machine",
          "Turmeric",
          "Door Warehouse",
        ].map((q) => (
          <Link key={q} href={`/b2bmarket/search?q=${encodeURIComponent(q)}`}>
            {q}
          </Link>
        ))}
      </div>
    </section>
  );
}
