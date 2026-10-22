"use client";
import Link from "next/link";
import { PageEntry } from "../../app/route-map";
import { cargo } from "../../app/site-data";
import { Icon } from "../../app/ui";
import { Photo, Intro } from "../shared/presentation";

import { usePageController } from "../../hooks/use-page-controller";

export default function CargoPage({ entry }: { entry: PageEntry }) {
  const { query, searchBar, form } = usePageController();

  const found = cargo.find((c) => c.id === entry.key);
  return (
    <>
      <Intro
        entry={entry}
        description="Explore sample cargo opportunities and connect with cargo owners."
      />
      {found ? (
        <>
          <div className="product-detail-layout">
            <Photo
              name={found.image}
              alt={found.title}
              className="detail-main-photo"
            />
            <div className="product-detail-panel">
              <span className="page-kicker">ILLUSTRATIVE CARGO LOT</span>
              <h1>{found.title}</h1>
              <div className="detail-price">
                US$ {found.price.toLocaleString()}
              </div>
              <p>
                {found.quantity} · {found.location}
              </p>
              <p>{found.description}</p>
              <a className="primary" href="#cargo-inquiry">
                Contact cargo owner <Icon name="arrow" size={16} />
              </a>
            </div>
          </div>
          <section id="cargo-inquiry" className="page-section">
            {form("cargo-inquiry", "Ask about this cargo")}
          </section>
        </>
      ) : (
        <>
          <div className="listing-controls">
            {searchBar("Search cargo or location")}
            <Link className="primary" href="/unclaimed-cargo/create">
              List cargo <Icon name="arrow" size={16} />
            </Link>
          </div>
          <div className="editorial-grid">
            {cargo
              .filter((c) =>
                `${c.title} ${c.location}`
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              )
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/offers/${c.id}`}
                  className="editorial-card"
                >
                  <Photo name={c.image} alt={c.title} />
                  <small>Sample cargo · {c.location}</small>
                  <h2>{c.title}</h2>
                  <p>{c.quantity}</p>
                  <strong>US$ {c.price.toLocaleString()}</strong>
                  <span className="text-button">
                    Explore cargo <Icon name="arrow" size={15} />
                  </span>
                </Link>
              ))}
          </div>
          {!cargo.some((c) =>
            `${c.title} ${c.location}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          ) && (
            <div className="empty-state">
              <h3>No cargo matches your search.</h3>
              <Link className="outline-button" href="/unclaimed-cargo/create">
                Prepare a cargo listing
              </Link>
            </div>
          )}
        </>
      )}
    </>
  );
}
