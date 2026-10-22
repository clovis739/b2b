"use client";
import Link from "next/link";
import { PageEntry } from "../../app/route-map";
import { siteProducts } from "../../app/site-data";
import { Icon } from "../../app/ui";
import { Photo } from "../shared/presentation";

import { usePageController } from "../../hooks/use-page-controller";

export default function ProductPage({ entry }: { entry: PageEntry }) {
  const { saved, toggle, grid, form } = usePageController();

  const p = siteProducts.find((p) => p.slug === entry.key)!;
  return (
    <>
      <div className="product-detail-layout">
        <div>
          <Photo name={p.image} alt={p.name} className="detail-main-photo" />
          <div className="product-detail-copy">
            <h2>Product details</h2>
            <p>{p.description}</p>
            <h2>Specifications & shipping</h2>
            <dl className="spec-table">
              {[
                ["Product category", p.category.replaceAll("-", " ")],
                ["Supplier country", p.country],
                ["Minimum order", `${p.min} ${p.unit}s`],
                ["Packaging", "Confirm with supplier"],
                ["Payment terms", "Subject to supplier agreement"],
                ["Shipping terms", "FOB / CIF / EXW by agreement"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="product-detail-panel">
          <span className="page-kicker">WHOLESALE · SAMPLE PRODUCT</span>
          <h1>{p.name}</h1>
          <div className="detail-price">
            {p.price
              ? <><strong>US$ {p.price.toLocaleString()}</strong><span> / {p.unit}</span></>
              : "Price upon request"}
          </div>
          <p>
            Minimum order: {p.min} {p.unit.toLowerCase()}s
          </p>
          <Link
            className="supplier-profile-link"
            href={`/b2bmarket/supplier-listing/${p.supplierSlug}`}
          >
            <span className="company-avatar">{p.supplier[0]}</span>
            <span>
              <strong>{p.supplier}</strong>
              <small>
                {p.flag} {p.country}
              </small>
            </span>
            <Icon name="chevron" size={17} />
          </Link>
          <a href="#inquiry" className="primary full-width">
            <Icon name="mail" size={17} />
            Contact supplier
          </a>
          <button
            className="outline-button full-width"
            onClick={() => toggle(p.id)}
          >
            <Icon name="heart" size={17} />
            {saved.includes(p.id) ? "Saved product" : "Save product"}
          </button>
          <Link href="/freight-calculator" className="text-button">
            <Icon name="ship" size={16} />
            Estimate shipping costs
          </Link>
          <p className="form-note">
            Illustrative listing. Confirm availability and all commercial terms
            before making a sourcing decision.
          </p>
        </div>
      </div>
      <section className="page-section" id="inquiry">
        {form("inquiry", `Contact ${p.supplier}`)}
      </section>
      <section className="page-section">
        <div className="section-title">
          <h2>More to explore.</h2>
        </div>
        {grid(
          siteProducts
            .filter((x) => x.sector === p.sector && x.id !== p.id)
            .slice(0, 4),
        )}
      </section>
    </>
  );
}
