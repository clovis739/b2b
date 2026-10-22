"use client";
import Link from "next/link";
import { PageEntry } from "../../app/route-map";

import { Icon } from "../../app/ui";
import { Photo } from "../shared/presentation";
import LogisticsTools from "../../app/tools";

import MarketingDetails from "./marketing-details";

export default function MarketingPage({ entry }: { entry: PageEntry }) {
  const configs: Record<
    string,
    {
      headline: string;
      desc: string;
      image: string;
      cta: string;
      href: string;
      secondary: string;
      secondHref: string;
    }
  > = {
    "rfq-promo": {
      headline: "One request.\nA world of possibilities.",
      desc: "Tell suppliers what you need. Start with a clear sourcing request and build your next business connection.",
      image: "office",
      cta: "Create a sourcing request",
      href: "/rfqs/add-rfq",
      secondary: "Browse buyer requests",
      secondHref: "/sourcing-request/listing",
    },
    "cargo-promo": {
      headline: "A new destination.\nA fresh opportunity.",
      desc: "Connect available cargo with businesses looking for their next sourcing opportunity.",
      image: "containers",
      cta: "Browse available cargo",
      href: "/unclaimed-cargo",
      secondary: "List your cargo",
      secondHref: "/unclaimed-cargo/create",
    },
    "suppliers-promo": {
      headline: "Your business.\nReady for the world.",
      desc: "Showcase your products, explore buyer requests, and build connections beyond borders.",
      image: "industry",
      cta: "Become a supplier",
      href: "/auth/sign-up/supplier/create-account",
      secondary: "Explore buyer requests",
      secondHref: "/sourcing-request/listing",
    },
    logistics: {
      headline: "Every shipment.\nMore connected.",
      desc: "From a first cost estimate to the final destination, bring your logistics planning into one place.",
      image: "shipping",
      cta: "Calculate freight",
      href: "/freight-calculator",
      secondary: "Request a freight quote",
      secondHref: "/freight-calculator/freight-request",
    },
    about: {
      headline: "A world of trade.\nCloser together.",
      desc: "We believe better connections create better opportunities. Vantora brings sourcing, suppliers and logistics into a shared experience.",
      image: "office",
      cta: "Explore the marketplace",
      href: "/b2bmarket",
      secondary: "Get in touch",
      secondHref: "/contact-us",
    },
  };
  const c = configs[entry.kind];
  return (
    <>
      <section className="split-hero">
        <div>
          <span className="page-kicker">{entry.title.toUpperCase()}</span>
          <h1>{c.headline}</h1>
          <p>{c.desc}</p>
          <div className="button-row">
            <Link className="primary" href={c.href}>
              {c.cta}
              <Icon name="arrow" size={16} />
            </Link>
            <Link className="text-button" href={c.secondHref}>
              {c.secondary} <Icon name="arrow" size={16}/>
            </Link>
          </div>
        </div>
        <Photo name={c.image} alt="Global business and logistics" />
      </section>
      <MarketingDetails kind={entry.kind} />
      <section className="page-section">
        <div className="section-title">
          <h2>Make the next connection count.</h2>
        </div>
        <div className="three-column">
          {[
            [
              "01",
              "Discover the possibilities",
              "Explore businesses, products and tools that fit your next move.",
            ],
            [
              "02",
              "Start a conversation",
              "Share clear requirements and keep all the details together.",
            ],
            [
              "03",
              "Plan the way forward",
              "Compare options and prepare for your next business opportunity.",
            ],
          ].map(([n, t, d]) => (
            <div className="info-card" key={n}>
              <span className="step-number">{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>
      {entry.kind === "logistics" ? (
        <LogisticsTools kind="index" />
      ) : (
        <section className="services-section">
          <div>
            <span className="page-kicker">BUILT AROUND BUSINESS</span>
            <h2>More ways to move forward.</h2>
            <p>Bring your sourcing and shipment planning together.</p>
          </div>
          <div className="service-grid">
            {[
              ["B2B Marketplace", "/b2bmarket", "box"],
              ["Freight calculator", "/freight-calculator", "ship"],
              ["Trade events", "/events-calendar", "globe"],
              ["Industry insights", "/blog", "leaf"],
            ].map(([title, href, icon]) => (
              <Link key={href} href={href}>
                <Icon name={icon} size={26} />
                <h3>{title}</h3>
                <Icon name="arrow" size={17} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
