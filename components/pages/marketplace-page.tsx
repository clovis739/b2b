"use client";
import Link from "next/link";
import { PageEntry } from "../../app/route-map";
import { categoryPath, sectors, siteProducts } from "../../app/site-data";
import { Icon } from "../../app/ui";
import HeroSearch from "../home/hero-search";
import { usePageController } from "../../hooks/use-page-controller";

export default function MarketplacePage({ entry }: { entry: PageEntry }) {
  const { grid } = usePageController();
  const suppliers = [
    ...new Map(siteProducts.map((p) => [p.supplierSlug, p])).values(),
  ].slice(0, 4);
  return (
    <>
      <HeroSearch marketplace />
      <section className="page-section">
        <div className="section-title">
          <h2>All sectors</h2>
          <Link href="/b2bmarket/category-listing">
            View all categories <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="market-sector-chips">
          {sectors.map((s) => (
            <Link key={s.slug} href={categoryPath(s.slug)}>
              <Icon name={s.icon} size={20} />
              {s.name}
              <Icon name="chevron" size={13} />
            </Link>
          ))}
        </div>
      </section>
      <section className="page-section">
        <div className="section-title">
          <h2>Discover suppliers</h2>
          <span className="form-note">Illustrative company profiles</span>
        </div>
        <div className="market-supplier-grid">
          {suppliers.map((p) => (
            <Link
              href={`/b2bmarket/supplier-listing/${p.supplierSlug}`}
              key={p.supplierSlug}
            >
              <span className="company-avatar">{p.supplier[0]}</span>
              <h3>{p.supplier}</h3>
              <p>
                {p.flag} {p.country}
              </p>
              <span>
                View company <Icon name="arrow" size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="page-section">
        <div className="section-title">
          <h2>Popular products</h2>
          <Link href="/b2bmarket/search">
            Browse all products <Icon name="arrow" size={16} />
          </Link>
        </div>
        {grid(siteProducts.slice(0, 8))}
      </section>
      <section className="market-rfq-callout">
        <div>
          <h2>Have a specific requirement?</h2>
          <p>
            Prepare a detailed RFQ and keep your sourcing requirements together.
          </p>
        </div>
        <Link className="primary" href="/rfqs/add-rfq">
          Create an RFQ <Icon name="arrow" size={17} />
        </Link>
      </section>
      <span className="sr-only">{entry.title}</span>
    </>
  );
}
