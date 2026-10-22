"use client";
import Link from "next/link";
import { PageEntry } from "../../app/route-map";

import { Icon } from "../../app/ui";
import { Intro } from "../shared/presentation";
import LogisticsTools from "../../app/tools";

import { usePageController } from "../../hooks/use-page-controller";

export default function LogisticsPage({ entry }: { entry: PageEntry }) {
  const {} = usePageController();
  return (
    <>
      {entry.kind === "load" ? (
        <header className="load-page-heading">
          <span className="page-kicker">PLAN YOUR SPACE</span>
          <h1>
            {entry.key === "pallets"
              ? "Pallet Container Calculator"
              : entry.key === "cbm"
                ? "Container CBM Calculator"
                : entry.key === "boxes"
                  ? "Container Loading Calculator"
                  : "Load calculator"}
          </h1>
          <p>
            Plan product quantities, equipment capacity and your next cargo
            load.
          </p>
        </header>
      ) : entry.kind === "landed" ? (
        <header className="landed-page-heading">
          <h1>Landed Cost &amp; Margin Calculator</h1>
          <p>
            Plan the full cost of your order and compare it with your expected
            selling price.
          </p>
        </header>
      ) : (
        <Intro
          entry={entry}
          description="Tools to help you understand the next step in your logistics journey."
        />
      )}
      <LogisticsTools kind={entry.kind} variant={entry.key} />
      {entry.kind !== "landed" && entry.kind !== "load" && (
        <section className="page-section">
          <div className="section-title">
            <h2>Keep your shipment moving.</h2>
          </div>
          <div className="three-column">
            {[
              [
                "Freight planning",
                "/freight-calculator",
                "Compare illustrative route estimates.",
              ],
              [
                "Load planning",
                "/load-calculator",
                "Check cargo dimensions and capacity.",
              ],
              [
                "Custom requirements",
                "/freight-calculator/freight-request",
                "Keep your shipping requirements in one brief.",
              ],
            ].map(([t, h, d]) => (
              <Link className="info-card" href={h} key={h}>
                <Icon name="ship" />
                <h3>{t}</h3>
                <p>{d}</p>
                <Icon name="arrow" size={17} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
