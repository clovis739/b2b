"use client";
import Link from "next/link";
import { useState } from "react";
import { PageEntry } from "../../app/route-map";
import { siteProducts } from "../../app/site-data";
import { Icon } from "../../app/ui";
import { usePageController } from "../../hooks/use-page-controller";
import { Intro } from "../shared/presentation";

export default function SupplierPage({ entry }: { entry: PageEntry }) {
  const { grid, form } = usePageController();
  const [tab, setTab] = useState("products");
  const [query, setQuery] = useState("");
  const products = siteProducts.filter((p) => p.supplierSlug === entry.key);
  const supplier = products[0];
  return (
    <>
      <Intro
        entry={entry}
        description="Company profile, product catalog, and sourcing inquiries."
      />
      <section className="supplier-profile-hero">
        <span className="supplier-large-avatar">{entry.title[0]}</span>
        <div>
          <span className="page-kicker">
            WHOLESALE & EXPORT · SAMPLE PROFILE
          </span>
          <h2>{entry.title}</h2>
          <p>
            {supplier.flag} {supplier.country} · {products.length} products
          </p>
        </div>
        <a className="primary" href="#supplier-inquiry">
          <Icon name="mail" size={17} />
          Contact supplier
        </a>
      </section>
      <div
        className="workspace-tabs"
        role="group"
        aria-label="Supplier profile sections"
      >
        {[
          ["products", "Products"],
          ["about", "About company"],
        ].map(([key, title]) => (
          <button
            key={key}
            aria-pressed={tab === key}
            className={tab === key ? "active" : ""}
            onClick={() => setTab(key)}
          >
            {title}
          </button>
        ))}
      </div>
      {tab === "products" ? (
        <section>
          <div className="filter-search">
            <Icon name="search" size={17} />
            <input
              aria-label="Search supplier products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search this supplier’s products"
            />
          </div>
          {products.some((p) =>
            p.name.toLowerCase().includes(query.toLowerCase()),
          ) ? (
            grid(
              products.filter((p) =>
                p.name.toLowerCase().includes(query.toLowerCase()),
              ),
            )
          ) : (
            <div className="empty-state">
              <h3>No products match this search.</h3>
              <button className="outline-button" onClick={() => setQuery("")}>
                Show all supplier products
              </button>
            </div>
          )}
        </section>
      ) : (
        <article className="content-panel supplier-about">
          <h2>About {entry.title}</h2>
          <p>
            This example company profile demonstrates a wholesale supplier’s
            public business page. The catalog brings product specifications and
            inquiry actions together so buyers can prepare a clear sourcing
            brief.
          </p>
          <dl className="spec-table">
            {[
              ["Business type", "Wholesale / export"],
              ["Country", supplier.country],
              ["Catalog products", String(products.length)],
              ["Trading areas", "International markets"],
              [
                "Verification",
                "Sample interface only — not a verified company record",
              ],
            ].map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <Link
            className="text-button"
            href="/help-center/sourcing-and-suppliers"
          >
            Read the supplier sourcing guide <Icon name="arrow" size={16}/>
          </Link>
        </article>
      )}
      <section className="page-section" id="supplier-inquiry">
        {form("supplier-inquiry", `Contact ${entry.title}`)}
      </section>
    </>
  );
}
