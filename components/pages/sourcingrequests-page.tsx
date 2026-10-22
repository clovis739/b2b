"use client";
import Link from "next/link";
import { useState } from "react";
import { PageEntry } from "../../app/route-map";
import { requests } from "../../app/site-data";
import { Icon } from "../../app/ui";
import { Intro } from "../shared/presentation";

import { usePageController } from "../../hooks/use-page-controller";

export default function SourcingRequestsPage({ entry }: { entry: PageEntry }) {
  const { query, setQuery, country, setCountry, searchBar, form } =
    usePageController();
  const [sector, setSector] = useState("");
  const filtered = requests.filter(
    (r) =>
      (!country || r.country === country) &&
      (!sector || r.sector === sector) &&
      `${r.title} ${r.country} ${r.sector}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );

  const found = requests.find((r) => r.id === entry.key);
  return (
    <>
      <Intro
        entry={entry}
        description="Explore buyer requirements and prepare your next business proposal."
      />
      {found ? (
        <div className="form-page-layout">
          <article className="content-panel">
            <span className="sample-pill static">Sample request</span>
            <h2>{found.title}</h2>
            <dl className="spec-table">
              {[
                ["Quantity", found.quantity],
                ["Delivery country", found.country],
                ["Buyer", found.buyer],
                ["Sector", found.sector],
                ["Posted", found.date],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p>{found.description}</p>
          </article>
          {form("quote", "Prepare your quotation")}
        </div>
      ) : (
        <>
          <div className="listing-controls">
            {searchBar("Search buyer requests")}
            <select
              aria-label="Request sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            >
              <option value="">All sectors</option>
              {[...new Set(requests.map((r) => r.sector))].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              aria-label="Delivery country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">All countries</option>
              {[...new Set(requests.map((r) => r.country))].sort().map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <Link className="primary" href="/rfqs/add-rfq">
              Create request <Icon name="arrow" size={16} />
            </Link>
          </div>
          <div className="request-list">
            {filtered.map((r) => (
              <article key={r.id}>
                <div>
                  <span className="page-kicker">
                    {r.sector} · SAMPLE REQUEST
                  </span>
                  <h2>
                    <Link href={`/sourcing-request/listing/${r.id}`}>
                      {r.title}
                    </Link>
                  </h2>
                  <p>{r.description}</p>
                  <div className="request-meta">
                    <span>
                      <Icon name="box" size={15} />
                      {r.quantity}
                    </span>
                    <span>
                      <Icon name="location" size={15} />
                      {r.country}
                    </span>
                    <span>{r.date}</span>
                  </div>
                </div>
                <Link
                  className="outline-button"
                  href={`/sourcing-request/listing/${r.id}`}
                >
                  Quote now <Icon name="arrow" size={16} />
                </Link>
              </article>
            ))}
          </div>
          {!filtered.length && (
            <div className="empty-state">
              <h3>No requests match your filters.</h3>
              <button
                className="outline-button"
                onClick={() => {
                  setQuery("");
                  setCountry("");
                  setSector("");
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
