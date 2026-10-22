"use client";
import Link from "next/link";
import { useState } from "react";
import { allPages, PageEntry, PageKind } from "../../app/route-map";
import { pageTypes } from "../../lib/page-types";
import { Icon } from "../../app/ui";
import { Intro } from "../shared/presentation";
import { usePageController } from "../../hooks/use-page-controller";

export default function PageDirectoryPage({ entry }: { entry: PageEntry }) {
  const { query, searchBar } = usePageController();
  const [view, setView] = useState("types");
  const [group, setGroup] = useState("");
  const types = Object.entries(pageTypes) as [
    PageKind,
    (typeof pageTypes)[PageKind],
  ][];
  const filtered = types.filter(
    ([kind, t]) =>
      (!group || t.group === group) &&
      `${kind} ${t.title} ${t.group} ${t.features.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <Intro
        entry={entry}
        description={`${types.length} page types implemented across ${allPages.length} local URLs. Open an example of each screen below.`}
      />
      <div className="page-type-summary">
        <div>
          <strong>{types.length}</strong>
          <span>Page types</span>
        </div>
        <div>
          <strong>{allPages.length}</strong>
          <span>Connected URL routes</span>
        </div>
        <div>
          <Icon name="grid" size={28} />
          <span>Reusable components</span>
        </div>
      </div>
      <p className="form-note notice">
        All interfaces include local workflows. Accounts store private drafts
        and saved products in the database. Catalog data remains illustrative;
        message delivery, carrier updates and webinar recordings are not
        connected.
      </p>
      <div
        className="workspace-tabs"
        role="group"
        aria-label="Page directory view"
      >
        <button
          className={view === "types" ? "active" : ""}
          aria-pressed={view === "types"}
          onClick={() => setView("types")}
        >
          {types.length} page types
        </button>
        <button
          className={view === "urls" ? "active" : ""}
          aria-pressed={view === "urls"}
          onClick={() => setView("urls")}
        >
          All URL routes
        </button>
      </div>
      <div className="listing-controls">
        {searchBar(
          view === "types"
            ? "Search page types and features"
            : "Search all pages",
        )}
        {view === "types" && (
          <select
            aria-label="Filter page group"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          >
            <option value="">All groups</option>
            {[...new Set(types.map(([, t]) => t.group))].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        )}
      </div>
      {view === "types" ? (
        <>
          <div className="page-type-grid">
            {filtered.map(([kind, t], index) => {
              const paths = allPages.filter((p) => p.kind === kind);
              const example = paths.find((p) => !p.key) || paths[0];
              return (
                <article
                  key={kind}
                  className="page-type-card"
                  data-page-type={kind}
                >
                  <div>
                    <span className="page-type-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="draft-badge">{t.group}</span>
                  </div>
                  <h2>{t.title}</h2>
                  <ul>
                    {t.features.map((feature) => (
                      <li key={feature}>
                        <Icon name="check" size={14} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <small>
                    {paths.length} URL {paths.length === 1 ? "route" : "routes"}
                  </small>
                  <Link href={example.path}>
                    Open example <Icon name="arrow" size={16} />
                  </Link>
                </article>
              );
            })}
          </div>
          {!filtered.length && (
            <div className="empty-state">
              <h3>No page types match your filters.</h3>
              <button className="outline-button" onClick={() => setGroup("")}>
                Clear group filter
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="site-map-list">
          {allPages
            .filter((p) =>
              `${p.title} ${p.path}`
                .toLowerCase()
                .includes(query.toLowerCase()),
            )
            .map((p) => (
              <Link key={p.path} href={p.path}>
                <strong>{p.title}</strong>
                <small>{p.path}</small>
                <Icon name="arrow" size={15} />
              </Link>
            ))}
        </div>
      )}
    </>
  );
}
