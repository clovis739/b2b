"use client";
import Link from "next/link";
import { PageEntry } from "../../app/route-map";
import {
  categoryPath,
  sectors,
  siteProducts,
  slugify,
} from "../../app/site-data";
import { Icon } from "../../app/ui";
import { Intro } from "../shared/presentation";

import { usePageController } from "../../hooks/use-page-controller";

export default function CatalogPage({ entry }: { entry: PageEntry }) {
  const {
    query,
    country,
    setCountry,
    sort,
    setSort,
    page,
    setPage,
    saved,
    setModal,
    grid,
    searchBar,
  } = usePageController();

  const sector = sectors.find((s) => s.slug === entry.sector);
  let list = siteProducts.filter(
    (p) =>
      (!entry.sector || p.sector === entry.sector) &&
      (!entry.category || p.category === entry.category) &&
      (!entry.subcategory || slugify(p.name).includes(entry.subcategory)) &&
      (entry.kind !== "supplier" || p.supplierSlug === entry.key) &&
      (entry.kind !== "saved" || saved.includes(p.id)) &&
      (!country || p.country === country) &&
      `${p.name} ${p.supplier}`.toLowerCase().includes(query.toLowerCase()),
  );
  if (sort === "low")
    list = list.toSorted(
      (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity),
    );
  if (sort === "high")
    list = list.toSorted((a, b) => (b.price ?? -1) - (a.price ?? -1));
  const count = list.length;
  const currentPage = Math.min(page, Math.max(1, Math.ceil(count / 12)));
  const shown = list.slice((currentPage - 1) * 12, currentPage * 12);
  return (
    <>
      <Intro
        entry={entry}
        description={
          entry.kind === "supplier"
            ? "Company profile and products · Illustrative supplier data."
            : "Discover products and connect with your next business partner."
        }
      />
      {entry.kind === "supplier" && (
        <div className="supplier-banner">
          <span className="company-avatar">{entry.title[0]}</span>
          <div>
            <h2>{entry.title}</h2>
            <p>
              {list[0]?.flag} {list[0]?.country} · Wholesale & export · {count}{" "}
              products
            </p>
          </div>
          <button className="primary" onClick={() => setModal(true)}>
            Contact supplier <Icon name="mail" size={16} />
          </button>
        </div>
      )}
      <div className="catalog-layout">
        <aside className="catalog-sidebar">
          <h2>Categories</h2>
          <Link href="/b2bmarket/category-listing">
            All sectors <Icon name="arrow" size={14} />
          </Link>
          {sector ? (
            <>
              <Link href={categoryPath(sector.slug)}>{sector.name}</Link>
              {sector.children.map((c) => (
                <Link
                  key={c.slug}
                  className={c.slug === entry.category ? "active" : ""}
                  href={categoryPath(sector.slug, c.slug)}
                >
                  {c.name}
                </Link>
              ))}
            </>
          ) : (
            sectors.map((s) => (
              <Link key={s.slug} href={categoryPath(s.slug)}>
                {s.name}
              </Link>
            ))
          )}
          <div className="sidebar-note">
            <Icon name="help" />
            <h3>Need something specific?</h3>
            <p>Prepare a sourcing brief for your next supplier.</p>
            <Link href="/rfqs/add-rfq">Create a request <Icon name="arrow" size={16}/></Link>
          </div>
        </aside>
        <div className="catalog-results">
          <div className="listing-controls">
            {searchBar("Search products or suppliers")}
            <select
              aria-label="Supplier location"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All countries</option>
              {[...new Set(siteProducts.map((p) => p.country))]
                .sort()
                .map((c) => (
                  <option key={c}>{c}</option>
                ))}
            </select>
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="recommended">Recommended</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </div>
          <p className="catalog-count" aria-live="polite">
            {count} products available · Sample catalog
          </p>
          {count ? (
            grid(shown)
          ) : (
            <div className="empty-state">
              <Icon name="search" size={35} />
              <h3>
                {entry.kind === "saved"
                  ? "Save your next opportunity."
                  : "No products found in this category."}
              </h3>
              <p>
                {entry.kind === "saved"
                  ? "Tap the heart on a product to keep it here."
                  : "Explore another category or create a request with your exact specifications."}
              </p>
              <Link className="primary" href="/rfqs/add-rfq">
                Create sourcing request
              </Link>
            </div>
          )}
          <div className="pagination">
            <span>
              Page {currentPage} of {Math.max(1, Math.ceil(count / 12))}
            </span>
            <div>
              {Array.from({ length: Math.ceil(count / 12) }, (_, i) => (
                <button
                  aria-current={currentPage === i + 1 ? "page" : undefined}
                  className={currentPage === i + 1 ? "active" : ""}
                  key={i}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
