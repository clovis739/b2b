"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion";
import { Icon } from "../../app/ui";
import { siteProducts, productPath } from "../../app/site-data";
import SectionHeading from "./section-heading";
const services = [
  {
    title: "B2B Marketplace",
    href: "/b2bmarket",
    icon: "box",
    description:
      "Explore wholesale products, find companies in new markets, and create your next business connection.",
    image: "vegetables",
  },
  {
    title: "Freight Calculator",
    href: "/freight-calculator",
    icon: "ship",
    description:
      "Start with a route and container type. Compare indicative estimates and prepare a shipping inquiry.",
    image: "shipping",
  },
  {
    title: "Load Calculator 3D",
    href: "/load-calculator",
    icon: "grid",
    description:
      "Add dimensions and quantity to estimate container capacity, cargo volume and the space your shipment needs.",
    image: "containers",
  },
  {
    title: "Event Calendar",
    href: "/events-calendar",
    icon: "globe",
    description:
      "Discover trade events and exhibitions to connect with your industry beyond the screen.",
    image: "event",
  },
  {
    title: "Unclaimed Cargo",
    href: "/unclaimed-cargo-promo",
    icon: "box",
    description:
      "Explore available lots and help cargo owners find a new path to market.",
    image: "industry",
  },
];
function MarketplacePreview() {
  return (
    <div className="clone-market-preview">
      <aside>
        <strong>All sectors</strong>
        {[
          "Agriculture",
          "Apparel",
          "Beauty & Personal Care",
          "Chemicals",
          "Construction",
        ].map((t) => (
          <span key={t}>
            <Icon name="box" size={12} />
            {t}
          </span>
        ))}
      </aside>
      <div>
        <strong>New suppliers</strong>
        <div className="preview-suppliers">
          {["BKS EXIM LLP", "Shivam Cosmetic", "Global Trading"].map((t) => (
            <div key={t}>
              <b>{t}</b>
              <small>Wholesale & export</small>
              <span>All products　　Chat</span>
            </div>
          ))}
        </div>
        <strong>Popular products</strong>
        <div className="preview-products">
          {siteProducts.slice(0, 4).map((p) => (
            <Link href={productPath(p)} key={p.id}>
              <div>
                <Image
                  src={`/images/${p.image}.jpg`}
                  alt={p.name}
                  fill
                  sizes="160px"
                />
              </div>
              <span>{p.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
export default function ServiceTabs() {
  const [active, setActive] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        if (panel.current)
          gsap.fromTo(
            panel.current.children,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.055,
              ease: "power3.out",
              clearProps: "opacity,transform",
            },
          );
      });
      return () => media.revert();
    },
    { dependencies: [active], revertOnUpdate: true },
  );
  const service = services[active];
  return (
    <section className="clone-section">
      <SectionHeading title="One platform for all your business needs" />
      <div
        className="service-slider-controls"
        aria-label="Service slider controls"
      >
        <span aria-live="polite">
          {active + 1} / {services.length}
        </span>
        <button
          type="button"
          className="carousel-arrow"
          aria-label="Previous service"
          onClick={() =>
            setActive((active + services.length - 1) % services.length)
          }
        >
          <Icon name="left" size={16}/>
        </button>
        <button
          type="button"
          className="carousel-arrow"
          aria-label="Next service"
          onClick={() => setActive((active + 1) % services.length)}
        >
          <Icon name="arrow" size={16}/>
        </button>
      </div>
      <div
        className="clone-service-tabs"
        role="tablist"
        aria-label="Platform services"
      >
        {services.map((s, i) => (
          <button
            key={s.title}
            id={`service-tab-${i}`}
            role="tab"
            aria-selected={i === active}
            aria-controls="service-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
                e.preventDefault();
                const next =
                  e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? 4
                      : (active + (e.key === "ArrowRight" ? 1 : 4)) % 5;
                setActive(next);
                document.getElementById(`service-tab-${next}`)?.focus();
              }
            }}
          >
            <span>
              <Icon name={s.icon} size={20} />
            </span>
            {s.title}
          </button>
        ))}
      </div>
      <div
        className="clone-service-content"
        ref={panel}
        style={{ touchAction: "pan-y pinch-zoom" }}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse")
            gesture.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          if (!gesture.current) return;
          const dx = e.clientX - gesture.current.x;
          const dy = e.clientY - gesture.current.y;
          gesture.current = null;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy))
            setActive(
              (active + (dx < 0 ? 1 : services.length - 1)) % services.length,
            );
        }}
        onPointerCancel={() => {
          gesture.current = null;
        }}
        id="service-panel"
        role="tabpanel"
        aria-labelledby={`service-tab-${active}`}
      >
        <div>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <Link href={service.href} className="clone-link-button">
            Learn more <Icon name="arrow" size={19} />
          </Link>
        </div>
        <div className="clone-service-visual">
          {active === 0 ? (
            <MarketplacePreview />
          ) : (
            <>
              <Image
                src={`/images/${service.image}.jpg`}
                alt={service.title}
                fill
                sizes="(max-width:750px) 100vw, 55vw"
              />
              <div className="service-preview-caption">
                <Icon name={service.icon} size={28} />
                <span>
                  {service.title}
                  <small>Explore the connected tools</small>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
